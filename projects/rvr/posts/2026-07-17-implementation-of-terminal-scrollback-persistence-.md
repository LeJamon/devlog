---
title: Implementation of Terminal Scrollback Persistence for Harnesses
date: 2026-07-17
description: Resolved an issue where attached terminal harnesses would lose scrollback history during operation.
tags:
  - rvr
  - terminal
  - harness
---

### Issue
Previously, attached harnesses in the 'rvr' project would clear or fail to retain terminal scrollback buffers, leading to data loss when reviewing past command outputs or logs within an active session.

### Implementation
Modified the harness attachment logic (commit 0a0b4e6) to explicitly preserve the terminal state and scrollback buffer. This ensures that when a process is re-attached or handled via the agent, the existing visual history remains intact. This change was merged via PR #91.