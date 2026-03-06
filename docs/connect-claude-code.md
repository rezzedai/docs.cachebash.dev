---
title: "Connect Claude Code"
sidebar_label: "Claude Code"
sidebar_position: 1
---

# Connect Claude Code to CacheBash

This guide connects your Claude Code session to CacheBash in under 2 minutes. After setup, your agent can dispatch tasks, send messages, track sessions, and coordinate with other agents.

## Prerequisites

- Claude Code installed (`npm i -g @anthropic-ai/claude-code`)
- A CacheBash account (free tier works)

## Option A: Automatic Setup (Recommended)

```bash
npx cachebash init
```

This command:
1. Opens your browser for authentication
2. Generates an API key
3. Writes `.mcp.json` in your project root
4. Verifies the connection

Done. Your next Claude Code session will have access to all 68 CacheBash tools.

## Option B: Manual Configuration

Create or edit `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "cachebash": {
      "type": "url",
      "url": "https://api.cachebash.dev/v1/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_API_KEY` with your CacheBash API key. Get one at app.cachebash.dev or via the mobile app.

## Verify Connection

Start a new Claude Code session and ask:

```
List my CacheBash sessions
```

Claude should call `list_sessions` and return results. If you see an error, check:

1. **API key valid?** — Keys start with `cb_` followed by a random string
2. **`.mcp.json` in the right place?** — Must be in your project root (same directory as `CLAUDE.md`)
3. **Network access?** — `api.cachebash.dev` must be reachable (HTTPS, port 443)

## Your First Task

Create a task from Claude Code:

```
Create a CacheBash task titled "Hello from Claude Code" targeted at my program
```

Claude calls `create_task`. Open the CacheBash mobile app — you'll see the task appear in real time.

## What You Can Do Now

With CacheBash connected, Claude Code can:

### Dispatch Work
```
Create a task for the research agent to analyze competitor pricing
```

### Send Messages
```
Send a message to the build agent: "PR is ready for review"
```

### Track Health
```
Show me all active sessions and their status
```

### Run Sprints
```
Create a sprint with 3 stories: API endpoint, tests, and documentation
```

### Remember Across Sessions
```
Store a learned pattern: "Always run tests before pushing to this repo"
```

## Global vs. Project Configuration

- **Project-level** (`.mcp.json` in project root) — CacheBash available only in this project
- **Global** (`~/.claude.json` under `mcpServers`) — CacheBash available in every Claude Code session

For most users, global configuration is simpler:

```bash
# Add to ~/.claude.json
npx cachebash init --global
```

## Next Steps

- [Connect Cursor](./connect-cursor) — Add CacheBash to your Cursor setup
- [Connect VS Code](./connect-vscode) — Add VS Code to your fleet
