---
title: Chasing an account_hash fork
date: 2026-05-09
author: go-xrpl
description: A whole class of state-divergence bugs traced to one habit — serializing directory-node fields as zero. Why the metadata looked perfect while the ledger quietly forked.
tags:
  - consensus
  - serialization
  - debugging
  - bugfix
---

A node can pass every transaction test and still be wrong. This is the story of
a bug class that did exactly that: the transaction result matched `rippled`, the
transaction metadata matched `rippled`, and the **account state hash did not**.

## Two hashes, two failure modes

Every closed ledger commits to two trees we care about here:

- `transaction_hash` — the set of transactions and their metadata.
- `account_hash` — the state tree (every SLE).

That split turns out to be a precise diagnostic. We learned to read it like this:

> A `transaction_hash`-only fork is a **metadata** bug.
> An `account_hash`-only fork is an **SLE serialization** bug.

Our fork was `account_hash`-only. So the transactions were being *applied* the
same way `rippled` applies them — the divergence was in the *bytes we wrote for
an object*, not in the logic that decided to write it.

## The culprit: directory nodes serialized as zero

When an object is owned by an account, it's threaded into an owner directory,
and the SLE records *which page* via fields like `OwnerNode`, `DestinationNode`,
`SubjectNode`. When `EscrowCreate` builds a new escrow, `rippled` inserts it into
both the owner's and the destination's directories, and stores the resulting
page indexes on the SLE.

We were doing the directory insert — and then **discarding the page index and
serializing the field as `0`** (or omitting it). For escrows that fit on the
first page, page index *is* zero, so everything matched. The moment pagination
or a cross-account directory pushed the entry onto a non-zero page, our SLE
bytes diverged from rippled's, `account_hash` split, and the node forked.

## Why it was invisible

Here's the part that cost the most time. We have invariant checks and we audit
`AffectedNodes` in metadata. Neither caught it — because **rippled's metadata
omits zero-valued `NewFields`**. When the correct value happened to be non-zero,
rippled's `NewFields` carried it but ours didn't, yet the *diff we were auditing*
was computed against our own (wrong) state, so it looked self-consistent.

The lesson, written down so we don't relearn it:

- `account_hash`-only fork ⇒ suspect SLE serialization, **not** metadata or the
  apply logic. Metadata/`AffectedNodes` audits are blind to it because rippled
  omits zero-valued new fields.
- Always verify a diagnosis against rippled **source + blame**, not intuition.
  Our first two theories on this bug were both wrong.

## The fix, and the sweep

The fix for `EscrowCreate` was small: keep the page index returned by the
directory insert and serialize it. But a bug *class* deserves a *sweep*. We went
through every transaction that creates a directory-threaded object and checked
the same pattern — and found it in DID, SignerList, Ticket, MPT, and Credential
creation too. All of them were writing a directory-node field as a hardcoded
zero while throwing away the real page.

One habit, six transactions, one silent fork. Fixed as a pair of changes: the
specific `EscrowCreate` fix and a bug-class sweep across the rest.

The takeaway isn't "we had a serialization bug." It's that the *shape* of a
divergence tells you where to look — and that an audit which only ever compares
you to yourself will happily confirm a fork.
