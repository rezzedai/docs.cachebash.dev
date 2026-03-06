---
sidebar_label: Sprint Execution
sidebar_position: 7
---

# Sprint Execution

Sprint tools orchestrate multi-story work execution with wave-based parallelism, dependency management, and automatic retry policies.

## Tools

### create_sprint

Create a new sprint with multiple stories organized into waves. Stories in the same wave can execute in parallel.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectName` | string | Yes | Project name. Max 100 characters |
| `branch` | string | Yes | Git branch for the sprint. Max 100 characters |
| `stories` | array | Yes | Array of story objects with `id`, `title`, `wave`, `dependencies`, `complexity`, `retryPolicy`, `maxRetries` |
| `sessionId` | string | No | Session ID orchestrating the sprint |
| `config` | object | No | Sprint configuration with `orchestratorModel`, `subagentModel`, `maxConcurrent` |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### update_sprint_story

Update the status and progress of a story within an active sprint.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sprintId` | string | Yes | The sprint ID |
| `storyId` | string | Yes | The story ID to update |
| `status` | string | No | Story status. Enum: `queued`, `active`, `complete`, `failed`, `skipped` |
| `progress` | number | No | Progress percentage. Range: 0-100 |
| `currentAction` | string | No | Current action description. Max 200 characters |
| `model` | string | No | Model executing the story |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### add_story_to_sprint

Add a new story to an active sprint, either to the current wave, next wave, or backlog.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sprintId` | string | Yes | The sprint ID |
| `story` | object | Yes | Story object with `id`, `title`, `dependencies`, `complexity` |
| `insertionMode` | string | No | Where to insert. Enum: `current_wave`, `next_wave`, `backlog`. Default: `next_wave` |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### complete_sprint

Mark a sprint as complete with summary statistics.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sprintId` | string | Yes | The sprint ID to complete |
| `summary` | object | No | Summary object with `completed`, `failed`, `skipped`, `duration` counts |

---

### get_sprint

Get the current state of a sprint including all stories and their statuses.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sprintId` | string | Yes | The sprint ID to retrieve |
