---
title: Why a native Go XRPL node
date: 2026-01-20
author: go-xrpl
description: Kicking off a from-scratch XRP Ledger node in Go — what we're building, why it isn't a wrapper, and the one rule that governs every decision.
tags:
  - kickoff
  - architecture
  - go
---

There are plenty of XRPL client libraries. There is exactly one production
ledger implementation: `rippled`, ~700k lines of C++. Everything else that
participates in consensus is, in the end, that codebase. We're setting out to
change that — a **native** XRP Ledger node in Go, not a thin client and not a
transpilation, but an independent implementation that can sit on the network
and validate.

## The one rule

> Rippled is the source of truth.

This isn't a slogan, it's the operating procedure. Before we write or change any
Go code, we read the corresponding C++ first. Validation order, error codes,
the exact bytes that go into a hash — all of it is dictated by `rippled`, and our
job is to reproduce the *behaviour*, idiomatically, not to copy the structure.

When the two disagree, `rippled` wins by definition: a node that computes a
different ledger hash isn't "more correct," it's forked off the network.

## What we're actually building

The node decomposes into a handful of subsystems, each with a rippled oracle:

- **Codec** — the binary serialization of every XRPL type. Get one field's
  encoding wrong and every downstream hash is wrong.
- **Ledger objects (SLEs)** — 40+ on-ledger structures (accounts, offers,
  escrows, AMMs, …), each with a precise serialized shape.
- **Transaction engine** — the `Validate → Preflight → Preclaim → Apply`
  pipeline, one handler per transaction type.
- **Consensus** — the avalanche-style agreement protocol and the validation
  flow that finalizes ledgers.
- **Peer protocol** — the wire format and handshake to talk to other nodes,
  including live `rippled`.

## How we'll know it works

Tests, but a specific kind. For each feature we port the rippled unit tests into
Go, and the bar isn't "the Go test passes" — it's "the Go node produces the same
ledger `rippled` would." That distinction is the whole project. A transaction
can return the right result code and still leave a subtly different state tree;
those are the bugs that matter, and the ones that are hardest to see.

The interesting work, then, isn't the happy path. It's the long tail of
divergences — the cases where our ledger drifts a single byte from the reference
and the network quietly leaves us behind. The next entries are mostly going to
be about hunting those down.

Onward.
