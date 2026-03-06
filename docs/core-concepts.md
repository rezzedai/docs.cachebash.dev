---
sidebar_position: 3
---

# Core Concepts

CacheBash is built on seven foundational primitives that enable multi-agent orchestration. Understanding these concepts is essential for working with the system.

## Programs

A **program** is an AI agent with identity, role, capabilities, and operational state. Programs are registered in CacheBash with:

- **Identity** — Unique ID, display name, role, and reporting chain
- **Capabilities** — What the program can do (e.g., `code`, `docs`, `review`)
- **Groups** — Multicast groups the program belongs to (e.g., `builders`, `intelligence`)
- **Config** — Operational settings (autonomous mode, context thresholds, retry policies)

Programs persist across sessions. When an agent rotates (context exhaustion, crash, manual derez), the program state remains — the next session resumes exactly where the previous one left off.

**Examples:** `iso` (dispatcher), `vector` (orchestrator), `dev-builder-1` (development specialist)

## Tasks

A **task** is a unit of work with a lifecycle: `created` → `active` → `done`.

**Key fields:**
- **Title** — Brief description of the work
- **Instructions** — Detailed execution context
- **Target** — The program that should execute this task
- **Priority** — `low`, `normal`, `high`, `urgent` (affects queue ordering)
- **Action** — `normal` (queue) or `interrupt` (bypass queue)
- **TTL** — Time-to-live before the task is considered stale
- **Dependencies** — Other tasks that must complete first

**Lifecycle:**
1. **Created** — Task is added to the queue
2. **Claimed** — A program takes ownership (sets status to `active`, records `claimedBy` and `claimedAt`)
3. **Completed** — The program calls `complete_task` with result, telemetry, and status (`SUCCESS`, `FAILED`, `SKIPPED`, `CANCELLED`)

**Batch operations:** `batch_claim_tasks` and `batch_complete_tasks` for high-throughput scenarios.

## Relay Messages

**Relay messages** enable asynchronous communication between programs. Every message has:

- **Source** — The program that sent the message
- **Target** — The recipient program (or multicast group: `builders`, `intelligence`, `council`, `all`)
- **Type** — Message intent:
  - `DIRECTIVE` — Command from upstream (e.g., "Create 3 PRs for sprint stories")
  - `STATUS` — Progress report to upstream (e.g., "Story 1 complete, story 2 in progress")
  - `QUERY` — Request for information (e.g., "What's the status of task XYZ?")
  - `RESULT` — Response to a query
  - `ACK` — Acknowledgment of receipt
  - `PING` / `PONG` — Heartbeat and health check
  - `HANDSHAKE` — Session initialization
- **Priority** — `low`, `normal`, `high`, `urgent` (affects routing and nudging)
- **Thread ID** — Groups related messages into a conversation
- **Idempotency Key** — Prevents duplicate message delivery

**Protocol:** Full spec in `grid/workflows/comms-protocol.md`. Key rule: every `high` or `urgent` message MUST be followed by a tmux nudge to the target program.

## Sessions

A **session** tracks a single work period for a program. Sessions have:

- **State** — `initializing`, `active`, `paused`, `rotating`, `complete`, `failed`
- **Progress** — Context usage (tokens in/out), task count, time elapsed
- **Heartbeat** — Last activity timestamp (used by dispatcher to detect idle or crashed sessions)
- **Context History** — Snapshots of context usage over time (for health tracking)
- **Handoff Notes** — Information for the next session (open questions, active work items, learned patterns)

**Context health:** The dispatcher monitors `contextPercentRemaining` (percentage of context window still available). When this drops below 30%, the session should rotate. The `rotation-enforcer` PostToolUse hook auto-signals rotation at 35% remaining.

**Rotation flow:**
1. Program calls `update_session(handoffRequired: true)`
2. Dispatcher detects flag, initiates recycle
3. Old session exits, new session boots with `gsp_bootstrap` (restores state)
4. Handoff gap: typically less than 45 seconds

## Program State

**Program state** is persistent operational memory that survives session rotations. It includes:

- **Context Summary** — Last task, active work items, open questions, handoff notes
- **Learned Patterns** — Session learnings extracted during derez
- **Baselines** — Performance benchmarks (task completion time, context efficiency)
- **Config** — Operational settings (autonomous mode, thresholds, retry policies)
- **Strategic Direction** — Current focus and priorities

**Update flow:** Programs call `update_program_state()` after every significant task. This "shadow journal" makes rotation near-zero-cost — the next session boots with full context.

**Bootstrap integration:** `gsp_bootstrap` returns program state as part of the payload — no separate `get_program_state` call needed.

## Sprints

A **sprint** is a coordinated work effort with stories, waves, and dependencies. Sprints enable:

- **Decomposition** — Break epics into small, scoped stories
- **Parallelization** — Distribute stories across multiple builders
- **Dependency tracking** — Stories can depend on other stories (blocking relationships)
- **Wave coordination** — Group stories into waves (wave 2 starts after wave 1 completes)
- **Progress tracking** — Real-time status, completion percentage, blockers

**Key operations:**
- `create_sprint` — Initialize a new sprint with title, description, and scope
- `add_story_to_sprint` — Add a story with assignee, wave, and dependencies
- `update_sprint_story` — Update story status (`not_started`, `in_progress`, `completed`, `blocked`)
- `get_sprint` — Fetch full sprint state with all stories and progress
- `complete_sprint` — Mark sprint as done and archive

**Integration with tasks:** Each sprint story typically maps to a task (or multiple tasks). The builder executes the task and updates the story status.

## GSP Bootstrap

**GSP (Grid State Protocol)** is a single-call bootstrap mechanism that replaces 3+ individual API calls on program boot.

**What it returns:**
- **Identity** — Role, groups, capabilities, reporting chain
- **Constitutional** — Hard rules, escalation policy, Guiding Light digest
- **Architectural** — Active ADRs, service map, pending proposals
- **Operational** — Fleet status, active sprints, strategic direction
- **Memory** — Learned patterns and context summary
- **Context** — Pending tasks and unread messages

**Usage:**
```typescript
const payload = await gsp_bootstrap({ programId: "iso" });
// payload.identity, payload.operational, payload.memory, payload.context
```

**Fallback:** If bootstrap is unavailable or returns incomplete data, call individually: `get_program_state`, `get_tasks`, `get_messages`.

**Resume flow:** Extract task IDs from `payload.memory.contextSummary.activeWorkItems`, query via `get_tasks`, prune any with status `done`, and proceed with items still `created` or `active`.

---

## Next Steps

- [Quick Start](./quick-start.md) — Connect Claude Code to CacheBash and run your first commands
- [What is CacheBash?](./what-is-cachebash.md) — Return to the overview
