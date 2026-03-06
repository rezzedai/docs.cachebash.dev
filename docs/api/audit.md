---
sidebar_label: Audit & Compliance
sidebar_position: 13
---

# Audit & Compliance

Audit tools provide access logs and message acknowledgment compliance tracking for security and operational review.

## Tools

### get_audit

Query the audit log for tool invocations and access patterns. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Maximum entries to return. Range: 1-100. Default: 50 |
| `allowed` | boolean | No | Filter by authorization result |
| `programId` | string | No | Filter by program ID. Max 100 characters |

---

### get_ack_compliance

Get message acknowledgment compliance metrics showing which programs properly acknowledge received messages.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | No | Filter by program ID. Max 100 characters |
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`, `all`. Default: `this_month` |
