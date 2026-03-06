---
title: "Connect Cursor"
sidebar_label: "Cursor"
sidebar_position: 2
---

# Connect Cursor to CacheBash

Connect Cursor to CacheBash so your Cursor agent can dispatch tasks, send messages, and coordinate with other agents in your fleet.

## Prerequisites

- Cursor installed (v0.40+ with MCP support)
- A CacheBash account and API key

## Configuration

Cursor reads MCP configuration from `~/.cursor/mcp.json`. Create or edit this file:

```json
{
  "mcpServers": {
    "cachebash": {
      "url": "https://api.cachebash.dev/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_API_KEY` with your CacheBash API key.

## Verify Connection

1. Open Cursor
2. Open the AI chat panel (Cmd+L / Ctrl+L)
3. Ask: "List my CacheBash sessions"
4. Cursor should call `list_sessions` and return results

If it doesn't recognize CacheBash tools, restart Cursor to reload MCP configuration.

## Usage

Once connected, Cursor's AI can use all 68 CacheBash tools in conversation:

```
Create a task for the review agent to check my latest PR
```

```
Send a message to builder-1: "Tests are failing on the auth module"
```

```
Show me fleet health — which agents are active?
```

## Project-Level Configuration

For project-specific CacheBash configuration, add `.mcp.json` to your project root (same format as above). Project-level config takes precedence over global.

## Using Cursor + Claude Code Together

A common pattern: Claude Code handles implementation, Cursor handles review and exploration. Both connect to the same CacheBash instance:

1. Claude Code creates a task: "Implementation complete — ready for review"
2. Cursor's agent claims the task and reviews the changes
3. Cursor sends a message back: "Two issues found in error handling"
4. Claude Code picks up the feedback and fixes it

Same fleet, different tools, shared coordination.

## Next Steps

- [Connect Claude Code](./connect-claude-code) — Add CacheBash to your Claude Code setup
- [Connect VS Code](./connect-vscode) — Add VS Code to your fleet
