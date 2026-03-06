---
sidebar_position: 2
---

# What is CacheBash?

CacheBash is an MCP (Model Context Protocol) server that enables AI agent orchestration and coordination. It provides the infrastructure for multi-agent systems to communicate, track work, manage state, and operate autonomously.

## The Problem

Building multi-agent AI systems is hard. Agents need to:
- **Coordinate work** across multiple concurrent tasks
- **Communicate** with each other reliably and asynchronously
- **Persist state** across sessions and crashes
- **Track progress** and report status up the chain
- **Learn patterns** and improve over time

Without a dedicated orchestration layer, these capabilities require custom infrastructure, complex state management, and brittle communication patterns.

## The Solution

CacheBash provides a turnkey orchestration backend for AI agents running in Claude Code. It handles:

- **Task Queuing** — Create, claim, and complete tasks with priority levels, TTLs, and retry policies
- **Relay Messaging** — Send messages between agents with types (DIRECTIVE, STATUS, QUERY, RESULT), threading, and idempotency
- **Session Tracking** — Monitor agent work sessions with heartbeats, context health, and handoff support
- **Program State** — Persistent operational state per agent (learned patterns, context summaries, baselines)
- **Memory System** — Pattern-based memory with storage, recall, reinforcement, and decay
- **Sprint Orchestration** — Coordinate parallel work with stories, waves, dependencies, and progress tracking
- **GSP Bootstrap** — Single-call state delivery for fast agent boot and resume

## Architecture

CacheBash is built on Google Cloud Platform:

- **MCP Server** — TypeScript server exposing Model Context Protocol tools, deployed on Cloud Run
- **Firestore** — Primary data store for tasks, messages, sessions, program state, and memory
- **Cloud Functions** — Async operations (memory decay, cleanup, notifications, dead letter handling)
- **Firebase Auth** — API key management with capability-based access control

The MCP server exposes ~50 tools that Claude Code agents call directly via the Model Context Protocol. No SDK required — agents interact through natural language tool invocations.

## How It Works

1. **Agents register** as "programs" with identity, role, capabilities, and reporting chain
2. **Work enters the system** as tasks (from Flynn or upstream agents)
3. **Agents claim tasks**, execute them, and report completion
4. **Agents communicate** via relay messages (DIRECTIVE, STATUS, QUERY, RESULT)
5. **State persists** across session rotations — agents resume exactly where they left off
6. **Patterns are learned** and stored in memory, improving agent behavior over time

## The Claude Code Ecosystem

CacheBash is designed for AI agents running in the [Claude Code CLI](https://claude.com/claude-code). The Grid architecture uses CacheBash to coordinate:

- **VECTOR** — The orchestrator that manages the fleet
- **ISO** — The dispatcher that routes work to builders
- **Builders** — Specialist agents (security, architecture, content, product, dev)

This multi-agent system operates autonomously, decomposing work, parallelizing execution, and reporting results up the chain.

## Key Features

- **Multi-agent coordination** — Programs communicate via relay messaging with guaranteed delivery and threading
- **Autonomous operation** — Agents self-chain work with automatic idle detection and nudging
- **Context health tracking** — Monitor agent context usage and trigger rotation at natural breaks
- **Sprint orchestration** — Decompose epics into stories, distribute across agents, track progress
- **Pattern memory** — Agents learn from experience and apply patterns across sessions
- **Fleet observability** — Real-time health, timeline, and metrics for all active sessions
- **Graceful degradation** — Retry policies, dead letter queues, and circuit breakers for resilience

## Next Steps

- [Core Concepts](./core-concepts.md) — Learn the foundational primitives
- [Quick Start](./quick-start.md) — Connect Claude Code to CacheBash
- [GitHub Repository](https://github.com/rezzedai/cachebash) — Explore the codebase
