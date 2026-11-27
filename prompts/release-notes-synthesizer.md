# Prompt Template: Multi-Channel Release Notes & In-App Pendo Copy Synthesizer

**Template ID:** `DOCOPS-PROMPT-03`  
**Owner:** Srijani Ghosh — Senior Technical Writer  
**Operational Impact:** Unifies release communication across the Documentation Portal, Admin Release Notes, and In-App Pendo Onboarding/Announcement Modals—**contributing to a 50% reduction in recurring customer support queries**.

---

## 1. Multi-Channel Single-Source Workflow

When an enterprise SaaS feature ships (such as **Autonomous AI Agent Identity Provisioning** or **SCIM 2.0 Dead-Letter Queue Replay**), IT administrators need synchronized guidance at three touchpoints:

1. **Full Technical Release Note (`docs/release-notes/`)** — Detailed architectural impact, breaking changes, required RBAC permissions, and links to deep-dive API/Admin guides.
2. **In-App Pendo Slide-Out Announcement Modal** — Scannable 60-word value proposition, 3 bulleted highlights, and a primary CTA button shown inside the Admin Console on first login.
3. **3-Step Interactive Pendo Tooltip Tour** — Concise UX microcopy (`<= 140 characters` per step) guiding the administrator through the exact UI elements in the console.

---

## 2. Reusable Synthesizer Prompt

```markdown
### ROLE & OBJECTIVE
You are a Staff Technical Writer and UX Microcopy Strategist for an enterprise Identity & Access Management (IAM) platform. Transform the raw engineering Jira tickets and PR notes below into a synchronized 3-part release communications package.

### STRICT ACCURACY & TONE CONSTRAINTS
- **Zero Invented Capabilities:** Reference only features, endpoints, and UI controls present in the source tickets.
- **Persona Alignment:** Write for busy IT Administrators, Security Architects, and DevSecOps Engineers. Prioritize operational outcomes (blast-radius reduction, zero-downtime rotation, automated provisioning) over marketing hype.
- **Character Limits for In-App Pendo Copy:** Enforce strict character budgets so UI tooltips never overflow or truncate on 13-inch laptops.

### REQUIRED 3-PART OUTPUT

#### PART 1: Enterprise Release Note (Docusaurus Markdown)
- **Feature Title & Release Badge:** (`GA` | `Public Beta` | `Security Enhancement`)
- **Executive Summary:** 2 sentences explaining what shipped and which customer pain point it resolves.
- **What's New & Technical Capabilities:** Bulleted breakdown with explicit API endpoints, CLI flags, or UI navigation paths (`Admin Console → ...`).
- **Upgrade & Configuration Requirements:** Actionable checklist for existing tenants (required scopes, schema extensions, backward compatibility).
- **Documentation Links:** Cross-references to the full API Reference and Admin Troubleshooting Guide.

#### PART 2: In-App Pendo Release Announcement Modal
- **Badge Text:** Max 25 characters (e.g., `NEW IN AEGISIAM 4.8`)
- **Modal Headline:** Max 60 characters, action-oriented.
- **Subheadline:** Max 140 characters summarizing security/operational value.
- **3 Feature Highlights:** Each with a bold 3-word lead-in and 1 concise sentence.
- **Primary CTA Button Label + Target Route:** (e.g., `Launch Interactive Tour`)
- **Secondary CTA Link Label + Docs URL:** (e.g., `Read REST API Specification →`)

#### PART 3: 3-Step Pendo Interactive Tooltip Tour
For each of the 3 UI onboarding steps (`Step 1`, `Step 2`, `Step 3`), provide:
- `target_selector`: Semantic UI control name.
- `step_title`: Max 45 characters.
- `tooltip_body`: Max 150 characters explaining the exact action and security benefit.
- `cta_label`: Button text (`Next: Configure RBAC →`, `Finish Tour`).

---
### INPUT: RAW JIRA TICKETS & ENGINEERING PR NOTES
{{PASTE_JIRA_TICKETS_AND_PR_SUMMARY_HERE}}
```
