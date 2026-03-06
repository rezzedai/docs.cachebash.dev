---
sidebar_label: GSP (Grid State Protocol)
sidebar_position: 11
---

# GSP (Grid State Protocol)

The Grid State Protocol (GSP) provides a governed, versioned key-value store for multi-agent systems. GSP enables agents to share state, enforce governance policies, and coordinate through proposal-based workflows.

## Overview

GSP organizes state into **namespaces** with **governance tiers**:

- **Constitutional** — Immutable rules and foundational policies (change requires proposal + approval)
- **Architectural** — Protected system structure and patterns (change requires proposal + approval)
- **Operational** — Standard runtime state (direct read/write access)

This three-tier model ensures critical state is protected while operational state remains fluid.

## Tools

### gsp_read

Read GSP state entries by namespace, key, and tier. Returns a single entry or scans an entire namespace.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | GSP namespace (e.g., `governance`, `runtime`). Range: 1-100 characters |
| `key` | string | No | Entry key within the namespace. Omit to scan the entire namespace. Max 200 characters |
| `tier` | string | No | Filter by governance tier. Enum: `constitutional`, `architectural`, `operational` |
| `limit` | number | No | Max entries for namespace scan. Range: 1-100. Default: 50 |

**Example — Read a single entry:**
```json
{
  "namespace": "governance",
  "key": "escalation-policy"
}
```

**Example — Scan a namespace:**
```json
{
  "namespace": "runtime",
  "tier": "operational",
  "limit": 20
}
```

**Response:**
```json
{
  "entries": [
    {
      "namespace": "governance",
      "key": "escalation-policy",
      "value": { "chain": ["worker", "iso", "vector", "flynn"] },
      "tier": "constitutional",
      "version": 3,
      "updatedAt": "2026-03-05T10:30:00Z",
      "updatedBy": "vector",
      "description": "Reporting chain for escalations"
    }
  ]
}
```

---

### gsp_write

Write an operational GSP state entry. Governance enforcement rejects `constitutional` or `architectural` writes with a redirect hint to `gsp_propose`.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | GSP namespace. Range: 1-100 characters |
| `key` | string | Yes | Entry key. Range: 1-200 characters |
| `value` | any | Yes | The state value to store (any JSON-serializable value) |
| `tier` | string | No | Governance tier. Enum: `constitutional`, `architectural`, `operational`. Default: `operational` |
| `description` | string | No | Human-readable description of this entry. Max 500 characters |
| `source` | string | No | Override the `updatedBy` field (defaults to agentId). Max 100 characters |

**Example:**
```json
{
  "namespace": "runtime",
  "key": "fleet-status",
  "value": {
    "activePrograms": 8,
    "idlePrograms": 2,
    "lastReconciliation": "2026-03-05T10:45:00Z"
  },
  "description": "Current fleet operational status"
}
```

**Response:**
```json
{
  "success": true,
  "namespace": "runtime",
  "key": "fleet-status",
  "version": 12,
  "tier": "operational"
}
```

**Governance enforcement:**
If you attempt to write `constitutional` or `architectural` state, the response redirects:
```json
{
  "error": "GOVERNANCE_VIOLATION",
  "message": "Constitutional and architectural writes require gsp_propose",
  "redirectTo": "gsp_propose",
  "tier": "constitutional"
}
```

---

### gsp_diff

Diff GSP state entries since a version or timestamp. Returns changed entries for reconciliation.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | GSP namespace to diff. Range: 1-100 characters |
| `sinceVersion` | number | No | Return entries with version > sinceVersion |
| `sinceTimestamp` | string | No | Return entries updated after this ISO 8601 timestamp |
| `limit` | number | No | Max entries to return. Range: 1-200. Default: 100 |

**Example:**
```json
{
  "namespace": "runtime",
  "sinceTimestamp": "2026-03-05T10:00:00Z",
  "limit": 50
}
```

**Response:**
```json
{
  "changes": [
    {
      "namespace": "runtime",
      "key": "fleet-status",
      "value": { "activePrograms": 8 },
      "version": 12,
      "updatedAt": "2026-03-05T10:45:00Z",
      "updatedBy": "vector",
      "changeType": "updated"
    },
    {
      "namespace": "runtime",
      "key": "builder-3-state",
      "version": 5,
      "updatedAt": "2026-03-05T10:30:00Z",
      "updatedBy": "iso",
      "changeType": "deleted"
    }
  ],
  "hasMore": false
}
```

---

### gsp_bootstrap

Get full context payload for an agent boot. Single call replaces 4+ boot API calls. Returns identity, constitutional state, operational state, agent memory, and pending context.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `agentId` | string | Yes | The agent identifier (program name) to bootstrap (e.g., `vector`, `iso`, `basher`). Range: 1-100 characters |
| `depth` | string | No | Payload depth tier. Enum: `essential` (~2KB, builders), `standard` (~5KB, default), `full` (~10-15KB, orchestrators). Default: `standard` |

**Example:**
```json
{
  "agentId": "iso",
  "depth": "full"
}
```

**Response:**
```json
{
  "identity": {
    "programId": "iso",
    "role": "dispatcher",
    "groups": ["council"],
    "capabilities": ["task_dispatch", "fleet_coordination"],
    "reportingChain": ["iso", "vector", "flynn"]
  },
  "constitutional": {
    "escalationPolicy": { "chain": ["worker", "iso", "vector", "flynn"] },
    "guidingLight": "Optimize for delivery speed, not token conservation..."
  },
  "architectural": {
    "activeADRs": [
      { "id": "adr-001", "title": "Autonomous Operations Protocol", "status": "active" }
    ],
    "serviceMap": { "mcp": "https://api.cachebash.dev/v1/mcp" }
  },
  "operational": {
    "fleetStatus": { "activePrograms": 8, "idlePrograms": 2 },
    "activeSprints": [
      { "sprintId": "sprint-42", "title": "GSP Phase 2", "status": "active" }
    ]
  },
  "memory": {
    "learnedPatterns": ["pattern-consolidation", "parallel-execution"],
    "contextSummary": {
      "lastTask": "Dispatched 3 builders for sprint stories",
      "activeWorkItems": ["[task:T123] Review PR", "[task:T124] Fleet health check"],
      "openQuestions": [],
      "handoffNotes": "All builders active, no blockers"
    }
  },
  "context": {
    "pendingTasks": [
      { "taskId": "T125", "title": "Reconcile stale sessions", "priority": "high" }
    ],
    "unreadMessages": [
      { "messageId": "M456", "source": "vector", "type": "DIRECTIVE", "content": "Initiate autonomous mode" }
    ]
  }
}
```

**Depth tiers:**
- `essential` — Identity, constitutional rules, pending tasks only (~2KB). For lightweight builders.
- `standard` — Adds operational state, memory summary (~5KB). Default for most programs.
- `full` — Complete payload including architectural state, fleet status, strategic direction (~10-15KB). For orchestrators.

---

### gsp_seed

Seed constitutional or architectural state into GSP. Admin/orchestrator only. Bypasses `gsp_write` governance enforcement for authorized seeding.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Target namespace (e.g., `constitution`, `architecture`). Range: 1-100 characters |
| `entries` | array | Yes | Array of entries to seed. Each entry has `key`, `value`, `tier`, and optional `description` |
| `overwrite` | boolean | No | Overwrite existing entries. Default: `false` |

**Example:**
```json
{
  "namespace": "constitution",
  "entries": [
    {
      "key": "reporting-chain",
      "value": { "chain": ["worker", "iso", "vector", "flynn"] },
      "tier": "constitutional",
      "description": "Escalation path for all programs"
    },
    {
      "key": "context-threshold",
      "value": { "rotation": 30, "warning": 35 },
      "tier": "constitutional",
      "description": "Context health thresholds"
    }
  ],
  "overwrite": false
}
```

**Response:**
```json
{
  "success": true,
  "seeded": 2,
  "skipped": 0,
  "entries": [
    { "key": "reporting-chain", "version": 1 },
    { "key": "context-threshold", "version": 1 }
  ]
}
```

---

### gsp_propose

Propose a change to constitutional or architectural state. Creates a governance proposal for review. Operational state should use `gsp_write` instead.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Target namespace. Range: 1-100 characters |
| `key` | string | Yes | Entry key. Range: 1-200 characters |
| `proposedValue` | any | Yes | Proposed new value (any JSON-serializable value) |
| `rationale` | string | Yes | Reason for the proposed change. Range: 1-1000 characters |
| `evidence` | string | No | Optional supporting evidence or context. Max 2000 characters |

**Example:**
```json
{
  "namespace": "constitution",
  "key": "context-threshold",
  "proposedValue": { "rotation": 25, "warning": 30 },
  "rationale": "Lower threshold to prevent context degradation earlier",
  "evidence": "Analysis of 50 sessions showed quality drop at 28% remaining"
}
```

**Response:**
```json
{
  "proposalId": "prop-789",
  "status": "pending",
  "namespace": "constitution",
  "key": "context-threshold",
  "proposedValue": { "rotation": 25, "warning": 30 },
  "currentValue": { "rotation": 30, "warning": 35 },
  "proposedBy": "iso",
  "proposedAt": "2026-03-05T11:00:00Z",
  "reviewers": ["vector", "flynn"]
}
```

---

### gsp_subscribe

Subscribe to GSP state change notifications. Supports message-based and webhook callbacks.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to watch. Max 100 characters |
| `key` | string | No | Specific key to watch (optional; omit to watch all keys in namespace). Max 200 characters |
| `callbackType` | string | No | Notification delivery method. Enum: `message` (sends to CacheBash inbox), `webhook` (POSTs to callbackUrl). Default: `message` |
| `callbackUrl` | string | Conditional | Required when callbackType is `webhook`. HTTP(S) endpoint to receive POST notifications. Max 500 characters |
| `secret` | string | No | Optional shared secret for webhook HMAC-SHA256 signing. Signature sent in `X-GSP-Signature` header. Max 200 characters |
| `unsubscribe` | boolean | No | Set to `true` to deactivate this subscription |

**Example — Message-based subscription:**
```json
{
  "namespace": "runtime",
  "key": "fleet-status",
  "callbackType": "message"
}
```

**Example — Webhook subscription:**
```json
{
  "namespace": "constitution",
  "callbackType": "webhook",
  "callbackUrl": "https://my-agent.example.com/gsp-webhook",
  "secret": "my-shared-secret-key"
}
```

**Response:**
```json
{
  "subscriptionId": "sub-123",
  "namespace": "runtime",
  "key": "fleet-status",
  "callbackType": "message",
  "status": "active"
}
```

**Webhook payload:**
When a subscribed entry changes, GSP POSTs to your `callbackUrl`:
```json
{
  "subscriptionId": "sub-123",
  "namespace": "runtime",
  "key": "fleet-status",
  "value": { "activePrograms": 9, "idlePrograms": 1 },
  "version": 13,
  "updatedAt": "2026-03-05T11:15:00Z",
  "updatedBy": "vector",
  "changeType": "updated"
}
```

**Webhook signature:**
If you provided a `secret`, GSP signs the payload with HMAC-SHA256 and sends the signature in the `X-GSP-Signature` header:
```
X-GSP-Signature: sha256=a3f5b8c2d1e9f7a6b4c8d2e1f9a7b5c3d1e9f7a6b4c8d2e1f9a7b5c3d1e9f7a6
```

Verify the signature to ensure authenticity:
```javascript
const crypto = require('crypto');
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
```

---

### gsp_resolve

Resolve a pending governance proposal. Approve, reject, or withdraw. Approved proposals apply state changes atomically.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `proposalId` | string | Yes | ID of the proposal to resolve |
| `decision` | string | Yes | Resolution decision. Enum: `approved`, `rejected`, `withdrawn` |
| `reasoning` | string | No | Reason for the decision. Max 1000 characters |

**Example:**
```json
{
  "proposalId": "prop-789",
  "decision": "approved",
  "reasoning": "Data supports the change; aligns with quality goals"
}
```

**Response:**
```json
{
  "proposalId": "prop-789",
  "status": "approved",
  "resolvedBy": "vector",
  "resolvedAt": "2026-03-05T11:30:00Z",
  "applied": true,
  "newVersion": 4
}
```

**Atomic application:**
When a proposal is approved, GSP applies the state change immediately. The `newVersion` field indicates the updated version number.

---

### gsp_search

Search GSP state entries by text query. Searches across keys, values, and descriptions. Returns scored results ranked by relevance.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search text to match against keys, descriptions, and values. Range: 1-200 characters |
| `namespace` | string | No | Optional: limit search to specific namespace. Omit to search across all namespaces. Range: 1-100 characters |
| `tier` | string | No | Optional: filter by governance tier. Enum: `constitutional`, `architectural`, `operational` |
| `limit` | number | No | Max results to return. Range: 1-50. Default: 20 |

**Example:**
```json
{
  "query": "fleet status",
  "namespace": "runtime",
  "limit": 10
}
```

**Response:**
```json
{
  "results": [
    {
      "namespace": "runtime",
      "key": "fleet-status",
      "value": { "activePrograms": 8, "idlePrograms": 2 },
      "tier": "operational",
      "version": 12,
      "description": "Current fleet operational status",
      "score": 0.95
    },
    {
      "namespace": "runtime",
      "key": "fleet-health-last-check",
      "value": "2026-03-05T11:00:00Z",
      "tier": "operational",
      "version": 8,
      "description": "Timestamp of last fleet health reconciliation",
      "score": 0.82
    }
  ],
  "hasMore": false
}
```

---

## Common Patterns

### Bootstrap on agent boot

Replace multiple API calls with a single `gsp_bootstrap`:

```json
{
  "agentId": "my-agent",
  "depth": "standard"
}
```

This returns everything you need: identity, rules, state, memory, and pending work.

### Operational state updates

For runtime state (tier: `operational`), use `gsp_write` directly:

```json
{
  "namespace": "runtime",
  "key": "agent-status",
  "value": { "state": "active", "lastHeartbeat": "2026-03-05T11:45:00Z" }
}
```

### Propose governance changes

For constitutional or architectural changes, use the proposal workflow:

1. **Propose:**
```json
{
  "namespace": "constitution",
  "key": "escalation-policy",
  "proposedValue": { "chain": ["worker", "coordinator", "vector", "flynn"] },
  "rationale": "Add coordinator role for mid-tier decisions"
}
```

2. **Review:** Reviewers receive a notification (message or webhook)

3. **Resolve:**
```json
{
  "proposalId": "prop-789",
  "decision": "approved",
  "reasoning": "Aligns with organizational structure changes"
}
```

### Subscribe to state changes

Watch a specific key with message delivery:

```json
{
  "namespace": "runtime",
  "key": "system-mode",
  "callbackType": "message"
}
```

Or use webhooks for external systems:

```json
{
  "namespace": "runtime",
  "key": "alert-threshold",
  "callbackType": "webhook",
  "callbackUrl": "https://monitoring.example.com/webhook",
  "secret": "webhook-secret-key"
}
```

### Reconcile state

Use `gsp_diff` to detect changes since last check:

```json
{
  "namespace": "runtime",
  "sinceTimestamp": "2026-03-05T11:00:00Z"
}
```

Process the returned changes and update local cache.

---

## Next Steps

- [Governance Concepts](../concepts/governance.md) — Learn about the three-tier governance model
- [Multi-Agent Systems Guide](../guides/multi-agent.md) — Build a multi-agent system with GSP
