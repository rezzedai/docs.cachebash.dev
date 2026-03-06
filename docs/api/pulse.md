---
sidebar_label: Session & Fleet Health
sidebar_position: 4
---

# Session & Fleet Health

Pulse tools track individual session lifecycle and aggregate fleet-wide health metrics, enabling operational monitoring and context utilization tracking.

## Tools

### create_session

Create a new session record. Sessions represent individual program instances or work contexts.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Session name. Max 200 characters |
| `sessionId` | string | No | Custom session ID. Max 100 characters. Auto-generated if not provided |
| `programId` | string | No | Associated program ID. Max 50 characters |
| `status` | string | No | Initial status message. Max 200 characters |
| `state` | string | No | Session state. Enum: `working`, `blocked`, `complete`, `pinned`. Default: `working` |
| `progress` | number | No | Progress percentage. Range: 0-100 |
| `projectName` | string | No | Associated project name. Max 100 characters |

---

### update_session

Update session status, progress, and health metadata. Call regularly to maintain session heartbeat.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | Yes | Status message. Max 200 characters |
| `sessionId` | string | No | Session ID to update. Defaults to current session |
| `state` | string | No | Session state. Enum: `working`, `blocked`, `complete`, `pinned` |
| `progress` | number | No | Progress percentage. Range: 0-100 |
| `projectName` | string | No | Associated project name. Max 100 characters |
| `lastHeartbeat` | boolean | No | Update heartbeat timestamp |
| `contextBytes` | number | No | Current context size in bytes. Minimum: 0 |
| `handoffRequired` | boolean | No | Flag session for dispatcher recycling |

---

### list_sessions

List active and recent sessions with optional filtering by state and program.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `state` | string | No | Filter by session state. Enum: `working`, `blocked`, `pinned`, `complete`, `all`. Default: `all` |
| `programId` | string | No | Filter by program ID. Max 50 characters |
| `limit` | number | No | Maximum number of sessions to return. Range: 1-50. Default: 10 |
| `includeArchived` | boolean | No | Include archived sessions. Default: `false` |

---

### get_fleet_health

Get aggregate fleet health metrics including active sessions, heartbeat status, and capacity utilization. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `detail` | string | No | Detail level. Enum: `summary`, `full`. Default: `summary` |

---

### get_fleet_timeline

Get time-series fleet health data for visualization and trend analysis.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`. Default: `today` |
| `resolution` | string | No | Data point resolution. Enum: `30s`, `1m`, `5m`, `1h`. Default: `5m` |

---

### write_fleet_snapshot

Write a fleet health snapshot. **Dispatcher use only.** Used for time-series fleet state tracking.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `activeSessions` | object | Yes | Active session counts with `total`, `byTier`, `byProgram` breakdown |
| `tasksInFlight` | number | No | Number of currently active tasks |
| `messagesPending` | number | No | Number of undelivered messages |
| `heartbeatHealth` | number | No | Heartbeat health score. Range: 0-1 |

---

### get_context_utilization

Get context utilization metrics for a session or program over time.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sessionId` | string | No | Session ID to query. Max 100 characters |
| `period` | string | No | Time period. Enum: `today`, `this_week`, `this_month`. Default: `today` |
