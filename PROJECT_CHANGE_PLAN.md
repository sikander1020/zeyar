# ZAYBAASH Change Roadmap (April 2026)

This plan turns the current codebase review into an implementation sequence with low regression risk.

## Goals

1. Preserve checkout reliability while adding business changes.
2. Eliminate known data integrity drift (ratings/counts/inventory side effects).
3. Improve production readiness (rate limiting, session handling, auditability).
4. Keep releases small and reversible.

## Working Rules

- Ship in small PR-sized slices.
- Add tests or verification scripts for each phase.
- Avoid mixing schema changes with major UI redesign in one release.
- Feature-flag risky behavior changes where possible.

## Phase 0: Safety Net (Start Here)

### Scope

- Add structured request logging and stable error shapes on critical API routes.
- Add endpoint-level smoke checks for core commerce flows.

### Files

- `src/app/api/orders/route.ts`
- `src/app/api/coupons/validate/route.ts`
- `src/app/api/bank-proof/route.ts`
- `src/app/api/reviews/route.ts`

### Acceptance Criteria

- Error responses are consistent (`{ error: string, code?: string }`) on all 4 routes.
- No behavior regressions in manual checkout flow.
- Health check still passes.

---

## Phase 1: Data Integrity and Business Rule Corrections

### 1.1 Review Aggregates Sync (High Priority)

### Problem

`Product.rating` and `Product.reviewCount` can drift from approved reviews.

### Implementation

- Create a shared helper to recompute aggregates by `productId`.
- Invoke after review create/update/delete in admin/public review routes where approval state changes.

### Files

- `src/lib/reviewAggregates.ts` (new)
- `src/app/api/reviews/route.ts`
- `src/app/api/admin/reviews/route.ts`
- `src/app/api/admin/reviews/[id]/route.ts`

### Acceptance Criteria

- Approving/rejecting/deleting a review updates product aggregate values immediately.
- Products with no approved reviews fall back to rating `0` and reviewCount `0` (or agreed fallback).

### 1.2 Coupon Applicability Clarification

### Problem

Current logic applies coupon when any item matches current rule combination. This may not match business policy.

### Decision Needed

Pick one:

- `ANY_MATCH`: at least one line item qualifies.
- `ALL_MATCH`: every line item must qualify.
- `QUALIFIED_SUBTOTAL`: discount applies only to qualifying items.

### Implementation

- Implement chosen policy in a dedicated helper and reuse in both order placement and coupon validation route.

### Files

- `src/lib/couponRules.ts` (new)
- `src/app/api/orders/route.ts`
- `src/app/api/coupons/validate/route.ts`

### Acceptance Criteria

- `/api/coupons/validate` and `/api/orders` return identical eligibility outcomes for same basket.
- Edge-case tests for mixed-category carts pass.

### 1.3 Bank Proof Audit Trail

### Problem

Reject flow clears proof fields, reducing traceability.

### Implementation

- Preserve `proofUrl` and `transactionId` when rejected.
- Add rejection metadata (`rejectionReason`, `reviewedBy?`, `reviewedAt`).

### Files

- `src/models/Order.ts`
- `src/app/api/admin/bank-proof/reject/route.ts`
- `src/app/dashboard/page.tsx` (optional reason input)

### Acceptance Criteria

- Rejected records remain auditable with original proof references.
- Existing approved flow unaffected.

---

## Phase 2: Production Hardening

### 2.1 Rate Limiting Backend

### Problem

In-memory limiter does not scale across instances.

### Implementation

- Introduce Redis-backed limiter (Upstash or equivalent) with in-memory fallback for local dev.

### Files

- `src/lib/rateLimit.ts`
- `.env.example` (new/updated)
- `README.md` (rate-limit env docs)

### Acceptance Criteria

- Shared counters across instances in production mode.
- Existing routes retain current thresholds unless explicitly changed.

### 2.2 Admin Session Expiry UX

### Implementation

- Centralize admin auth header/token access in one client utility.
- Auto-logout and redirect when token is expired/invalid.

### Files

- `src/lib/adminClient.ts` (new)
- `src/app/dashboard/page.tsx`

### Acceptance Criteria

- Expired session no longer fails silently.
- All dashboard fetches use one auth utility.

---

## Phase 3: Inventory and Order Safety

### 3.1 Pre-Submit Stock Recheck UX

### Implementation

- Add pre-place-order refresh check in checkout UI for friendly error before submit.

### Files

- `src/app/checkout/page.tsx`
- `src/app/api/products/[id]/route.ts` (reuse as needed)

### Acceptance Criteria

- User gets clear stock-change message before order transaction when possible.
- Server-side stock transaction remains source of truth.

### 3.2 Category Count Sync

### Implementation

- Recompute `Category.productCount` on product create/update/delete and bulk operations.

### Files

- `src/lib/categoryCounts.ts` (new)
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`

### Acceptance Criteria

- Admin category counts remain aligned with active products.

---

## Phase 4: Maintainability and Developer Velocity

### 4.1 API Client Consolidation

### Implementation

- Replace scattered dashboard `fetch` calls with one typed client helper.

### Files

- `src/lib/apiClient.ts` (new)
- `src/app/dashboard/page.tsx`

### Acceptance Criteria

- Reduced duplicated header/error logic.
- Easier future endpoint changes.

### 4.2 Documentation Upgrade

### Implementation

- Replace boilerplate root docs with project-specific setup, env vars, and architecture map.

### Files

- `README.md`
- `TROUBLESHOOTING.md` (align with current diagnostics)

### Acceptance Criteria

- Fresh clone can run with documented env variables and commands.

---

## Suggested Delivery Sequence

1. Phase 1.1 review aggregate sync
2. Phase 1.3 bank-proof audit trail
3. Phase 1.2 coupon policy update (after business decision)
4. Phase 2.1 rate-limit backend
5. Phase 2.2 admin session UX
6. Phase 3 inventory/category sync
7. Phase 4 refactor/docs

## Decision Checklist Before Coding Batch 1

- Coupon policy: `ANY_MATCH`, `ALL_MATCH`, or `QUALIFIED_SUBTOTAL`
- Review fallback when count=0: keep old product rating or force to `0`
- Bank rejection requires reason: `yes/no`
- Redis provider for rate limit: `Upstash` or other

## Immediate Next Implementation Batch (Recommended)

Batch A (safe, high value):

- Implement review aggregate sync helper + wire to review admin/public mutations.
- Preserve bank proof fields on rejection + add optional rejection reason.
- Add minimal route tests or scripted verification steps for these flows.
