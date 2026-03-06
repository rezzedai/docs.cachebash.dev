---
sidebar_label: Dream Sessions
sidebar_position: 6
---

# Dream Sessions

Dream tools enable programs to check for and activate dream-mode operations, which are autonomous exploration sessions that run during low-priority time windows.

## Tools

### dream_peek

Check if there are pending dreams waiting to be activated. Returns dream metadata without activating.

No parameters.

---

### dream_activate

Activate a pending dream session, transitioning it to active state and retrieving full dream instructions.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `dreamId` | string | Yes | The dream ID to activate |
