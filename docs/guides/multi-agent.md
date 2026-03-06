---
sidebar_label: Multi-Agent Systems
sidebar_position: 1
---

# Building Multi-Agent Systems with GSP

The Grid State Protocol (GSP) provides the foundation for coordinated multi-agent systems. This guide walks you through setting up GSP for agent coordination, governance, and reactive behavior.

## Quick Start

### 1. Define Your Governance Model

Start by identifying your governance tiers. Ask yourself:

- **What rules are immutable?** These become constitutional state.
- **What patterns define your system structure?** These become architectural state.
- **What changes frequently during runtime?** This becomes operational state.

**Example for a code review system:**

| Tier | Namespace | Keys |
|------|-----------|------|
| Constitutional | `constitution` | `review-policy`, `approval-threshold`, `escalation-chain` |
| Architectural | `architecture` | `reviewer-assignment-algorithm`, `notification-schema`, `integration-endpoints` |
| Operational | `runtime` | `active-reviews`, `reviewer-availability`, `queue-depth` |

### 2. Seed Constitutional and Architectural State

Use `gsp_seed` to initialize your governance rules and system structure.

**Seed constitutional state:**
```json
{
  "namespace": "constitution",
  "entries": [
    {
      "key": "review-policy",
      "value": {
        "minReviewers": 2,
        "autoMergeThreshold": 0.95,
        "requireHumanApproval": ["security", "infrastructure"]
      },
      "tier": "constitutional",
      "description": "Core review policy for all PRs"
    },
    {
      "key": "escalation-chain",
      "value": {
        "chain": ["reviewer-bot", "senior-reviewer", "tech-lead", "human"]
      },
      "tier": "constitutional",
      "description": "Escalation path for blocked reviews"
    }
  ]
}
```

**Seed architectural state:**
```json
{
  "namespace": "architecture",
  "entries": [
    {
      "key": "reviewer-assignment",
      "value": {
        "algorithm": "expertise-based",
        "fallback": "round-robin",
        "maxConcurrentReviews": 5
      },
      "tier": "architectural",
      "description": "Algorithm for assigning reviewers to PRs"
    },
    {
      "key": "notification-schema",
      "value": {
        "channels": ["slack", "email"],
        "priorityMapping": {
          "urgent": "slack",
          "normal": "email"
        }
      },
      "tier": "architectural",
      "description": "Notification delivery configuration"
    }
  ]
}
```

### 3. Bootstrap Your Agents

Each agent calls `gsp_bootstrap` on startup to retrieve its context:

```json
{
  "agentId": "reviewer-bot-1",
  "depth": "standard"
}
```

**Response includes:**
- Constitutional rules (review policy, escalation chain)
- Architectural patterns (assignment algorithm, notification schema)
- Operational state (active reviews, reviewer availability)
- Agent memory (learned patterns, context summary)
- Pending work (review tasks, unread messages)

**Agent boot flow:**
```javascript
async function bootAgent(agentId) {
  // 1. Bootstrap
  const payload = await gsp_bootstrap({ agentId, depth: 'standard' });
  
  // 2. Load governance
  const { constitutional, architectural } = payload;
  const reviewPolicy = constitutional['review-policy'];
  const assignmentAlgo = architectural['reviewer-assignment'];
  
  // 3. Resume work
  const pendingReviews = payload.context.pendingTasks.filter(t => t.type === 'review');
  
  if (pendingReviews.length > 0) {
    await processReviews(pendingReviews, reviewPolicy, assignmentAlgo);
  } else {
    await reportIdle();
  }
}
```

### 4. Use Operational State for Coordination

Agents write operational state to coordinate during runtime:

**Update active reviews:**
```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "value": {
    "pr-123": { "reviewers": ["bot-1", "bot-2"], "status": "in-progress" },
    "pr-124": { "reviewers": ["bot-3"], "status": "approved" }
  },
  "description": "Currently active code reviews"
}
```

**Update reviewer availability:**
```json
{
  "namespace": "runtime",
  "key": "reviewer-availability",
  "value": {
    "bot-1": { "available": true, "currentLoad": 2, "maxLoad": 5 },
    "bot-2": { "available": true, "currentLoad": 4, "maxLoad": 5 },
    "bot-3": { "available": false, "reason": "maintenance" }
  },
  "description": "Real-time reviewer capacity"
}
```

### 5. Subscribe to State Changes

Agents subscribe to relevant state changes to react immediately:

**Subscribe to review policy changes:**
```json
{
  "namespace": "constitution",
  "key": "review-policy",
  "callbackType": "message"
}
```

When the review policy changes (via proposal + approval), all subscribed agents receive a notification and can update their behavior.

**Subscribe to active reviews:**
```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "callbackType": "message"
}
```

When a new review is added or an existing review changes status, agents are notified immediately.

---

## Advanced Patterns

### Hierarchical Agent Coordination

Use GSP to coordinate a hierarchy of agents:

**Example: Orchestrator → Coordinators → Workers**

```
orchestrator (fleet-level coordination)
    ├── coordinator-1 (team-level coordination)
    │   ├── worker-1 (task execution)
    │   └── worker-2 (task execution)
    └── coordinator-2 (team-level coordination)
        ├── worker-3 (task execution)
        └── worker-4 (task execution)
```

**Orchestrator writes fleet state:**
```json
{
  "namespace": "runtime",
  "key": "fleet-status",
  "value": {
    "activeCoordinators": 2,
    "activeWorkers": 4,
    "taskQueueDepth": 12,
    "lastReconciliation": "2026-03-05T13:00:00Z"
  }
}
```

**Coordinators subscribe to fleet status:**
```json
{
  "namespace": "runtime",
  "key": "fleet-status",
  "callbackType": "message"
}
```

When the orchestrator updates fleet status, coordinators react (e.g., spawn more workers if queue depth is high).

**Workers write individual status:**
```json
{
  "namespace": "runtime",
  "key": "worker-1-status",
  "value": {
    "state": "active",
    "currentTask": "task-456",
    "lastHeartbeat": "2026-03-05T13:05:00Z"
  }
}
```

**Coordinators reconcile worker status:**
Coordinators periodically scan `runtime/worker-*-status` using `gsp_read` with namespace scan to detect stale workers and take action.

---

### Dynamic Configuration with Feature Flags

Use operational state for runtime configuration changes without code deploys:

**Write feature flags:**
```json
{
  "namespace": "config",
  "key": "feature-flags",
  "value": {
    "enableExperimentalReviewer": true,
    "enableSlackNotifications": false,
    "maxReviewerConcurrency": 5
  }
}
```

**Agents subscribe and react:**
```json
{
  "namespace": "config",
  "key": "feature-flags",
  "callbackType": "message"
}
```

When a flag changes, agents receive a notification and update their behavior immediately — no restart required.

---

### Proposal-Based Architecture Evolution

Use the proposal workflow to evolve your system architecture collaboratively:

**Scenario:** You want to change the reviewer assignment algorithm from expertise-based to round-robin.

**Step 1: Propose the change**
```json
{
  "namespace": "architecture",
  "key": "reviewer-assignment",
  "proposedValue": {
    "algorithm": "round-robin",
    "fallback": "expertise-based",
    "maxConcurrentReviews": 5
  },
  "rationale": "Round-robin provides better load balancing",
  "evidence": "Analysis of 100 reviews shows 30% variance in load with expertise-based"
}
```

**Step 2: Review and discuss**
The orchestrator agent receives a notification. It can:
- Query historical data to validate the claim
- Simulate the impact of the change
- Discuss with human operators or other agents

**Step 3: Approve or reject**
```json
{
  "proposalId": "prop-789",
  "decision": "approved",
  "reasoning": "Data supports the change; aligns with load balancing goals"
}
```

**Step 4: Agents react**
All agents subscribed to `architecture/reviewer-assignment` receive a notification. They reload the configuration and switch to the new algorithm.

---

### Distributed Reconciliation

Agents use `gsp_diff` to reconcile state changes since their last check:

**Agent periodically reconciles:**
```javascript
async function reconcile(agentId) {
  // Track last reconciliation timestamp
  const lastCheck = await getLastReconciliation(agentId);
  
  // Query changes since last check
  const changes = await gsp_diff({
    namespace: 'runtime',
    sinceTimestamp: lastCheck
  });
  
  // Process changes
  for (const change of changes.changes) {
    if (change.key === 'active-reviews') {
      await updateLocalCache(change.value);
    } else if (change.key.startsWith('worker-') && change.changeType === 'deleted') {
      await handleWorkerRemoved(change.key);
    }
  }
  
  // Update reconciliation timestamp
  await setLastReconciliation(agentId, new Date().toISOString());
}

// Run reconciliation every 5 minutes
setInterval(() => reconcile('reviewer-bot-1'), 5 * 60 * 1000);
```

This pattern ensures agents stay synchronized even if they miss webhook notifications (e.g., due to network partitions or downtime).

---

### Webhook Integration for External Systems

Use webhook subscriptions to integrate external systems into your multi-agent coordination:

**Example: Notify a monitoring service when review queue exceeds threshold**

**Step 1: Subscribe with webhook**
```json
{
  "namespace": "runtime",
  "key": "queue-depth",
  "callbackType": "webhook",
  "callbackUrl": "https://monitoring.example.com/alerts/review-queue",
  "secret": "monitoring-webhook-secret"
}
```

**Step 2: Agent updates queue depth**
```json
{
  "namespace": "runtime",
  "key": "queue-depth",
  "value": {
    "depth": 25,
    "threshold": 20,
    "alert": true
  }
}
```

**Step 3: Monitoring service receives webhook**
```http
POST /alerts/review-queue HTTP/1.1
Host: monitoring.example.com
Content-Type: application/json
X-GSP-Signature: sha256=...

{
  "subscriptionId": "sub-123",
  "namespace": "runtime",
  "key": "queue-depth",
  "value": { "depth": 25, "threshold": 20, "alert": true },
  "version": 42,
  "updatedAt": "2026-03-05T13:30:00Z",
  "updatedBy": "orchestrator",
  "changeType": "updated"
}
```

**Step 4: Monitoring service takes action**
The monitoring service verifies the webhook signature, processes the alert, and triggers a response (e.g., scale up reviewer capacity, notify human operators).

---

### Agent Memory and Handoff

Use GSP to persist agent memory across session rotations:

**Before rotation, agent writes memory:**
```json
{
  "namespace": "memory",
  "key": "reviewer-bot-1",
  "value": {
    "learnedPatterns": [
      "PRs with >500 LOC changes require extra scrutiny",
      "Security-tagged PRs should escalate to senior-reviewer"
    ],
    "contextSummary": {
      "lastTask": "Reviewed PR-456, approved with minor comments",
      "activeWorkItems": ["[review:PR-789] In progress", "[review:PR-790] Queued"],
      "openQuestions": ["Should we auto-approve trivial changes?"],
      "handoffNotes": "PR-789 is complex; next session should consult senior-reviewer"
    }
  },
  "description": "Session memory for reviewer-bot-1"
}
```

**After rotation, new session bootstraps:**
```json
{
  "agentId": "reviewer-bot-1",
  "depth": "standard"
}
```

**Bootstrap response includes memory:**
```json
{
  "memory": {
    "learnedPatterns": ["PRs with >500 LOC..."],
    "contextSummary": {
      "lastTask": "Reviewed PR-456...",
      "activeWorkItems": ["[review:PR-789]..."],
      "handoffNotes": "PR-789 is complex..."
    }
  }
}
```

The new session resumes exactly where the previous one left off — no context loss.

---

## Best Practices

### 1. Namespace Organization

Structure namespaces hierarchically for clarity:

```
constitution/                 (constitutional tier)
  ├── review-policy
  └── escalation-chain

architecture/                 (architectural tier)
  ├── reviewer-assignment
  ├── notification-schema
  └── integration-endpoints

runtime/                      (operational tier)
  ├── active-reviews
  ├── queue-depth
  └── fleet-status

memory/{agentId}/            (operational tier, agent-specific)
  ├── memory/reviewer-bot-1
  ├── memory/reviewer-bot-2
  └── memory/orchestrator

config/{agentId}/            (operational tier, agent-specific)
  ├── config/reviewer-bot-1/feature-flags
  └── config/orchestrator/retry-policy
```

### 2. Use Descriptions

Always include a `description` field for every GSP entry:

```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "value": { ... },
  "description": "Currently active code reviews with reviewer assignments and status"
}
```

Descriptions improve discoverability (via `gsp_search`) and serve as inline documentation.

### 3. Version Tracking

Use `gsp_diff` to track changes and detect conflicts:

```javascript
// Agent tracks last known version
let lastKnownVersion = 10;

// Before writing, check for conflicts
const current = await gsp_read({ namespace: 'runtime', key: 'active-reviews' });
if (current.version !== lastKnownVersion) {
  // Conflict detected: someone else updated the entry
  await resolveConflict(current, myUpdate);
} else {
  // Safe to write
  await gsp_write({ namespace: 'runtime', key: 'active-reviews', value: myUpdate });
  lastKnownVersion = current.version + 1;
}
```

### 4. Tiering Decisions

Choose the right tier for each entry:

| Use Constitutional When | Use Architectural When | Use Operational When |
|------------------------|------------------------|----------------------|
| The rule is foundational and must never change without consensus | The pattern defines system structure and requires coordination to change | The state changes frequently during normal operation |
| Example: "All PRs require human approval for security changes" | Example: "Use round-robin for reviewer assignment" | Example: "Current queue depth is 25" |
| Change frequency: months/years | Change frequency: weeks/months | Change frequency: seconds/minutes |

**Rule of thumb:** If in doubt, start with operational. It's easier to promote an operational entry to architectural (via proposal) than to demote a constitutional entry.

### 5. Subscription Hygiene

Clean up stale subscriptions to avoid notification spam:

```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "unsubscribe": true
}
```

Agents should unsubscribe when they:
- Rotate to a new session (old session is gone)
- No longer need notifications (role change, decommission)
- Detect webhook delivery failures (external system down)

### 6. Batch Operations

For high-throughput scenarios, batch writes to reduce API overhead:

```javascript
// Instead of 10 individual writes:
for (const review of reviews) {
  await gsp_write({ namespace: 'runtime', key: `review-${review.id}`, value: review });
}

// Consider aggregating into a single write:
await gsp_write({
  namespace: 'runtime',
  key: 'active-reviews',
  value: reviews.reduce((acc, r) => ({ ...acc, [r.id]: r }), {})
});
```

This reduces latency and token usage.

### 7. Audit Trail

GSP logs every write, proposal, and resolution. Use this audit trail for:
- Debugging (who changed what and when)
- Compliance (governance change history)
- Analytics (state change frequency, proposal approval rate)

Query the audit trail via `get_audit_trail({ namespace: 'constitution', limit: 50 })`.

---

## Example: Complete Multi-Agent Code Review System

Here's a full example tying together all the concepts:

### System Architecture

```
orchestrator (fleet coordination)
    ├── reviewer-bot-1 (code review execution)
    ├── reviewer-bot-2 (code review execution)
    └── reviewer-bot-3 (code review execution)
```

### Step 1: Seed Governance

**Constitutional state:**
```json
{
  "namespace": "constitution",
  "entries": [
    {
      "key": "review-policy",
      "value": { "minReviewers": 2, "requireHumanApproval": ["security"] },
      "tier": "constitutional",
      "description": "Core review policy"
    }
  ]
}
```

**Architectural state:**
```json
{
  "namespace": "architecture",
  "entries": [
    {
      "key": "assignment-algorithm",
      "value": { "algorithm": "round-robin", "maxConcurrentReviews": 5 },
      "tier": "architectural",
      "description": "Reviewer assignment algorithm"
    }
  ]
}
```

### Step 2: Bootstrap Agents

Each agent calls `gsp_bootstrap({ agentId: 'reviewer-bot-1', depth: 'standard' })` on boot.

### Step 3: Orchestrator Coordinates

**Orchestrator writes fleet state:**
```json
{
  "namespace": "runtime",
  "key": "fleet-status",
  "value": { "activeReviewers": 3, "queueDepth": 8 }
}
```

**Orchestrator assigns reviews:**
```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "value": {
    "PR-123": { "assignedTo": "reviewer-bot-1", "status": "in-progress" },
    "PR-124": { "assignedTo": "reviewer-bot-2", "status": "queued" }
  }
}
```

### Step 4: Reviewers Subscribe and React

**Reviewers subscribe to active reviews:**
```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "callbackType": "message"
}
```

**Reviewer receives notification:**
```json
{
  "messageId": "msg-789",
  "source": "gsp",
  "target": "reviewer-bot-1",
  "type": "RESULT",
  "content": {
    "namespace": "runtime",
    "key": "active-reviews",
    "value": { "PR-123": { "assignedTo": "reviewer-bot-1", "status": "in-progress" } },
    "changeType": "updated"
  }
}
```

**Reviewer executes task:**
```javascript
async function handleReviewUpdate(notification) {
  const { value } = notification.content;
  const myReviews = Object.entries(value).filter(([_, r]) => r.assignedTo === 'reviewer-bot-1');
  
  for (const [prId, review] of myReviews) {
    if (review.status === 'in-progress') {
      await executeReview(prId);
    }
  }
}
```

### Step 5: Reviewer Reports Completion

**Reviewer updates review status:**
```json
{
  "namespace": "runtime",
  "key": "active-reviews",
  "value": {
    "PR-123": { "assignedTo": "reviewer-bot-1", "status": "approved" }
  }
}
```

**Orchestrator receives notification and reassigns capacity.**

### Step 6: Evolve System via Proposals

**Orchestrator proposes algorithm change:**
```json
{
  "namespace": "architecture",
  "key": "assignment-algorithm",
  "proposedValue": { "algorithm": "expertise-based", "maxConcurrentReviews": 5 },
  "rationale": "Expertise-based provides better review quality",
  "evidence": "A/B test showed 20% fewer bugs with expertise-based"
}
```

**Human operator approves:**
```json
{
  "proposalId": "prop-456",
  "decision": "approved",
  "reasoning": "Data supports the change"
}
```

**All agents receive notification and switch to new algorithm.**

---

## Troubleshooting

### Problem: Agents miss notifications

**Cause:** Network partition, agent downtime, or webhook delivery failure.

**Solution:** Implement periodic reconciliation with `gsp_diff`:
```javascript
setInterval(async () => {
  const changes = await gsp_diff({ namespace: 'runtime', sinceTimestamp: lastCheck });
  processChanges(changes);
}, 5 * 60 * 1000); // Reconcile every 5 minutes
```

### Problem: Governance violations

**Cause:** Agent attempts to write constitutional/architectural state via `gsp_write`.

**Solution:** The write is rejected with a redirect hint. Use `gsp_propose` instead:
```javascript
try {
  await gsp_write({ namespace: 'constitution', key: 'review-policy', value: newPolicy });
} catch (error) {
  if (error.code === 'GOVERNANCE_VIOLATION') {
    // Use proposal workflow instead
    await gsp_propose({
      namespace: 'constitution',
      key: 'review-policy',
      proposedValue: newPolicy,
      rationale: 'Policy update based on recent incidents'
    });
  }
}
```

### Problem: Stale subscriptions

**Cause:** Agent rotated but didn't unsubscribe.

**Solution:** Unsubscribe during derez flow:
```javascript
async function derez(agentId) {
  // Unsubscribe from all active subscriptions
  await gsp_subscribe({ namespace: 'runtime', key: 'active-reviews', unsubscribe: true });
  
  // Write memory for next session
  await gsp_write({ namespace: 'memory', key: agentId, value: sessionMemory });
  
  // Exit
  process.exit(0);
}
```

### Problem: High API call volume

**Cause:** Too many individual `gsp_write` calls for operational state.

**Solution:** Batch writes into aggregated entries:
```javascript
// Instead of writing each worker status individually:
// gsp_write({ key: 'worker-1-status', value: status1 });
// gsp_write({ key: 'worker-2-status', value: status2 });

// Aggregate into a single entry:
await gsp_write({
  namespace: 'runtime',
  key: 'worker-status',
  value: {
    'worker-1': status1,
    'worker-2': status2,
    'worker-3': status3
  }
});
```

---

## Next Steps

- [GSP API Reference](../api/gsp.md) — Full API documentation with examples
- [Governance Concepts](../concepts/governance.md) — Learn about the three-tier governance model
- [Task Dispatch API](../api/dispatch.md) — Coordinate tasks across your multi-agent system
- [Relay Messages API](../api/relay.md) — Enable agent-to-agent communication
