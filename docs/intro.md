---
sidebar_position: 1
title: AegisIAM Architecture & Docs-as-Code Overview
description: Enterprise identity, autonomous AI agent provisioning, and SCIM 2.0 directory synchronization documentation engineered for human administrators and RAG semantic retrieval.
---

# AegisIAM Documentation Architecture

Welcome to the **AegisIAM Enterprise Identity & Agentic Access Plane** technical documentation repository. This portal provides authoritative REST API specifications, Identity Provider (IdP) configuration procedures, and SCIM 2.0 troubleshooting playbooks for IT administrators, DevSecOps engineers, and AI platform teams.

---

## 1. Docs-as-Code Pipeline & Governance

All AegisIAM documentation is authored, reviewed, tested, and deployed using a strict **Docs-as-Code** methodology alongside application source code:

- **Declarative Markdown & Schema Validation:** Documentation is authored in modular CommonMark/MDX (`docs/`) and paired with formal Draft 2020-12 JSON Schemas (`static/schemas/`).
- **Pull Request Gating & CI Link Verification:** Every pull request triggers our GitHub Actions pipeline (`.github/workflows/docs-ci.yml`), which executes:
  1. **Schema Syntax & Constraint Auditing:** Validates all JSON Schema definitions in `static/schemas/` against JSON Schema Draft 2020-12 rules.
  2. **Strict Broken-Link Compilation:** Runs `npm run build` with `onBrokenLinks: 'throw'` in `docusaurus.config.js`, guaranteeing zero broken cross-references or dead anchor targets reach production.
- **AI-Assisted Editorial & Hallucination Auditing:** Drafts generated from raw OpenAPI specs or engineering JIRA tickets pass through standardized prompt templates (`prompts/`) to verify parameter fidelity, enforce style rules, and eliminate hallucinated flags before peer review.

---

## 2. RAG-Optimized Content & Chunking Standards

Modern enterprise documentation serves two distinct audiences simultaneously: **human operators** scanning for rapid triage steps and **Retrieval-Augmented Generation (RAG) / AI support agents** querying semantic vector indexes.

To maximize precision across both consumption paths, every guide in this repository adheres to four structural contracts:

| Structural Rule | Human Reader Benefit | RAG / Vector Retriever Benefit |
| :--- | :--- | :--- |
| **Self-Contained H2/H3 Semantic Chunks** | Enables rapid visual scanning and deep-linking during active incidents. | Prevents context bleed when documents are split at 400–600 token boundaries. |
| **Explicit Noun-Phrase Headings** | Eliminates ambiguous headings like *"Overview"* or *"Configuration"*. | Embeds high-signal entity keywords (`SCIM 2.0`, `POST /v1/agents/identities`) directly into vector metadata. |
| **Deterministic Triage & Schema Tables** | Maps HTTP status codes, symptoms, and payload attributes in scannable grids. | Preserves key-value relationships during Markdown-to-embedding serialization. |
| **Copy-Ready Verification Commands** | Gives administrators immediate CLI and REST validation snippets. | Grounds LLM responses in deterministic, executable syntax rather than generic prose. |

---

## 3. Core Documentation Modules

Explore the primary production modules in this repository:

- **[API Reference: Provision Autonomous Agent Identity (`POST /v1/agents/identities`)](./api/provision-agent-identity.md)** — Complete REST API specification for issuing short-lived workload certificates, binding Least-Privilege RBAC policies, and enforcing human-in-the-loop (HITL) sponsor attestation for autonomous AI agents.
- **[Admin Guide: Troubleshoot SCIM 2.0 Directory Sync Failures](./admin/troubleshoot-scim-sync.md)** — Step-by-step diagnostic runbook for resolving `401 Unauthorized` bearer token expirations, `400 Bad Request` attribute schema collisions, and `429 Too Many Requests` batch throttling across Okta, Microsoft Entra ID, and JumpCloud directories.
