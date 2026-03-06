---
sidebar_label: Grid State Protocol
sidebar_position: 11
---

# Grid State Protocol

Grid State Protocol (GSP) provides unified state distribution with tiered access control. Constitutional and architectural tiers require consensus for changes, while operational tier supports direct writes.

## Tools

### gsp_read

Read state entries from a namespace with optional filtering by key and tier.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to read from. Range: 1-100 characters |
| `key` | string | No | Specific key to read. Max 200 characters |
| `tier` | string | No | Filter by tier. Enum: `constitutional`, `architectural`, `operational` |
| `limit` | number | No | Maximum entries to return. Range: 1-100. Default: 50 |

---

### gsp_write

Write an operational state entry. Constitutional and architectural tiers require `gsp_propose` instead.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to write to. Range: 1-100 characters |
| `key` | string | Yes | Entry key. Range: 1-200 characters |
| `value` | any | Yes | Entry value (any JSON-serializable type) |
| `tier` | string | No | Tier level. Enum: `constitutional`, `architectural`, `operational`. Default: `operational` |
| `description` | string | No | Entry description. Max 500 characters |
| `source` | string | No | Source program ID. Max 100 characters |

---

### gsp_diff

Get state changes since a specific version or timestamp. Useful for synchronization and change tracking.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to diff. Range: 1-100 characters |
| `sinceVersion` | number | No | Version number to diff from |
| `sinceTimestamp` | string | No | ISO 8601 timestamp to diff from |
| `limit` | number | No | Maximum changes to return. Range: 1-200. Default: 100 |

---

### gsp_bootstrap

Get complete bootstrap payload for a program including identity, constitutional rules, architectural state, operational config, memory, and pending work.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID to bootstrap. Range: 1-100 characters |
| `depth` | string | No | Bootstrap depth. Enum: `essential`, `standard`, `full`. Default: `standard` |

---

### gsp_seed

Seed initial state entries into a namespace. **Admin only.** Used for bootstrapping new namespaces or resetting state.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to seed. Range: 1-100 characters |
| `entries` | array | Yes | Array of entry objects with `key`, `value`, `tier`, `description` |
| `overwrite` | boolean | No | Overwrite existing entries. Default: `false` |

---

### gsp_propose

**Phase 2 Stub.** Propose a change to constitutional or architectural tier. Not yet operational.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace. Max 100 characters |
| `key` | string | Yes | Entry key. Max 200 characters |
| `value` | any | Yes | Proposed value |
| `tier` | string | Yes | Tier level. Enum: `constitutional`, `architectural` |
| `rationale` | string | Yes | Change rationale. Max 1000 characters |

---

### gsp_subscribe

**Phase 2 Stub.** Subscribe to state change notifications. Not yet operational.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespace` | string | Yes | Namespace to subscribe to. Max 100 characters |
| `key` | string | No | Specific key to watch. Max 200 characters |
| `tier` | string | No | Filter by tier. Enum: `constitutional`, `architectural`, `operational` |

---

### gsp_resolve

**Phase 2 Stub.** Resolve a pending proposal by approving or rejecting. Not yet operational.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `proposalId` | string | Yes | Proposal ID to resolve |
| `decision` | string | Yes | Decision. Enum: `approve`, `reject` |
| `reason` | string | Yes | Decision rationale. Max 1000 characters |
