---
sidebar_label: Inter-Program Messaging
sidebar_position: 3
---

# Inter-Program Messaging

Relay tools provide asynchronous messaging between programs with support for multicast groups, threading, and delivery guarantees.

## Tools

### send_message

Send a message to another program or multicast group. Messages support priorities, threading, and automatic retry with dead-letter handling.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | Message content. Max 2000 characters |
| `source` | string | Yes | Source program ID. Max 100 characters |
| `target` | string | Yes | Target program ID or group name. Max 100 characters |
| `message_type` | string | Yes | Message type. Enum: `PING`, `PONG`, `HANDSHAKE`, `DIRECTIVE`, `STATUS`, `ACK`, `QUERY`, `RESULT` |
| `priority` | string | No | Message priority. Enum: `low`, `normal`, `high`. Default: `normal` |
| `action` | string | No | Dispatch action. Enum: `interrupt`, `sprint`, `parallel`, `queue`, `backlog`. Default: `queue` |
| `context` | string | No | Additional context. Max 500 characters |
| `sessionId` | string | No | Source session ID |
| `reply_to` | string | No | Message ID this is replying to |
| `threadId` | string | No | Thread ID for grouping related messages |
| `ttl` | number | No | Time-to-live in seconds. Default: 86400 (24 hours) |
| `payload` | object | No | Structured payload object |
| `idempotency_key` | string | No | Idempotency key to prevent duplicate sends. Max 100 characters |

---

### get_messages

Check for pending messages in a session's inbox. Optionally mark retrieved messages as read.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID to check messages for |
| `target` | string | No | Filter by target program ID |
| `markAsRead` | boolean | No | Mark retrieved messages as read. Default: `false` |
| `message_type` | string | No | Filter by message type. Enum: `PING`, `PONG`, `HANDSHAKE`, `DIRECTIVE`, `STATUS`, `ACK`, `QUERY`, `RESULT` |
| `priority` | string | No | Filter by priority. Enum: `low`, `normal`, `high` |

---

### get_dead_letters

View messages that failed delivery after all retry attempts. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `limit` | number | No | Maximum number of dead letters to return. Range: 1-50. Default: 20 |

---

### list_groups

List all available multicast groups that can be used as message targets.

No parameters.

---

### get_sent_messages

Query the outbox for messages sent by the current session or program.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | No | Filter by delivery status |
| `target` | string | No | Filter by target program. Max 100 characters |
| `threadId` | string | No | Filter by thread ID |
| `source` | string | No | Filter by source program (admin only). Max 100 characters |
| `limit` | number | No | Maximum number of messages to return. Range: 1-50. Default: 20 |

---

### query_message_history

Query full message history across all programs. **Admin only.** Requires at least one of `threadId`, `source`, or `target`.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `threadId` | string | No | Filter by thread ID |
| `source` | string | No | Filter by source program. Max 100 characters |
| `target` | string | No | Filter by target program. Max 100 characters |
| `message_type` | string | No | Filter by message type. Enum: `PING`, `PONG`, `HANDSHAKE`, `DIRECTIVE`, `STATUS`, `ACK`, `QUERY`, `RESULT` |
| `status` | string | No | Filter by delivery status |
| `since` | string | No | ISO 8601 timestamp for start of range |
| `until` | string | No | ISO 8601 timestamp for end of range |
| `limit` | number | No | Maximum number of messages to return. Range: 1-100. Default: 50 |
