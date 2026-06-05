---
project: true
name: go-xrpl
title: go-xrpl
description: A native Go implementation of an XRP Ledger node — consensus, transaction engine, and protocol codec, validated against rippled.
status: active
order: 1
repo: https://github.com/LeJamon/goXRPLd
tags:
  - go
  - xrpl
  - consensus
  - blockchain
---

# go-xrpl

A from-scratch XRP Ledger node written in Go. The goal is a faithful,
production-grade alternative to `rippled` (the C++ reference) — same consensus,
same transaction semantics, byte-identical ledgers — with the readability and
tooling of the Go ecosystem.

**Rippled is the source of truth.** Every transaction type, ledger object, and
RPC method is cross-checked against the C++ implementation, and the test suite
exists to catch the moment our ledgers stop agreeing with it.

- **Module:** `github.com/LeJamon/goXRPLd`
- **Reference:** `rippled` (C++)
- **Surface:** 25+ transaction types, 40+ ledger objects, 60+ RPC methods,
  full consensus + peer protocol

## Devlog

<PostFeed project="go-xrpl" />
