---
title: Getting validators to rejoin after a fall-behind
date: 2026-06-05
author: go-xrpl
description: Catch-up worked fine in isolation but the network could still wedge. The real failure was a quorum-loss double-fault — and a node pinned to the wrong ledger that never completed the switch.
tags:
  - consensus
  - liveness
  - networking
  - bugfix
---

Catch-up is one of those features that looks done and then isn't. A node that
falls behind should acquire the ledgers it missed and rejoin. Ours did — in the
clean case. Under load, a mixed `rippled` + `go-xrpl` network could still wedge,
and untangling *why* meant separating three failure modes that all look like
"the network stopped advancing."

## First: prove catch-up is actually sound

Before touching code, we ran the controlled experiment: 4 `rippled` validators
+ 1 `go-xrpl`, pause the `go-xrpl` node, let the network validate well ahead,
then unpause. It caught up to the validated tip in about 20 seconds. So plain
catch-up was **not** the bug. Good — that ruled out a whole branch of theories.

## The real failure: a quorum-loss double-fault

The wedge needed two quorum-critical `go-xrpl` nodes to fall behind *together*.
With both behind, there was no longer a quorum producing validations, so the
network stopped publishing a validated tip at all. And a node can't catch up to
a validated ledger that nobody is validating. Deadlock — not because catch-up is
broken, but because there's nothing to catch up *to*.

We confirmed it was `go-xrpl`-specific with clean controls:

- 5 `rippled`, pause one → recovers fully.
- 3 `rippled` + 2 `go-xrpl`, pause both `go-xrpl` → one stays wedged at ledger 8.

A control that recovers and a control that doesn't, differing only by which
implementation is under stress, is about as clean as a distributed-systems
repro gets.

## The pin: stuck on `wrongLedgerID`

The second half was a node that *had* forked during a restart and then couldn't
rejoin even once validations resumed. It knew it was on the wrong ledger — it
had set `wrongLedgerID` — but it never **completed the switch** to the right one.

In `rippled`, when you discover you're on the wrong ledger and you can actually
get the correct one, you finish the swap and re-evaluate. Our `checkLedger`
detected the wrong-ledger condition but only completed the switch on one
acquisition path; when the correct ledger arrived via a different route
(held-adoption / non-`OnLedger` acquisition), we stayed pinned on
`wrongLedgerID` instead of adopting it.

The fix mirrors rippled's `checkAccept` re-evaluation: when `GetLedger(netLgr)`
succeeds, **complete the switch** rather than waiting for the one path we
happened to special-case. Twelve lines added, two removed, gated on support so
it can't act on an unvalidated guess. With it, the failing control recovers:
both `go-xrpl` nodes rejoin.
