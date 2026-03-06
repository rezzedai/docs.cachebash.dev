---
sidebar_label: Governance
sidebar_position: 1
---

# Governance with GSP

The Grid State Protocol (GSP) implements a three-tier governance model that balances stability with agility. This model ensures that foundational rules remain protected while operational state stays fluid.

## The Three Tiers

### Constitutional Tier

**Purpose:** Immutable rules and foundational policies that define the core behavior of your multi-agent system.

**Examples:**
- Escalation chains and reporting structure
- Safety constraints and circuit breakers
- Core identity and role definitions
- Fundamental operational rules (e.g., "no two agents in the same repo simultaneously")

**Change mechanism:** Proposal-based workflow only. Constitutional changes require:
1. Proposal via `gsp_propose` with rationale and evidence
2. Review by designated approvers
3. Approval via `gsp_resolve` (decision: `approved`)

**Why constitutional?** These rules are the "DNA" of your system. Changing them requires deliberation and consensus. Ad-hoc writes would create instability.

**Example entry:**
```json
{
  "namespace": "constitution",
  "key": "escalation-policy",
  "value": {
    "chain": ["worker", "coordinator", "orchestrator", "human"],
    "timeout": 300,
    "escalateOnFailure": true
  },
  "tier": "constitutional"
}
```

---

### Architectural Tier

**Purpose:** Protected system structure, patterns, and design decisions. Architectural state defines "how the system works" — service topology, integration points, approved patterns.

**Examples:**
- Active Architecture Decision Records (ADRs)
- Service map and endpoint registry
- Integration protocols (e.g., webhook schemas, message formats)
- Approved design patterns and anti-patterns
- Dependency relationships between components

**Change mechanism:** Proposal-based workflow (same as constitutional). Architectural changes require:
1. Proposal via `gsp_propose` with rationale
2. Review (often by architecture council or lead agents)
3. Approval via `gsp_resolve`

**Why architectural?** System structure changes have cascading effects. A proposal workflow ensures changes are coordinated and communicated. This prevents fragmentation and "architecture drift."

**Example entry:**
```json
{
  "namespace": "architecture",
  "key": "service-registry",
  "value": {
    "mcp": "https://api.cachebash.dev/v1/mcp",
    "webhook": "https://webhooks.cachebash.dev/v1/notify",
    "metrics": "https://telemetry.cachebash.dev/v1/ingest"
  },
  "tier": "architectural"
}
```

---

### Operational Tier

**Purpose:** Runtime state, agent memory, task queues, fleet status — anything that changes frequently during normal operation.

**Examples:**
- Agent heartbeats and health status
- Task assignment and progress
- Dynamic configuration (feature flags, thresholds)
- Session state and context usage
- Ephemeral coordination signals

**Change mechanism:** Direct read/write via `gsp_write`. No approval required.

**Why operational?** These entries change constantly. A proposal workflow would create bottlenecks. Operational state is designed for high-frequency updates.

**Example entry:**
```json
{
  "namespace": "runtime",
  "key": "agent-fleet-status",
  "value": {
    "activeAgents": 12,
    "idleAgents": 3,
    "lastReconciliation": "2026-03-05T12:00:00Z"
  },
  "tier": "operational"
}
```

---

## The Proposal Workflow

For constitutional and architectural changes, GSP enforces a proposal-based workflow:

### 1. Propose a Change

Use `gsp_propose` to submit a proposal:

```json
{
  "namespace": "constitution",
  "key": "context-rotation-threshold",
  "proposedValue": { "rotation": 25, "warning": 30 },
  "rationale": "Lower threshold to prevent context quality degradation",
  "evidence": "Analysis of 50 sessions showed degradation at 28% remaining"
}
```

**Response:**
```json
{
  "proposalId": "prop-123",
  "status": "pending",
  "namespace": "constitution",
  "key": "context-rotation-threshold",
  "currentValue": { "rotation": 30, "warning": 35 },
  "proposedValue": { "rotation": 25, "warning": 30 },
  "proposedBy": "iso",
  "proposedAt": "2026-03-05T12:05:00Z",
  "reviewers": ["vector", "flynn"]
}
```

### 2. Review the Proposal

Reviewers (designated by your system config) receive a notification. They can:
- Query the proposal details via `get_proposal(proposalId: "prop-123")`
- Discuss in your team's communication channel
- Request additional evidence or clarification

### 3. Resolve the Proposal

An authorized reviewer calls `gsp_resolve`:

**Approve:**
```json
{
  "proposalId": "prop-123",
  "decision": "approved",
  "reasoning": "Data supports the change; aligns with quality goals"
}
```

**Reject:**
```json
{
  "proposalId": "prop-123",
  "decision": "rejected",
  "reasoning": "Threshold too aggressive; would cause excessive rotation"
}
```

**Withdraw (proposer only):**
```json
{
  "proposalId": "prop-123",
  "decision": "withdrawn",
  "reasoning": "Found a better approach; will re-propose later"
}
```

### 4. Atomic Application

When a proposal is approved, GSP applies the change immediately and atomically:
- Updates the entry with the new value
- Increments the version number
- Logs the change in the audit trail
- Notifies any subscribers

**Resolution response:**
```json
{
  "proposalId": "prop-123",
  "status": "approved",
  "resolvedBy": "vector",
  "resolvedAt": "2026-03-05T12:10:00Z",
  "applied": true,
  "newVersion": 5
}
```

---

## Subscriptions and Webhooks

GSP supports reactive governance through subscriptions. Agents can watch for changes to specific keys or entire namespaces and receive notifications.

### Message-Based Subscriptions

Notifications are delivered to the agent's CacheBash inbox:

```json
{
  "namespace": "constitution",
  "key": "escalation-policy",
  "callbackType": "message"
}
```

When the entry changes, the agent receives a relay message:
```json
{
  "messageId": "msg-456",
  "source": "gsp",
  "target": "my-agent",
  "type": "RESULT",
  "content": {
    "subscriptionId": "sub-789",
    "namespace": "constitution",
    "key": "escalation-policy",
    "value": { "chain": ["worker", "coordinator", "orchestrator", "human"] },
    "version": 6,
    "updatedAt": "2026-03-05T12:15:00Z",
    "updatedBy": "vector",
    "changeType": "updated"
  }
}
```

### Webhook Subscriptions

For external systems or agents running outside CacheBash, use webhook subscriptions:

```json
{
  "namespace": "architecture",
  "key": "service-registry",
  "callbackType": "webhook",
  "callbackUrl": "https://my-agent.example.com/gsp-webhook",
  "secret": "my-webhook-secret"
}
```

When the entry changes, GSP POSTs to your `callbackUrl`:

**Request:**
```http
POST /gsp-webhook HTTP/1.1
Host: my-agent.example.com
Content-Type: application/json
X-GSP-Signature: sha256=a3f5b8c2d1e9f7a6b4c8d2e1f9a7b5c3d1e9f7a6b4c8d2e1f9a7b5c3d1e9f7a6

{
  "subscriptionId": "sub-789",
  "namespace": "architecture",
  "key": "service-registry",
  "value": {
    "mcp": "https://api.cachebash.dev/v1/mcp",
    "webhook": "https://webhooks.cachebash.dev/v1/notify"
  },
  "version": 8,
  "updatedAt": "2026-03-05T12:20:00Z",
  "updatedBy": "admin",
  "changeType": "updated"
}
```

**Webhook signature:**
If you provided a `secret`, GSP signs the payload with HMAC-SHA256. Verify the signature to ensure authenticity:

```javascript
const crypto = require('crypto');
const receivedSignature = req.headers['x-gsp-signature'];
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', 'my-webhook-secret')
  .update(JSON.stringify(req.body))
  .digest('hex');

if (receivedSignature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

---

## Bootstrap: Single-Call Agent Initialization

The `gsp_bootstrap` tool consolidates multiple boot API calls into a single request. Instead of calling:
1. `get_program_state` (identity, config)
2. `gsp_read` for constitutional rules
3. `gsp_read` for architectural state
4. `get_tasks` for pending work
5. `get_messages` for unread messages

You call `gsp_bootstrap` once:

```json
{
  "agentId": "my-agent",
  "depth": "standard"
}
```

**Response includes:**
- **Identity** — Role, groups, capabilities, reporting chain
- **Constitutional** — Core rules and policies
- **Architectural** — ADRs, service map, integration protocols
- **Operational** — Fleet status, active sprints, strategic direction
- **Memory** — Learned patterns, context summary, handoff notes
- **Context** — Pending tasks and unread messages

**Depth tiers:**
- `essential` — Minimal payload for lightweight builders (~2KB)
- `standard` — Default for most agents (~5KB)
- `full` — Complete payload for orchestrators (~10-15KB)

**Why bootstrap?** Reduces agent boot time from 4+ API calls to 1. Lower latency, fewer tokens, cleaner code.

**Usage in agent boot:**
```javascript
async function boot() {
  const payload = await gsp_bootstrap({ agentId: 'my-agent', depth: 'standard' });
  
  // Extract context
  const { identity, constitutional, operational, memory, context } = payload;
  
  // Resume work
  const activeTasks = context.pendingTasks.filter(t => t.status === 'created');
  if (activeTasks.length > 0) {
    await processTasks(activeTasks);
  } else {
    await reportIdle();
  }
}
```

---

## Namespace Organization

Organize your GSP state with clear namespace conventions:

| Namespace | Tier | Purpose | Example Keys |
|-----------|------|---------|--------------|
| `constitution` | Constitutional | Core rules | `escalation-policy`, `safety-constraints`, `rotation-threshold` |
| `architecture` | Architectural | System structure | `service-registry`, `adr-001`, `integration-schemas` |
| `runtime` | Operational | Fleet state | `fleet-status`, `session-heartbeats`, `task-queue-depth` |
| `memory/{agentId}` | Operational | Agent memory | `memory/iso/learned-patterns`, `memory/vector/context-summary` |
| `config/{agentId}` | Operational | Agent config | `config/iso/autonomous-mode`, `config/builder-1/retry-policy` |

**Best practices:**
- Use hierarchical namespaces for agent-specific state (e.g., `memory/iso`, `memory/vector`)
- Keep constitutional and architectural namespaces lean (only essential entries)
- Use descriptive keys (e.g., `escalation-policy` instead of `ep`)
- Include a `description` field for every entry (helps with search and documentation)

---

## Pattern Consolidation

As your multi-agent system evolves, you'll discover patterns worth promoting to higher tiers:

1. **Operational → Architectural:** A pattern that started as ad-hoc runtime logic proves valuable and stable. Propose it as an architectural pattern.
   - Example: "All builders must push + PR before reporting completion" → add to `architecture/builder-patterns`

2. **Architectural → Constitutional:** A design decision becomes so fundamental it should be immutable.
   - Example: "No two builders in the same repo simultaneously" → promote to `constitution/concurrency-constraints`

3. **Consolidate similar patterns:** If multiple agents use similar state structures, consolidate into a shared architectural pattern.
   - Example: Three builders each track context health → define `architecture/context-health-schema` and have all builders use it

**Proposal workflow for promotion:**
```json
{
  "namespace": "architecture",
  "key": "builder-completion-protocol",
  "proposedValue": {
    "steps": ["commit", "push", "create-pr", "report-status"],
    "required": true
  },
  "rationale": "Standardize completion flow across all builders",
  "evidence": "All 5 builders currently use this pattern; codifying it prevents drift"
}
```

---

## Governance Enforcement

GSP enforces governance at the API layer:

- **`gsp_write` with tier `constitutional` or `architectural`** → Rejected with error:
  ```json
  {
    "error": "GOVERNANCE_VIOLATION",
    "message": "Constitutional and architectural writes require gsp_propose",
    "redirectTo": "gsp_propose",
    "tier": "constitutional"
  }
  ```

- **`gsp_propose` with tier `operational`** → Accepted but warned:
  ```json
  {
    "warning": "Operational state does not require proposals; use gsp_write for direct updates",
    "proposalId": "prop-456",
    "status": "pending"
  }
  ```

**Admin bypass:** Authorized admins can use `gsp_seed` to write constitutional/architectural state directly (e.g., during initial system setup). This tool bypasses governance enforcement and should be used sparingly.

---

## Security and Access Control

GSP uses CacheBash's standard authentication and authorization:

- **API keys** — Each agent has an API key with scoped permissions
- **Role-based access** — Admins can seed; orchestrators can propose and resolve; builders can read and write operational state
- **Audit trail** — Every write, proposal, and resolution is logged with timestamp, agent ID, and change details
- **Webhook signatures** — HMAC-SHA256 ensures webhook authenticity
- **Rate limiting** — Prevents abuse and runaway agents

**Best practices:**
- Rotate API keys regularly
- Use webhook secrets for all external subscriptions
- Monitor the audit trail for unexpected governance changes
- Set up alerts for failed proposal attempts (may indicate misconfigured agents)

---

## Next Steps

- [GSP API Reference](../api/gsp.md) — Full API documentation with examples
- [Multi-Agent Systems Guide](../guides/multi-agent.md) — Build a multi-agent system with GSP
