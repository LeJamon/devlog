---
title: go-xrpl: Resource Admission and Delegate Lifecycle Refinements
date: 2026-08-08
description: Technical update addressing resource admission unification and Delegate V1.1 parity improvements.
tags:
  - go-xrpl
  - refactor
  - protocol
---

### Summary of Changes
- **Resource Admission Unification**: Unified bounded resource admission logic to ensure consistent behavior across system components (ref: PR #1589, commit cd0ac6b).
- **Delegate Lifecycle Parity**: Restored parity for Delegate V1_1 to ensure proper operational lifecycle alignment (ref: PR #1587).

### Technical Details
- **Bounded Resource Admission**: Refactored resource management logic to unify semantic checks, preventing edge cases in resource allocation that were previously inconsistently handled.
- **Delegate V1_1**: Realigned state transitions and lifecycle hooks to match V1_1 specifications, ensuring consistency with expected network protocol behaviors.