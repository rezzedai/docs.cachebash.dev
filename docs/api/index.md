---
sidebar_position: 1
slug: /api
---

# API Reference

CacheBash exposes 68 MCP (Model Context Protocol) tools across 16 functional domains, providing comprehensive infrastructure for agentic systems.

## MCP Endpoint

```
https://api.cachebash.dev/v1/mcp
```

Authentication is via Bearer token:

```
Authorization: Bearer {API_KEY}
```

API keys are created via the `create_key` tool or through the CacheBash mobile app.

## Domains

CacheBash tools are organized into these functional domains:

- [**Task Dispatch**](./dispatch.md) — Create, claim, and complete tasks (9 tools)
- [**Inter-Program Messaging**](./relay.md) — Send messages between programs and query message history (6 tools)
- [**Session & Fleet Health**](./pulse.md) — Track session lifecycle and fleet-wide health metrics (7 tools)
- [**Notifications & Questions**](./signal.md) — Send alerts and ask questions to mobile clients (3 tools)
- [**Dream Sessions**](./dream.md) — Activate and manage dream-mode operations (2 tools)
- [**Sprint Execution**](./sprint.md) — Multi-story sprint orchestration with wave-based parallelism (5 tools)
- [**API Key Management**](./keys.md) — Create, rotate, and revoke API keys (4 tools)
- [**Program Registry**](./programs.md) — List and update program metadata (2 tools)
- [**Program State & Memory**](./program-state.md) — Persistent state and learned pattern storage (8 tools)
- [**Grid State Protocol**](./gsp.md) — Unified state distribution with tiered access control (8 tools)
- [**Metrics & Observability**](./metrics.md) — Cost tracking, rate limits, and operational metrics (5 tools)
- [**Audit & Compliance**](./audit.md) — Audit logs and message acknowledgment compliance (2 tools)
- [**Execution Tracing**](./trace.md) — Distributed tracing for sprint and task execution (2 tools)
- [**Content Analysis**](./clu.md) — Ingest, analyze, and generate reports from content (3 tools)
- [**Feedback**](./feedback.md) — Submit feedback as GitHub issues (1 tool)
- [**Admin Operations**](./admin.md) — Administrative utilities (1 tool)

## Development Status

**Phase 2 Stubs:** Three tools are currently non-operational stubs reserved for future functionality:
- `gsp_propose` — Propose constitutional/architectural changes
- `gsp_subscribe` — Subscribe to state change notifications
- `gsp_resolve` — Approve or reject state change proposals

All other tools are production-ready.

## Tool Capabilities

Each API key has a set of capabilities that determine which tools it can invoke. When creating a key via `create_key`, you specify capabilities as an array of strings (e.g., `["dispatch:read", "relay:write"]`).

See individual domain pages for detailed parameter schemas and usage examples.
