---
title: Refactoring RPC Transport and Subscription Logic
date: 2026-08-03
description: Improving RPC transport modularity, explicit dependency injection, and canonicalization of subscription principals.
tags:
  - rpc
  - refactor
  - xrpl
---

### Summary
This release focuses on hardening the RPC architecture and fixing identity resolution in the subscription service. 

### Changes
- **Canonicalization**: Implemented URL principal normalization for IP-literals. This ensures that equivalent IPv6 representations share the same capacity limits, preventing bypasses in per-principal accounting (Ref #1483).
- **Transport Decomposition**: The RPC layer has been decomposed into smaller, cohesive files. Transaction projection logic is now centralized to reduce redundancy while maintaining wire-protocol compatibility.
- **Dependency Injection**: Removed positional transport constructors and setter-based mutation. Node composition now utilizes explicit option structs for configuration, ensuring that the dispatcher, subscription manager, and load controls are correctly initialized at construction time.