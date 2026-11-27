---
sidebar_position: 1
title: Troubleshoot SCIM 2.0 Directory Sync Failures
description: Diagnostic runbook for resolving SCIM 2.0 user provisioning errors, bearer token expiration, attribute schema mismatches, and rate-limit throttling.
---

# Troubleshoot SCIM 2.0 Directory Sync Failures

This administrative runbook provides deterministic triage and remediation procedures for **System for Cross-domain Identity Management (SCIM 2.0 / RFC 7644)** synchronization failures between upstream Identity Providers (JumpCloud, Okta, Microsoft Entra ID) and the AegisIAM Directory Plane.

---

## 1. Symptom Triage Matrix

Start by inspecting the HTTP status code and `scimType` detail returned in your Identity Provider's provisioning logs or the AegisIAM Directory Sync Audit Log (**Admin Console → Directory → SCIM 2.0 → Sync Logs**).

| HTTP Status & `scimType` | Primary Symptom | Root Cause | Jump to Remediation |
| :--- | :--- | :--- | :--- |
| `401 Unauthorized` (`invalidToken`) | All outbound user/group push events halt simultaneously. | SCIM OAuth 2.0 Bearer Token expired or was revoked during security rotation. | [2. Rotate Expired SCIM Bearer Token](#2-rotate-expired-scim-bearer-token-401-unauthorized) |
| `400 Bad Request` (`invalidSyntax` / `invalidValue`) | Specific user records fail to provision; groups sync normally. | Missing required enterprise extension attribute (`costCenter`, `manager.value`) or malformed URN namespace. | [3. Fix Attribute Schema Mapping](#3-fix-attribute-schema-mapping-collisions-400-bad-request) |
| `409 Conflict` (`uniqueness`) | Re-hired contractor or renamed user fails creation. | Existing soft-deleted or orphaned identity holds the same `userName` or `externalId`. | [3. Fix Attribute Schema Mapping](#3-fix-attribute-schema-mapping-collisions-400-bad-request) |
| `429 Too Many Requests` (`tooMany`) | Bulk group assignments or full directory imports stall mid-run. | Upstream IdP exceeds 250 SCIM write operations per 10-second sliding window. | [4. Tune Batch Throttling & Concurrency](#4-tune-batch-throttling--concurrency-429-too-many-requests) |

---

## 2. Rotate Expired SCIM Bearer Token (`401 Unauthorized`)

AegisIAM SCIM 2.0 integration tokens enforce a maximum lifetime of **365 days** (or **90 days** under high-assurance FedRAMP/SOC2 policies). When a token expires, the SCIM endpoint returns:

```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:Error"],
  "status": "401",
  "scimType": "invalidToken",
  "detail": "SCIM bearer token tok_scim_01H9K... expired at 2026-11-27T00:00:00Z."
}
```

### Zero-Downtime Token Rotation Procedure

1. Navigate to **AegisIAM Admin Console → Directory Integrations → SCIM 2.0 Connectors** and select your active IdP connector.
2. Click **Generate Secondary Token** to mint a new bearer token while keeping the primary token active for a **24-hour grace window** (if rotating prior to hard expiration).
3. Copy the newly generated token (`aeg_scim_live_...`).
4. In your upstream Identity Provider (for example, **JumpCloud Admin Portal → SSO / Provisioning → Identity Management Configuration**):
   - Paste the new token into the **OAuth Bearer Token** field.
   - Click **Test Connection** to verify a `200 OK` response from `GET /scim/v2/ServiceProviderConfig`.
   - Click **Save** to commit the credential update.
5. Return to the AegisIAM Admin Console and click **Revoke Legacy Token** once upstream traffic shifts to the new token ID.

---

## 3. Fix Attribute Schema Mapping Collisions (`400 Bad Request`)

When provisioning human sponsors who oversee autonomous AI agents, AegisIAM requires the enterprise agent-governance SCIM schema extension (`urn:ietf:params:scim:schemas:extension:aegis:2.0:User`).

If an upstream user profile omits `department` or passes a string instead of a boolean for `agentSponsorEligible`, the SCIM endpoint returns `400 Bad Request`.

### Required SCIM 2.0 Attribute Mapping Table

Verify that your upstream IdP attribute mappings match the following target paths and data types:

| AegisIAM Target Attribute | SCIM Schema Namespace | Data Type | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `userName` | `urn:ietf:params:scim:schemas:core:2.0:User` | `string` (Email) | **Yes** | `"priya.sharma@example.com"` |
| `externalId` | `urn:ietf:params:scim:schemas:core:2.0:User` | `string` | **Yes** | `"jc_usr_99481a2b3c4d"` |
| `active` | `urn:ietf:params:scim:schemas:core:2.0:User` | `boolean` | **Yes** | `true` |
| `department` | `urn:ietf:params:scim:schemas:extension:enterprise:2.0:User` | `string` | **Yes** | `"Platform Security"` |
| `agentSponsorEligible` | `urn:ietf:params:scim:schemas:extension:aegis:2.0:User` | `boolean` | No | `true` |

### Validate Payload via Compliant `PATCH` Request

Before re-running a failed directory sync job, test the attribute payload directly against the SCIM `/Users/{id}` endpoint:

```bash
curl --request PATCH "https://api.aegisiam.dev/scim/v2/Users/usr_01H8Z4W9X2K7M3N5P8" \
  --header "Authorization: Bearer aeg_scim_live_4f5e6d7c8b9a0f1e2d3c4b5a" \
  --header "Content-Type: application/scim+json" \
  --data '{
    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    "Operations": [
      {
        "op": "replace",
        "path": "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department",
        "value": "Platform Security"
      },
      {
        "op": "replace",
        "path": "urn:ietf:params:scim:schemas:extension:aegis:2.0:User:agentSponsorEligible",
        "value": true
      }
    ]
  }'
```

---

## 4. Tune Batch Throttling & Concurrency (`429 Too Many Requests`)

During initial directory onboarding or large organizational restructures, your IdP may burst above the default **250 requests per 10-second window**.

To prevent queue starvation and HTTP `429` drops:

1. **Use SCIM `/Bulk` Operations (`POST /scim/v2/Bulk`):** Consolidate up to **50 user or group mutations** into a single HTTP payload (`maxOperations: 50`, `maxPayloadSize: 1048576` bytes).
2. **Use `PATCH` for Group Memberships:** Never send full `PUT /scim/v2/Groups/{id}` replacements for groups exceeding 500 members. Configure your IdP connector to emit incremental `PATCH` `add`/`remove` member operations.
3. **Configure Worker Concurrency:** Cap IdP outbound SCIM provisioning threads at **4 concurrent workers** with an initial retry delay of **2,000 ms** (`Retry-After` header compliant).

---

## 5. Verify Queue Recovery with the `aegis-cli` Tool

After rotating a token or fixing a schema mapping, use the `aegis-cli` administration utility to inspect dead-letter SCIM events and replay quarantined records:

```bash
# 1. Inspect current SCIM connector health and dead-letter queue depth
aegis-cli scim status --connector-id conn_jumpcloud_prod_01

# Expected output:
# CONNECTOR_ID            STATE    LAST_SYNC_UTC         DLQ_COUNT  RATE_LIMIT_REMAINING
# conn_jumpcloud_prod_01  HEALTHY  2026-11-27T18:42:10Z  3          244/250

# 2. Replay the 3 quarantined dead-letter events after fixing attribute mappings
aegis-cli scim dlq-replay --connector-id conn_jumpcloud_prod_01 --verify-schema

# Expected output:
# [OK] Replayed event evt_99102a (userName: priya.sharma@example.com) -> HTTP 200 OK
# [OK] Replayed event evt_99102b (userName: arjun.mehta@example.com)  -> HTTP 200 OK
# [OK] Replayed event evt_99102c (userName: elena.rostova@example.com)-> HTTP 200 OK
# Dead-letter queue depth: 0
```
