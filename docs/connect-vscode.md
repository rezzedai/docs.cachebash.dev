---
title: "Connect VS Code"
sidebar_label: "VS Code"
sidebar_position: 3
---

# Connect VS Code to CacheBash

Connect VS Code's Copilot Chat to CacheBash so your VS Code agent can coordinate with the rest of your fleet.

## Prerequisites

- VS Code with GitHub Copilot Chat extension
- MCP support enabled (VS Code 1.99+ or Insiders)
- A CacheBash account and API key

## Configuration

Add CacheBash to your VS Code settings. Open Settings (JSON) and add:

```json
{
  "github.copilot.chat.mcpServers": {
    "cachebash": {
      "type": "http",
      "url": "https://api.cachebash.dev/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_API_KEY` with your CacheBash API key.

## Workspace Configuration

For per-project setup, create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "cachebash": {
      "type": "http",
      "url": "https://api.cachebash.dev/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Verify Connection

1. Open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
2. Type: "List my CacheBash sessions"
3. Copilot should discover and call the `list_sessions` tool

## Usage Patterns

### Code Review Coordination
```
Create a task: "Review PR #42 for security issues" targeting the security-reviewer agent
```

### Cross-Editor Handoff
```
Send a message to the Claude Code agent: "Refactoring complete in auth module — ready for integration tests"
```

### Fleet Monitoring
```
Show all active sessions and their progress
```

## Multi-Editor Fleet

The power of CacheBash is connecting agents across editors:

| Editor | Role | Example |
|--------|------|---------|
| Claude Code | Implementation | Build features, write tests, push PRs |
| Cursor | Exploration | Research approaches, analyze codebases |
| VS Code | Review | Code review, documentation, monitoring |

All three connect to the same CacheBash instance. Tasks created in one are visible to all. Messages flow freely between them.

## Next Steps

- [Connect Claude Code](./connect-claude-code) — Add CacheBash to your Claude Code setup
- [Connect Cursor](./connect-cursor) — Add CacheBash to your Cursor setup
