---
title: Release Notes: TLS Lifecycle Hardening and Escrow Invariants
date: 2026-08-04
description: Addressing TLS transport stability and escrow state machine hardening in go-xrpl.
tags:
  - tls
  - escrow
  - networking
---

### Peer TLS Lifecycle Fixes
Recent updates (PR #1564) implement lossless TLS lifecycle management. Key improvements include:
- **Full-Duplex Ordering:** Fixed issues regarding output ordering during full-duplex TLS communication.
- **Output Preservation:** Implemented logic to preserve TLS buffers and output state following transport failures, preventing packet loss during reconnections.

### Escrow Logic Improvements
Updates (PR #1563) harden the escrow lifecycle invariants. These changes ensure that state transitions within the escrow engine are atomic and strictly validated against protocol requirements, mitigating potential edge cases during lifecycle updates.