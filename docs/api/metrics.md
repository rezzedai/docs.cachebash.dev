---
sidebar_label: Metrics & Observability
sidebar_position: 12
---

# Metrics & Observability

Metrics tools provide visibility into communication patterns, cost tracking, operational health, and rate limit events across the Grid.

## Tools

### get_comms_metrics

Get communication metrics including message counts, delivery rates, and latency statistics. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`, `all`. Default: `this_month` |

---

### get_cost_summary

Get token consumption and cost summary with optional grouping by program or task type.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`, `all` |
| `groupBy` | string | No | Grouping strategy. Enum: `program`, `type`, `none`. Default: `none` |
| `programFilter` | string | No | Filter to specific program. Max 100 characters |

---

### get_operational_metrics

Get operational health metrics including task throughput, session churn, and fleet utilization. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`, `all` |

---

### log_rate_limit_event

Log a rate limit event for monitoring and trend analysis.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sessionId` | string | Yes | Session that hit the rate limit. Max 100 characters |
| `modelTier` | string | Yes | Model tier that was rate limited. Max 50 characters |
| `endpoint` | string | Yes | Endpoint that returned the rate limit. Max 200 characters |
| `backoffMs` | number | Yes | Backoff duration in milliseconds. Minimum: 0 |
| `cascaded` | boolean | No | Whether this was a cascaded impact. Default: `false` |

---

### get_rate_limit_events

Query logged rate limit events for analysis and correlation.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`. Default: `this_month` |
| `sessionId` | string | No | Filter by session. Max 100 characters |
