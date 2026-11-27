# AegisIAM Documentation (`aegis-iam-docs`)

**Author:** Srijani Ghosh — Senior Technical Writer | Docs-as-Code & AI Documentation Specialist  
**Portfolio:** [https://ghoshsrijani.github.io/portfolio/](https://ghoshsrijani.github.io/portfolio/)

Production-grade **Docusaurus 3 Docs-as-Code repository** demonstrating enterprise IAM/IdP technical documentation, REST API endpoint specification, JSON Schema Draft 2020-12 validation, SCIM 2.0 administrative troubleshooting runbooks, and AI DocOps prompt engineering templates.

---

## 1. Repository Architecture

```text
aegis-iam-docs/
├── .github/workflows/
│   └── docs-ci.yml                          # GitHub Actions CI: JSON Schema validation + strict Docusaurus build
├── docs/
│   ├── intro.md                             # Docs-as-Code architecture, CI link gating & RAG chunking standards
│   ├── api/
│   │   └── provision-agent-identity.md      # REST API reference: POST /v1/agents/identities
│   └── admin/
│       └── troubleshoot-scim-sync.md        # IT Admin troubleshooting runbook: SCIM 2.0 directory sync failures
├── prompts/
│   ├── spec-to-api-doc.md                   # Reusable prompt: OpenAPI/engineering spec -> RAG-chunked Markdown
│   ├── style-and-hallucination-auditor.md   # Reusable prompt: AI draft quality, style & hallucination auditor
│   └── release-notes-synthesizer.md         # Reusable prompt: Jira tickets -> Admin release notes + Pendo copy
├── static/schemas/
│   └── agent-identity.schema.json           # JSON Schema (Draft 2020-12) for agent identity provisioning
├── demo-audit.html                          # Side-by-side interactive showcase: Before vs. After AI hallucination audit
├── docusaurus.config.js                     # Strict link checking (onBrokenLinks: 'throw') & sidebar routing
└── sidebars.js                              # Structured navigation for API Reference and Admin Guides
```

---

## 2. Docs-as-Code Workflow & CI Quality Gates

Every documentation change follows a pull-request lifecycle mirroring software engineering standards:

1. **Branch & Author:** Create a feature branch (`feat/...` or `docs/...`) and author modular Markdown alongside formal JSON Schema definitions in `static/schemas/`.
2. **AI Hallucination & Style Audit:** Run drafts through the standardized prompt templates in [`prompts/`](./prompts/) to eliminate hallucinated parameters, enforce active-voice task orientation, and verify security callouts—cutting manual review cycles by **30%**.
3. **Automated CI Verification (`.github/workflows/docs-ci.yml`):**
   - Verifies JSON Schema Draft 2020-12 syntax and required property declarations.
   - Runs `npm run build` with `onBrokenLinks: 'throw'` to guarantee zero broken internal routes or anchor references.
4. **Peer Review & Merge:** Submit a pull request with a structured technical validation checklist prior to merging into `main`.

---

## 3. RAG & Semantic Retrieval Content Standards

To support both **human IT administrators** and **AI/RAG semantic retrieval pipelines**, all documentation in this repository enforces:

- **Self-Contained Semantic Chunks:** Every `H2` and `H3` section encapsulates a complete operational concept (400–600 tokens) with explicit noun-phrase headings.
- **Deterministic Triage & Schema Grids:** All parameters, HTTP error codes (`400`, `401`, `403`, `409`, `422`, `429`), and SCIM 2.0 attribute mappings are structured in uniform Markdown tables for lossless vector serialization.
- **Executable Verification Payloads:** Every guide includes copy-ready `curl`, Python `requests`, and CLI verification commands tested against the schema contract.

---

## 4. Local Development Setup

```bash
# Install dependencies
npm install

# Run production build & strict broken-link verification
npm run build

# Start local hot-reload development server
npm start
```
