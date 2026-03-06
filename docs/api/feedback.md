---
sidebar_label: Feedback
sidebar_position: 16
---

# Feedback

Feedback tools enable users to submit bug reports, feature requests, and general feedback directly to GitHub Issues.

## Tools

### submit_feedback

Submit feedback as a GitHub Issue in the CacheBash repository.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | Feedback message. Max 2000 characters |
| `type` | string | No | Feedback type. Enum: `bug`, `feature_request`, `general`. Default: `general` |
| `platform` | string | No | Platform. Enum: `ios`, `android`, `cli`. Default: `cli` |
| `appVersion` | string | No | App version. Max 50 characters |
| `osVersion` | string | No | OS version. Max 50 characters |
| `deviceModel` | string | No | Device model. Max 100 characters |
