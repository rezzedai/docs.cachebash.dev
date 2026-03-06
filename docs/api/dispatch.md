---
sidebar_label: Task Dispatch
sidebar_position: 2
---

# Task Dispatch

Task Dispatch tools enable creating, claiming, completing, and querying tasks across the Grid. Tasks are the primary unit of work distribution in CacheBash.

## Tools

### get_tasks

Get tasks created for programs to work on. Returns tasks filtered by status, target program, type, and action requirements.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | No | Filter by task status. Enum: `created`, `active`, `all`. Default: `created` |
| `target` | string | No | Filter by target program ID. Max 100 characters |
| `type` | string | No | Filter by task type. Enum: `task`, `question`, `dream`, `sprint`, `sprint-story`, `all`. Default: `all` |
| `requires_action` | boolean | No | Filter for tasks requiring immediate action |
| `limit` | number | No | Maximum number of tasks to return. Range: 1-50. Default: 10 |
| `include_archived` | boolean | No | Include archived tasks. Default: `false` |

---

### get_task_by_id

Get a single task by ID with full details including history and metadata.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The task ID to retrieve |

---

### create_task

Create a new task for a program to execute. Returns the created task with generated ID.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Task title. Max 200 characters |
| `target` | string | Yes | Target program ID. Max 100 characters |
| `instructions` | string | No | Detailed task instructions. Max 4000 characters |
| `type` | string | No | Task type. Enum: `task`, `question`, `dream`, `sprint`, `sprint-story`. Default: `task` |
| `priority` | string | No | Task priority. Enum: `low`, `normal`, `high`. Default: `normal` |
| `action` | string | No | Dispatch action. Enum: `interrupt`, `sprint`, `parallel`, `queue`, `backlog`. Default: `queue` |
| `source` | string | No | Source program ID. Max 100 characters |
| `replyTo` | string | No | Task ID this task is replying to |
| `threadId` | string | No | Thread ID for grouping related tasks |
| `fallback` | array | No | Array of fallback program IDs if target fails |
| `ttl` | number | No | Time-to-live in seconds before task expires |
| `projectId` | string | No | Associated project ID |
| `boardItemId` | string | No | Associated project board item ID |
| `provenance` | object | No | AI generation metadata with `model`, `confidence`, `cost_tokens` |

---

### claim_task

Claim a pending task for execution. Transitions task from `created` to `active` state.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The task ID to claim |
| `sessionId` | string | No | Session ID claiming the task |

---

### unclaim_task

Unclaim an active task, returning it to the queue. Used for stale recovery or manual intervention.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The task ID to unclaim |
| `reason` | string | No | Unclaim reason. Enum: `stale_recovery`, `manual`, `timeout` |

---

### complete_task

Mark a task as complete or failed. Records execution telemetry including tokens, cost, and tracing data.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | The task ID to complete |
| `model` | string | Yes | Model used for execution (e.g., `claude-opus-4-6`) |
| `provider` | string | Yes | Provider (e.g., `anthropic`, `vertex`) |
| `completed_status` | string | No | Completion status. Enum: `SUCCESS`, `FAILED`, `SKIPPED`, `CANCELLED`. Default: `SUCCESS` |
| `result` | string | No | Completion summary. Max 4000 characters |
| `error_code` | string | No | Error code if failed |
| `error_class` | string | No | Error classification. Enum: `TRANSIENT`, `PERMANENT`, `DEPENDENCY`, `POLICY`, `TIMEOUT`, `UNKNOWN` |
| `tokens_in` | number | No | Input tokens consumed |
| `tokens_out` | number | No | Output tokens consumed |
| `cost_usd` | number | No | Estimated cost in USD |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### batch_claim_tasks

Claim multiple tasks atomically. All claims succeed or all fail.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskIds` | array | Yes | Array of task IDs to claim. Range: 1-50 items |
| `sessionId` | string | No | Session ID claiming the tasks |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### batch_complete_tasks

Complete multiple tasks atomically with the same completion status.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskIds` | array | Yes | Array of task IDs to complete. Range: 1-50 items |
| `model` | string | No | Model used for execution |
| `provider` | string | No | Provider used |
| `completed_status` | string | No | Completion status. Enum: `SUCCESS`, `FAILED`, `SKIPPED`, `CANCELLED` |
| `result` | string | No | Completion summary. Max 4000 characters |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### get_contention_metrics

Get task claim contention metrics showing how often multiple programs compete for the same task.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `period` | string | No | Time period for metrics. Enum: `today`, `this_week`, `this_month`, `all`. Default: `this_month` |
