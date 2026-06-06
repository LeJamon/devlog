---
title: What xrpl-confluence is, and why we built it
date: 2026-06-04
author: xrpl-confluence
description: A mixed-network fuzz and chaos lab for XRPL nodes — what it is, why Kurtosis is the right substrate, and how it actually helps us ship a correct go-xrpl.
tags:
  - intro
  - testing
  - kurtosis
  - chaos
---

Building a second implementation of a blockchain node is mostly an exercise in
*staying identical* to the first one. For go-xrpl, the bar isn't "does the code
run" — it's "does this node compute the exact same ledger `rippled` would,
forever." xrpl-confluence is the lab we built to keep ourselves honest about
that.

## What it is

xrpl-confluence is a harness that spins up a **mixed network of `rippled` and
`go-xrpl` nodes** on one private UNL, then drives that network with realistic
and adversarial workloads and checks — continuously — that every node agrees.

Two correct XRPL implementations must produce **byte-identical ledgers** from
the same transactions. A single mismatched `account_hash` or `transaction_hash`
between `rippled` and `go-xrpl` is a consensus fork waiting to happen on a real
network. Confluence's job is to provoke that disagreement in a sandbox, on our
terms, before it ever reaches mainnet.

It's a differential tester for *whole networks over time* — not single
transactions. Concretely, it watches for the failure modes unit tests can't:

- **state divergence** that only shows up after thousands of accumulated
  transactions,
- **consensus stalls** where a node silently stops advancing `validated_seq`,
- **sync failures** when a node joins a network that's already ahead,
- **behaviour under faults** — latency, partitions, crashes, restarts.

## Why Kurtosis

A differential test of a peer-to-peer network needs a real network: multiple
containers, real ports, real gossip, real consensus rounds. The hard part isn't
running one node — it's making the *whole topology* reproducible, disposable,
and identical on a laptop and in CI. That's exactly what
[Kurtosis](https://www.kurtosis.com/) gives us.

- **The topology is code.** A Starlark script generates validator keys and
  per-node config so every `rippled` and `go-xrpl` node forms one private UNL
  with the right quorum. Want 3 rippled + 2 go-xrpl, or 5 + 5? Change a number,
  not a pile of YAML and shell glue.
- **Enclaves are ephemeral and isolated.** Each run is a clean, named enclave we
  can stand up and tear down deterministically — no leftover state poisoning the
  next run, no "works on my machine."
- **Same definition everywhere.** The same scenario runs locally and in CI, so a
  finding reproduces instead of evaporating.
- **It speaks containers natively.** We bring our own images (`rippled`,
  `go-xrpl`, the fuzz sidecar) and Kurtosis wires up the peer, RPC, and
  WebSocket ports between them.

In short: Kurtosis lets us treat a *whole multi-node network* as a single, version
-controlled, throwaway test fixture. Everything else — the fuzzer, the oracle,
the dashboard — plugs into that.

## What actually runs

Inside the enclave:

1. **Topology** generates keys and config so all nodes share one UNL.
2. **Nodes** launch from our `rippled` and `go-xrpl` images, each exposing peer,
   RPC, and WebSocket ports.
3. **The fuzz sidecar** submits transactions — randomized, mutated, replayed —
   and runs a two-layer differential oracle over the resulting ledgers.
4. **The control service** exposes findings and live events and runs the
   standing `consensus_stall` and `state_divergence` oracles.
5. **The dashboard** renders a live view of every node's ledger, peers, and logs.

Scenarios are declarative: a YAML file pins the topology, the workload, and a
budget, so "run 3 rippled + 2 go-xrpl under a sustained mixed load" is one
command.

## How it helps us build the node

The point isn't the harness — it's the bugs it catches that nothing else does.
Confluence is where go-xrpl's divergences from `rippled` surface as concrete,
reproducible findings: an oracle fires, the control service captures the corpus,
and we get a reproducer we can replay against the C++ reference until our ledger
matches byte for byte.

It also sits in a clear place in the wider stack:

- **Fixtures** answer *"does this one transaction produce the right result?"*
- **Hive** runs conformance suites across implementations.
- **Confluence** answers *"do these two implementations stay in lockstep across a
  whole network, for hours, under stress?"*

That last question is the one that actually decides whether go-xrpl can stand on
the real network — and it's the one you can only answer by running the network.
