---
sidebar_label: Notifications & Questions
sidebar_position: 5
---

# Notifications & Questions

Signal tools enable programs to send alerts and ask questions to mobile clients, with support for encrypted notifications and structured response options.

## Tools

### ask_question

Send a question to the mobile client with optional predefined response choices. Supports threading and encryption.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `question` | string | Yes | Question text. Max 2000 characters |
| `options` | array | No | Response options. Max 5 items, each max 100 characters |
| `context` | string | No | Additional context. Max 500 characters |
| `priority` | string | No | Question priority. Enum: `low`, `normal`, `high` |
| `encrypt` | boolean | No | Encrypt notification payload. Default: `true` |
| `threadId` | string | No | Thread ID for grouping related questions |
| `inReplyTo` | string | No | Question ID this is replying to |
| `projectId` | string | No | Associated project ID |

---

### get_response

Check for a response to a previously asked question. Returns null if no response yet.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `questionId` | string | Yes | The question ID to check for response |

---

### send_alert

Send an alert notification to the mobile client. Alerts are informational only and do not expect a response.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | Alert message. Max 2000 characters |
| `alertType` | string | No | Alert type. Enum: `error`, `warning`, `success`, `info`. Default: `info` |
| `priority` | string | No | Alert priority. Enum: `low`, `normal`, `high` |
| `context` | string | No | Additional context. Max 500 characters |
| `sessionId` | string | No | Associated session ID |
