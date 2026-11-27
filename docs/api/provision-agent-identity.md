---
sidebar_position: 1
title: "POST /v1/agents/identities — Provision Agent Identity"
description: Provision a cryptographically verifiable identity, RBAC policy binding, and short-lived token rotation profile for an autonomous AI agent or MCP workload.
---

# Provision Autonomous AI Agent Identity

**Endpoint:** `POST https://api.aegisiam.dev/v1/agents/identities`  
**Authentication:** Bearer API Token (`iam:agents:write` scope required)  
**Content-Type:** `application/json`  
**JSON Schema:** [`/schemas/agent-identity.schema.json`](/schemas/agent-identity.schema.json)

---

## 1. Endpoint Overview & Operational Context

Autonomous AI agents, Model Context Protocol (MCP) servers, and LangGraph orchestrators require non-human identities with deterministic blast-radius boundaries. Unlike static service accounts, an **AegisIAM Agent Identity** binds an autonomous workload to:

1. **A Verified Human Sponsor (`sponsor_identity_id`)** — Establishes cryptographic accountability and audit attribution for every downstream tool invocation.
2. **Scoped RBAC Policies (`rbac_policies`)** — Restricts the agent to explicit resource ARNs and action verbs.
3. **Ephemeral Token TTL (`token_ttl_seconds`)** — Enforces short-lived credential rotation (300 to 3,600 seconds) without long-lived static secrets.

:::warning[Security Mandate: Least-Privilege RBAC & Human Attestation]
Never assign wildcard administrative policies (such as `role:org-admin` or `*:*`) to an autonomous agent identity. Production tenants enforce **Human-in-the-Loop (HITL)** sponsor verification: if `sponsor_identity_id` does not map to an active human directory user with MFA enabled, the API rejects the provisioning request with `422 Unprocessable Entity` (`ERR_SPONSOR_MFA_REQUIRED`).
:::

---

## 2. Request Headers

| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | `string` | **Yes** | Bearer token with `iam:agents:write` permission (format: `Bearer aeg_live_...`). |
| `Content-Type` | `string` | **Yes** | Must be set to `application/json`. |
| `X-Aegis-Tenant-ID` | `string` | **Yes** | Target organization tenant UUID (for example, `tnt_01J9X7K2M8P4Q6R9`). |
| `Idempotency-Key` | `string` | Recommended | UUIDv4 token preventing duplicate identity creation across network retries (24-hour retention window). |

---

## 3. Request Body Schema (`application/json`)

The request payload is validated against [`/schemas/agent-identity.schema.json`](/schemas/agent-identity.schema.json).

| Field | Type | Required | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `agent_name` | `string` | **Yes** | Lowercase alphanumeric slug with hyphens (`^[a-z0-9-]{3,64}$`). Must be unique within the tenant. |
| `environment` | `string` | **Yes** | Deployment tier enum: `production`, `staging`, or `development`. |
| `orchestrator_type` | `string` | **Yes** | Agent runtime enum: `langchain`, `langgraph`, `mcp-server`, or `custom-agent`. |
| `sponsor_identity_id` | `string` | **Yes** | Directory user ID of the accountable human owner (`^usr_[a-zA-Z0-9]{12,24}$`). |
| `rbac_policies` | `array<string>` | **Yes** | 1 to 10 explicit RBAC policy URN identifiers (for example, `urn:aegis:policy:scim-readonly`). |
| `allowed_mcp_tools` | `array<string>` | No | Optional allowlist of MCP tool identifiers the agent is permitted to invoke. |
| `token_ttl_seconds` | `integer` | **Yes** | Ephemeral workload token lifetime in seconds. Minimum: `300` (5 min), Maximum: `3600` (60 min). |
| `mtls_fingerprint_sha256` | `string` | No | Optional 64-character hex SHA-256 certificate fingerprint for workload mTLS binding. |
| `audit_webhook_url` | `string` | No | HTTPS endpoint receiving real-time JSON telemetry for every agent token exchange. |

---

## 4. Code Examples

### cURL Request

```bash
curl --request POST "https://api.aegisiam.dev/v1/agents/identities" \
  --header "Authorization: Bearer aeg_live_98f72b1c4d3e5a6f7b8c9d0e1f2a3b4c" \
  --header "Content-Type: application/json" \
  --header "X-Aegis-Tenant-ID: tnt_01J9X7K2M8P4Q6R9" \
  --header "Idempotency-Key: 7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  --data '{
    "agent_name": "secops-triage-orchestrator-prod",
    "environment": "production",
    "orchestrator_type": "langgraph",
    "sponsor_identity_id": "usr_01H8Z4W9X2K7M3N5P8",
    "rbac_policies": [
      "urn:aegis:policy:directory-audit-reader",
      "urn:aegis:policy:scim-queue-inspector"
    ],
    "allowed_mcp_tools": [
      "mcp.jumpcloud.directory.read_users",
      "mcp.siem.alerts.acknowledge"
    ],
    "token_ttl_seconds": 900,
    "mtls_fingerprint_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "audit_webhook_url": "https://siem.example.internal/v1/aegis-agent-events"
  }'
```

### Python (`requests`) Example

```python
import uuid
import requests

AEGIS_API_URL = "https://api.aegisiam.dev/v1/agents/identities"
API_TOKEN = "aeg_live_98f72b1c4d3e5a6f7b8c9d0e1f2a3b4c"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
    "X-Aegis-Tenant-ID": "tnt_01J9X7K2M8P4Q6R9",
    "Idempotency-Key": str(uuid.uuid4()),
}

payload = {
    "agent_name": "secops-triage-orchestrator-prod",
    "environment": "production",
    "orchestrator_type": "langgraph",
    "sponsor_identity_id": "usr_01H8Z4W9X2K7M3N5P8",
    "rbac_policies": [
        "urn:aegis:policy:directory-audit-reader",
        "urn:aegis:policy:scim-queue-inspector",
    ],
    "allowed_mcp_tools": [
        "mcp.jumpcloud.directory.read_users",
        "mcp.siem.alerts.acknowledge",
    ],
    "token_ttl_seconds": 900,
    "mtls_fingerprint_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "audit_webhook_url": "https://siem.example.internal/v1/aegis-agent-events",
}

response = requests.post(AEGIS_API_URL, headers=headers, json=payload, timeout=10)
response.raise_for_status()

agent_identity = response.json()
print(f"Provisioned Agent ID: {agent_identity['agent_identity_id']}")
print(f"Token Exchange Endpoint: {agent_identity['oauth2_token_endpoint']}")
```

---

## 5. Response Payload (`201 Created`)

When provisioning succeeds, the server returns `201 Created` with the immutable `agent_identity_id` and a one-time bootstrap client secret.

```json
{
  "agent_identity_id": "agt_01J9Y2M4N6P8Q0R2S4T6",
  "agent_name": "secops-triage-orchestrator-prod",
  "tenant_id": "tnt_01J9X7K2M8P4Q6R9",
  "environment": "production",
  "orchestrator_type": "langgraph",
  "status": "ACTIVE",
  "sponsor": {
    "identity_id": "usr_01H8Z4W9X2K7M3N5P8",
    "mfa_verified": true,
    "attestation_timestamp": "2026-11-27T18:30:12Z"
  },
  "rbac_policies": [
    "urn:aegis:policy:directory-audit-reader",
    "urn:aegis:policy:scim-queue-inspector"
  ],
  "allowed_mcp_tools": [
    "mcp.jumpcloud.directory.read_users",
    "mcp.siem.alerts.acknowledge"
  ],
  "credentials": {
    "client_id": "cid_agt_01J9Y2M4N6P8Q0R2S4T6",
    "bootstrap_client_secret": "aeg_sec_7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c",
    "token_ttl_seconds": 900,
    "mtls_bound": true
  },
  "oauth2_token_endpoint": "https://auth.aegisiam.dev/oauth2/agent-token",
  "created_at": "2026-11-27T18:30:12Z"
}
```

:::danger[Store `bootstrap_client_secret` Immediately]
The `credentials.bootstrap_client_secret` value is displayed **only once** in the `201 Created` response. Store it directly in your secrets manager (HashiCorp Vault, AWS Secrets Manager, or Kubernetes External Secrets). If lost, rotate the credential via `POST /v1/agents/identities/{agent_identity_id}/rotate-secret`.
:::

---

## 6. Error Reference & Troubleshooting

| HTTP Status | Error Code | Root Cause | Resolution Action |
| :--- | :--- | :--- | :--- |
| `400 Bad Request` | `ERR_SCHEMA_VALIDATION` | Request body violates JSON Schema constraints (for example, `token_ttl_seconds` exceeds `3600`). | Validate the payload locally against [`/schemas/agent-identity.schema.json`](/schemas/agent-identity.schema.json) before submission. |
| `401 Unauthorized` | `ERR_INVALID_BEARER_TOKEN` | Missing, malformed, or expired API bearer token. | Issue a fresh API token with `iam:agents:write` scope in the AegisIAM Admin Console. |
| `403 Forbidden` | `ERR_WILDCARD_POLICY_DENIED` | `rbac_policies` includes a prohibited wildcard or super-admin URN. | Replace wildcard policies with granular, least-privilege policy URNs. |
| `409 Conflict` | `ERR_AGENT_NAME_EXISTS` | An agent identity with the same `agent_name` already exists in the target tenant. | Supply a unique `agent_name` or pass the original `Idempotency-Key` if retrying a timed-out call. |
| `422 Unprocessable Entity` | `ERR_SPONSOR_MFA_REQUIRED` | `sponsor_identity_id` belongs to a suspended user or an account without active MFA enrollment. | Verify the human sponsor's directory status and enforce FIDO2/TOTP MFA enrollment. |
| `429 Too Many Requests` | `ERR_RATE_LIMIT_EXCEEDED` | Tenant exceeded 60 agent provisioning requests per minute. | Honor the `Retry-After` response header (in seconds) using exponential backoff with jitter. |
