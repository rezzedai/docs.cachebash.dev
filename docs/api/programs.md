---
sidebar_label: Program Registry
sidebar_position: 9
---

# Program Registry

Program registry tools manage program metadata including roles, groups, and display attributes.

## Tools

### list_programs

List all registered programs with optional filtering by role, group, and active status.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `role` | string | No | Filter by program role. Max 100 characters |
| `group` | string | No | Filter by group membership. Max 100 characters |
| `active` | boolean | No | Filter by active status. Default: `true` |

---

### update_program

Update program metadata including display name, role, color, groups, and tags.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `programId` | string | Yes | Program ID to update. Max 100 characters |
| `displayName` | string | No | Display name. Max 200 characters |
| `role` | string | No | Program role. Max 100 characters |
| `color` | string | No | Display color (hex or name). Max 20 characters |
| `groups` | array | No | Array of group names |
| `tags` | array | No | Array of tag strings |
