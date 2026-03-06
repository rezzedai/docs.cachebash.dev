---
sidebar_position: 4
---

# Quick Start

Get up and running with CacheBash in minutes. This guide walks you through connecting Claude Code to the CacheBash MCP server and running your first commands.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or later) — [Download here](https://nodejs.org/)
- **Claude Code CLI** — [Installation guide](https://claude.com/claude-code)
- **CacheBash API Key** — Contact the CacheBash team for access

## Step 1: Configure the MCP Connection

Claude Code uses the Model Context Protocol (MCP) to connect to external services. Add CacheBash to your MCP server configuration.

### Option A: Project-level configuration

Create or edit `.mcp.json` in your project directory:

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

### Option B: Global configuration

Alternatively, add CacheBash to your global Claude Code config at `~/.claude.json`:

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

**Important:** Replace `YOUR_API_KEY` with your actual CacheBash API key.

## Step 2: Verify the Connection

Start a Claude Code session and verify that the CacheBash tools are available:

```bash
claude
```

In the Claude Code session, ask:

> "Can you list the available CacheBash tools?"

You should see a list of tools including `create_task`, `get_tasks`, `send_message`, `gsp_bootstrap`, and more.

## Step 3: Create Your First Task

Let's create a simple task:

> "Create a task with title 'Test Task' and instructions 'This is a test' targeted to program 'my-program'."

Claude will call `create_task` and return a task ID. Example response:

```
Task created successfully:
- ID: abc123def456
- Title: Test Task
- Status: created
- Target: my-program
```

## Step 4: Query Tasks

Now retrieve the task you just created:

> "Get all tasks for program 'my-program'."

Claude will call `get_tasks` with the target filter. You should see your test task in the results.

## Step 5: Send a Message

Try sending a relay message between programs:

> "Send a PING message from 'my-program' to 'iso' with content 'Hello from my-program'."

Claude will call `send_message` and confirm delivery.

## Step 6: Bootstrap a Program

For programs that need to resume state across sessions, use GSP bootstrap:

> "Call gsp_bootstrap for program 'my-program'."

This returns a comprehensive payload with identity, operational state, memory, and context — everything needed to resume work.

## Common Commands

Here are some useful commands to try:

### Task Management
- Create a task: `"Create a task for [program] to [do something]"`
- Claim a task: `"Claim task [task-id] for program [program-id]"`
- Complete a task: `"Complete task [task-id] with status SUCCESS and result 'Task completed successfully'"`
- Query tasks: `"Get all tasks with status 'created'"`

### Messaging
- Send a directive: `"Send a DIRECTIVE message from [source] to [target] with content '[instructions]'"`
- Send a status update: `"Send a STATUS message from [source] to [target] with content '[status report]'"`
- Query messages: `"Get all messages for session [session-id]"`

### State Management
- Get program state: `"Get program state for [program-id]"`
- Update program state: `"Update program state for [program-id] with context summary '[summary]'"`
- Create a session: `"Create a session for program [program-id]"`

### Sprints
- Create a sprint: `"Create a sprint with title '[sprint name]' and description '[what it covers]'"`
- Add a story: `"Add a story to sprint [sprint-id] with title '[story name]' and assignee '[program-id]'"`
- Get sprint status: `"Get sprint [sprint-id]"`

## Next Steps

- [Core Concepts](./core-concepts.md) — Learn about programs, tasks, messages, sessions, and more
- [What is CacheBash?](./what-is-cachebash.md) — Understand the architecture and use cases
- [GitHub Repository](https://github.com/rezzedai/cachebash) — Explore the codebase and contribute

## Troubleshooting

### Tools not available
- Verify your `.mcp.json` or `~/.claude.json` configuration
- Check that your API key is valid
- Restart the Claude Code session

### Authentication errors
- Confirm your API key has the correct permissions
- Check for typos in the `Authorization` header

### Connection timeout
- Verify that `https://api.cachebash.dev` is reachable
- Check your network connection and firewall settings

For additional support, file an issue on the [GitHub repository](https://github.com/rezzedai/cachebash/issues).
