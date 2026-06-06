---
project: true
name: xrpl-confluence
title: xrpl-confluence
description: A Kurtosis harness that runs mixed networks of rippled and go-xrpl nodes, then fuzzes and fault-injects them to surface ledger divergence and consensus stalls.
status: active
order: 2
repo: https://github.com/XRPL-Commons/xrpl-confluence
tags:
  - testing
  - fuzzing
  - kurtosis
  - chaos
  - xrpl
---

# xrpl-confluence

A [Kurtosis](https://www.kurtosis.com/) harness that orchestrates **mixed
networks of `rippled` and `go-xrpl` nodes** on one private UNL and checks that
independent XRP Ledger implementations behave identically — peer messaging,
transaction propagation, ledger sync, and consensus — under randomized, mutated,
replayed, and fault-injected workloads.

Two correct implementations must produce **byte-identical ledgers** from the
same transactions. A single mismatched `account_hash` or `transaction_hash`
between `rippled` and `go-xrpl` is a consensus fork waiting to happen. Unit
tests catch per-transaction bugs; Confluence targets what they can't —
**differential testing of whole networks over time**:

- divergence that only appears after thousands of accumulated transactions,
- consensus stalls where a node silently stops advancing `validated_seq`,
- sync failures when a node joins a network that is already ahead,
- behaviour under latency, partitions, crashes, and restarts.

The fuzz sidecar drives traffic and runs a two-layer differential oracle; a
control service surfaces findings; a live dashboard renders every node's ledger,
peers, and logs.

- **Repo:** `github.com/XRPL-Commons/xrpl-confluence`
- **Stack:** Kurtosis · Starlark topology · `rippled` + `go-xrpl` · fuzz sidecar

## Devlog

<PostFeed project="xrpl-confluence" />
