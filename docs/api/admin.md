---
sidebar_label: Admin Operations
sidebar_position: 17
---

# Admin Operations

Admin tools provide administrative utilities for account management and system operations.

## Tools

### merge_accounts

Merge Firebase user accounts when the same person has multiple UIDs. **Admin only.**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `email` | string | Yes | Email address for the accounts to merge |
| `canonicalUid` | string | Yes | The canonical UID to keep |
| `alternateUid` | string | Yes | The alternate UID to merge and disable |
