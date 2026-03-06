---
sidebar_label: Program State & Memory
sidebar_position: 10
---

# Program State & Memory

Program state tools provide persistent storage for program configuration, context snapshots, and learned patterns with decay management.

## Tools

### get_program_state

Read the current state for a program including configuration, context summary, learned patterns, and baselines.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID to read state for. Max 100 characters |

---

### update_program_state

Write program state including context summary, learned patterns, configuration, baselines, and decay settings.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID to update. Max 100 characters |
| `sessionId` | string | No | Session ID performing the update. Max 100 characters |
| `contextSummary` | object | No | Context snapshot with `currentTask`, `activeWorkItems`, `progress`, `nextSteps` |
| `learnedPatterns` | array | No | Array of learned pattern objects |
| `config` | object | No | Program configuration object |
| `baselines` | object | No | Baseline metrics object |
| `decay` | object | No | Decay configuration object |
| `traceId` | string | No | Distributed trace ID |
| `spanId` | string | No | Trace span ID |
| `parentSpanId` | string | No | Parent trace span ID |

---

### get_context_history

Get historical context snapshots for a program, useful for understanding state evolution over time.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID to query. Max 100 characters |
| `limit` | number | No | Maximum number of snapshots to return. Range: 1-50. Default: 20 |

---

### store_memory

Store a learned pattern in program memory with confidence, evidence, and domain classification.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID. Max 100 characters |
| `pattern` | object | Yes | Pattern object with `id`, `domain`, `pattern`, `confidence`, `evidence`, `discoveredAt`, `lastReinforced`, `promotedToStore`, `stale` |

---

### recall_memory

Recall learned patterns from program memory with optional filtering by domain and query string.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID. Max 100 characters |
| `domain` | string | No | Filter by domain. Max 100 characters |
| `query` | string | No | Search query. Max 200 characters |
| `includeStale` | boolean | No | Include stale patterns. Default: `false` |

---

### memory_health

Get memory health metrics including pattern count, decay statistics, and quality indicators.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID. Max 100 characters |

---

### delete_memory

Delete a specific learned pattern from program memory.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID. Max 100 characters |
| `patternId` | string | Yes | Pattern ID to delete |

---

### reinforce_memory

Reinforce a learned pattern, updating its confidence and adding new evidence.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID. Max 100 characters |
| `patternId` | string | Yes | Pattern ID to reinforce |
| `confidence` | number | No | New confidence score. Range: 0-1 |
| `evidence` | string | No | Additional evidence. Max 500 characters |
