---
sidebar_label: Execution Tracing
sidebar_position: 14
---

# Execution Tracing

Tracing tools provide distributed execution tracking for sprints and tasks, enabling performance analysis and debugging.

## Tools

### query_traces

Query execution traces with filtering by sprint, task, program, tool, and time range. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sprintId` | string | No | Filter by sprint ID |
| `taskId` | string | No | Filter by task ID |
| `programId` | string | No | Filter by program ID. Max 100 characters |
| `tool` | string | No | Filter by tool name |
| `since` | string | No | ISO 8601 timestamp for start of range |
| `until` | string | No | ISO 8601 timestamp for end of range |
| `limit` | number | No | Maximum traces to return. Range: 1-100. Default: 50 |

---

### query_trace

Query a single trace by trace ID with full span details. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `traceId` | string | Yes | The trace ID to retrieve |
