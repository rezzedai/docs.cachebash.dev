---
sidebar_label: API Key Management
sidebar_position: 8
---

# API Key Management

Key management tools enable creating, rotating, and revoking API keys with capability-based access control.

## Tools

### create_key

Create a new API key with specified capabilities. Returns the API key (only shown once) and key hash.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID this key belongs to. Max 50 characters |
| `label` | string | Yes | Human-readable label for the key. Max 200 characters |
| `capabilities` | array | No | Array of capability strings (e.g., `["dispatch:read", "relay:write"]`) |

---

### revoke_key

Revoke an API key, immediately invalidating it. Revocation is permanent and cannot be undone.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `keyHash` | string | Yes | The key hash to revoke |

---

### rotate_key

Rotate the current API key. Returns a new key and invalidates the old one.

No parameters.

---

### list_keys

List all API keys for the authenticated tenant, optionally including revoked keys.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `includeRevoked` | boolean | No | Include revoked keys in results. Default: `false` |
