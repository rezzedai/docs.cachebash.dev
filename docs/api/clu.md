---
sidebar_label: Content Analysis
sidebar_position: 15
---

# Content Analysis

CLU (Content Learning Unit) tools ingest content, run analysis to extract patterns and opportunities, and generate structured reports.

## Tools

### clu_ingest

Ingest content from transcripts, URLs, text, or documents for analysis.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | string | Yes | Content to ingest. Range: 1-500000 characters |
| `source_type` | string | Yes | Content source type. Enum: `transcript`, `url`, `text`, `document` |
| `source_url` | string | No | Source URL if applicable |
| `metadata` | object | No | Metadata object with `speakers`, `date`, `topic`, `tags` |
| `session_id` | string | No | Associated session ID. Max 100 characters |

---

### clu_analyze

Run analysis on ingested content to extract patterns, identify opportunities, find gaps, or generate synthesis.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `session_id` | string | Yes | Session ID for the ingested content. Max 100 characters |
| `analysis_type` | string | No | Analysis type. Enum: `patterns`, `opportunities`, `gaps`, `synthesis`, `full`. Default: `full` |
| `focus_domains` | array | No | Array of domain strings to focus analysis on |
| `confidence_threshold` | number | No | Minimum confidence for results. Range: 0-1. Default: 0.5 |

---

### clu_report

Generate a formatted report from analysis results.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `analysis_id` | string | Yes | Analysis ID to generate report from. Max 100 characters |
| `report_type` | string | No | Report type. Enum: `opportunity_brief`, `synthesis`, `prd`, `executive_summary`. Default: `synthesis` |
| `format` | string | No | Output format. Enum: `markdown`, `json`. Default: `markdown` |
