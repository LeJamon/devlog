---
title: Fix: Terminal Mouse Wheel Scrolling
date: 2026-07-14
description: Resolved an issue where mouse wheel scrolling events were not correctly propagating to the terminal emulator in the RVR project.
tags:
  - rvr
  - terminal
  - ux
---

### Issue
Users reported that the terminal interface failed to respond to mouse wheel input, preventing vertical navigation within command outputs.

### Implementation
- Integrated mouse event listener updates within the terminal rendering component.
- Adjusted event delegation to ensure wheel events are intercepted by the scroll handler rather than being swallowed by the parent container.
- Verified event propagation in both standard and fullscreen modes.