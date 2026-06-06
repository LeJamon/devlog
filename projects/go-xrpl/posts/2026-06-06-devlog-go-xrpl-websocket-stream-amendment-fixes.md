---
title: Devlog: go-xrpl - WebSocket Stream & Amendment Fixes
date: 2026-06-06
description: Technical deep dive into recent fixes in go-xrpl, focusing on WebSocket stream data formatting and amendment handling.
tags:
  - go-xrpl
  - websocket
  - amendments
---

This devlog entry covers several key fixes implemented in the `go-xrpl` project, primarily addressing data formatting in WebSocket subscription streams and refining the handling of XRPL amendments.

### WebSocket Stream Formatting

**Problem:** Previously, hexadecimal values emitted in WebSocket subscription streams were sometimes in lowercase, and the `validation-stream` cookie was emitted as a hexadecimal string. This deviated from the expected format, potentially causing issues with clients expecting uppercase hex and decimal formats.

**Fix:**
*   Uppercase hexadecimal formatting is now enforced for all values in WebSocket subscription streams, ensuring consistency with XRPL standards.
*   The `validation-stream` cookie is now correctly emitted as a decimal value, aligning with the `rippled` behavior.
*   Issue #[787] specifically addresses the uppercase hex formatting.

### Amendment Handling

**Problem:** The logic for treating obsolete-supported amendments, particularly in the context of the NFToken `temDISABLED` fork, required refinement. Incorrect gating and permanent enabling of these amendments could lead to unexpected behavior or non-compliance with network upgrades.

**Fix:**
*   Obsolete-supported amendments are now treated as permanently enabled, but the gating mechanism has been adjusted. Specifically, obsolete NFToken amendments are now gated via `V1_1` rather than being unconditionally permanently enabled.
*   This change ensures that amendments, even when obsolete and supported, are managed according to their designated protocol versions, preventing premature or incorrect activation.

### Overlay Context Handling

**Problem:** A potential race condition existed between the `Run` and `Stop` methods in the overlay component when handling context cancellation. This could lead to panics or unexpected behavior during shutdown.

**Fix:** The context and cancellation mechanisms within the overlay component have been guarded to prevent races. A related test lint issue has also been resolved.