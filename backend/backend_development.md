# Smart PG Management — Backend Development Instructions

## Purpose and scope

This is the canonical backend guide for Smart PG Management, a multi-tenant SaaS
platform for PG and hostel operations. The backend target is **Django + Django REST
Framework + PostgreSQL**, with **Celery + Redis** for asynchronous work, S3-compatible
object storage for files, and JWT access/refresh tokens for authentication.

This document is a target architecture and implementation contract. It does not imply
that every listed module or integration already exists. Build in the phase order in
`main blue print.md`; the Phase 1 MVP is the priority.

The frontend currently expects versioned REST routes below `/api/v1/` and has separate
role areas for `superadmin`, `owner`, `manager`, `staff`, `student`, `parent`, and the
public owner-request flow. Preserve that API boundary when building the backend.

## Product hierarchy and non-negotiable authority rules

```text
Platform
└── Owner (tenant account)
    └── Property / PG
        ├── Manager and Staff assignments
        ├── Floors → Rooms → Beds
        └── Tenant stays → linked Parent accounts
```

- A **SuperAdmin** creates, suspends, resets, and manages Owner accounts and plans.
- An **Owner** creates properties, rooms/beds, and Manager/Staff accounts for only
  their own organization. Owners may operate more than one property.
- A **Manager** works only in explicitly assigned properties and performs delegated
  operations. They do not create owners, change platform settings, or access other
  properties.
- **Staff** receives only the task-specific permissions and property assignments the
  Owner grants.
- A **Tenant** can access only their own profile, stay, bills, requests, and activity.
- A **Parent** can access only records explicitly shared for linked tenant(s); private
  tenant data must not be exposed by default.
- SuperAdmin normally does **not** create or operate a PG/property. Owner creation is
  platform work; property creation is Owner work.

These rules are enforced by the backend on every request. Hiding a control in the
frontend is never an authorization mechanism.

## Phase priority

Build and test the foundation before advanced features.

1. Accounts, roles, JWT refresh rotation, first-login password change, audit logging.
2. Owner request → SuperAdmin review → Owner creation workflow.
3. Owner property CRUD, floors/rooms/beds, team assignments, manager scope.
4. Tenant profile/onboarding, stay/bed allocation, basic dashboards.
5. Invoices, payments, complaints, notifications, and operational reporting.
6. Only then add mess wallets, parent portal expansion, SOS, IoT, matching, and other
   advanced features.

Do not make an advanced feature a dependency of the core onboarding, property, or
tenant-lifecycle path.

## Application layout

Use Django apps grouped by business domain. Do not organize the backend by frontend
role; roles are permissions over the same domain data.

```text
backend/
  config/                         # Django settings, URL root, ASGI/WSGI, Celery setup
  core/                           # framework plumbing only; no domain business logic
    api/                          # response/error/pagination infrastructure
    auth/                         # JWT, permission base classes, request context
    db/                           # base model, transaction helpers, database settings
    events/                       # event registry and outbox dispatch infrastructure
    storage/                      # S3 adapter and upload validation infrastructure
  apps/
    accounts/                     # users, roles, sessions, password lifecycle
    platform/                     # plans, subscriptions, feature flags, platform settings
    owners/                       # owner requests and owner profiles
    properties/                   # properties, floors, rooms, beds, assignments
    tenancies/                    # tenant profiles, parents, stays, bookings, checkout
    finance/                      # invoices, payments, deposits, refunds, expenses
    operations/                   # enquiries, complaints, attendance, visitors, broadcasts
    mess/                         # menus, meal orders, wallets, ratings
    safety/                       # SOS, gate logs, police verification, emergency contacts
    documents/                    # agreements and protected documents
    notifications/                # templates, delivery requests, delivery status
  e2e/                            # black-box API tests only
```

Each app must keep its API, serializers, services, selectors, models, tasks, events,
tests, and documentation inside its own folder. Domain code must not be placed in
`core/`, `common/`, `shared/`, or a catch-all `utils/` directory.

Recommended app shape:

```text
apps/properties/
  api/
    property_urls.py
    property_views.py             # thin HTTP boundary
    property_serializers.py       # request/response validation and representation
  services/
    property_creation_service.py
    property_bed_allocation_service.py
  selectors/
    property_list_selector.py     # read/query use cases
  repositories/
    property_repository.py        # complex ORM query ownership only
  models/
    property_models.py
    room_models.py
    bed_models.py
  permissions/
    property_permissions.py
  tasks/
    property_tasks.py
  properties_backend_feature.md
  properties_forbidden.md
```

Files must be purpose-specific and use descriptive names. Split files by responsibility
rather than randomly by line count. As a practical ceiling, keep views under 180 lines,
services/selectors under 220 lines, serializers under 200 lines, and model files under
250 lines. One class or a tightly coupled small set is preferable to a 1,000-line file.

## Django/DRF implementation rules

- Use Django REST Framework `APIView`/generic views or viewsets consistently within an
  app. Views only authenticate, authorize, validate input, call one use case, and return
  a serializer response. They do not hold workflows, direct S3 calls, payment calls, or
  multi-model transaction logic.
- Use serializers for all external request validation and output shaping. Never accept
  `request.data` directly in a model constructor or `serializer.save(**request.data)`.
- Use `ModelSerializer` fields explicitly; do not use `fields = "__all__"` on public
  APIs. Read serializers and write serializers are separate whenever their contracts
  differ.
- Put mutations in named service functions/classes. Put complex read composition,
  annotations, and permission-scoped filtering in selectors. Repositories are optional
  and only own reusable complex ORM access—not trivial `.get()` calls.
- All service, selector, repository, and task functions require explicit type hints and
  return types. `Any`, `# type: ignore`, bare `except:`, and silent exception handling
  are forbidden.
- Use absolute imports rooted at the Django project package. Do not use deep `../../`
  relative imports.
- Never use raw `print()` or `logging` configured ad hoc. Use the project structured
  logger and attach request/correlation ID, actor ID, owner ID, property ID where safely
  applicable, and event/action name.

## Tenant and property isolation

This is the most important backend security rule.

1. Resolve the authenticated actor and active scope before fetching a resource.
2. Scope querysets in selectors/repositories, not after the object is fetched.
3. For owner-scoped resources, filter by the actor's `owner_id`.
4. For property-scoped resources, additionally filter against the actor's allowed
   property IDs.
5. For tenant/parent resources, filter by the authenticated profile and approved link.
6. Return `403 Forbidden` for a known resource outside the actor's scope; do not leak
   its details. Use `404 Not Found` only when it is absent within the caller's allowed
   scope, following a consistent resource policy.

Every tenant-owned model must carry an explicit `owner` foreign key. Every
property-scoped model must additionally carry `property`. Do not infer ownership only
through a long relation chain during authorization. Cross-owner relationships are a
data-integrity defect and must be blocked by validation and database constraints.

The minimum permission context is:

```text
actor.user_id, actor.role(s), actor.owner_id,
actor.assigned_property_ids, requested property_id/resource owner_id
```

Never trust `owner_id`, `property_id`, `user_id`, or role fields supplied by the client
as proof of scope. Derive them from the authenticated actor and the authorized parent
resource. When a permitted user selects a property, validate that the selected property
belongs to that user before it becomes request context.

## Data model conventions

- Use PostgreSQL UUID primary keys unless an existing migration establishes a different
  project convention. Foreign-key columns use `<entity>_id` names.
- Use `created_at`, `updated_at`, and `created_by` on business records. Use UTC-aware
  datetimes only (`USE_TZ = True`). Store money as integer paise, never float.
- Use `TextChoices`/`IntegerChoices` for statuses and constrained values; no unbounded
  status strings. Define valid state transitions in the service layer.
- Use `on_delete=PROTECT` for financial, audit, and historically important references;
  use soft deletion where business data must be retained. Never hard-delete invoices,
  payments, stays, audit records, or KYC documents in production flows.
- Add database `CheckConstraint`, `UniqueConstraint`, and indexes for invariants. Examples:
  active bed allocations cannot overlap; a bed belongs to a room in the same property;
  an employee-property assignment must match the employee's owner; external payment IDs
  are unique.
- Use `select_related` and `prefetch_related` deliberately. Review list endpoints for
  N+1 queries, apply indexes based on real filter/sort paths, and paginate every growing
  collection.
- Generate migrations with every model change. Do not use automatic schema syncing,
  modify applied migrations, or ship destructive migrations without an explicit data
  migration and rollback plan.

## Core business invariants

- A bed may have at most one active stay/reservation at a time. Booking, check-in,
  room change, checkout, and bed release must use `transaction.atomic()` plus row locks
  (`select_for_update`) on the affected bed/stay records.
- The tenant lifecycle is explicit: enquiry → booking (optional) → check-in → active
  stay → notice → checkout. State changes must be validated; clients cannot set an
  arbitrary status directly.
- Checkout is an orchestrated transaction: inspection, final bill, deposit adjustment,
  stay closure, and bed release either succeed coherently or leave no partial state.
- Invoice totals, payments, refunds, wallet movements, and deposit adjustments are
  immutable ledger-style records. Correct errors with reversal/credit records, never by
  mutating a settled financial record.
- Payment/webhook processing is idempotent. Store provider event IDs and an idempotency
  key before performing financial side effects. Verify webhook signatures before parsing
  or trusting payloads.
- A first-login password change is mandatory for accounts created by SuperAdmin or an
  Owner. Password reset/creation, suspension, refunds, allocation changes, and privilege
  changes always create audit events.
- Document access is role-, owner-, property-, and subject-scoped. Use short-lived
  signed download URLs; do not expose storage bucket URLs or document keys.

## API contract

All endpoints live below `/api/v1/`. Use role-facing route groups only as presentation
and permission boundaries; route handlers must call domain services rather than duplicate
business logic. Maintain frontend compatibility with:

```text
/api/v1/superadmin/...
/api/v1/owner/...
/api/v1/manager/...
/api/v1/student/...
/api/v1/parent/...
/api/v1/auth/...
```

Staff endpoints currently include shared operational paths such as `/api/v1/food-menu`,
`/api/v1/stock`, `/api/v1/stock-requests`, and `/api/v1/usage-logs`. Before adding new
routes, centralize their final naming and document it in the corresponding frontend URL
configuration file and OpenAPI schema in the same change.

Use a single response envelope:

```json
{
  "success": true,
  "message": "Owner account created.",
  "data": {},
  "meta": { "request_id": "..." }
}
```

For paginated lists, use `data` for the items and a stable `meta.pagination` shape:

```json
{
  "page": 1,
  "page_size": 25,
  "total_items": 125,
  "total_pages": 5
}
```

Error responses have the same envelope with `success: false`, a user-safe `message`, a
stable machine-readable `code`, field-level validation details where relevant, and a
request ID. Never return tracebacks, token data, raw provider errors, SQL errors, or
internal stack details.

Use `http.HTTPStatus` or DRF `status` constants—never numeric status literals. Version
breaking changes through a new API version. Document every endpoint, request/response
serializer, authentication scheme, and error response with drf-spectacular/OpenAPI.

## Query, pagination, and time rules

- List endpoints support bounded page/page-size pagination, documented filters, and an
  allowlist of sort fields. Cap page size to protect the database.
- Filtering and authorization happen server-side. Never return an unbounded dataset for
  frontend filtering.
- Accept and return ISO 8601 UTC timestamps. Render local time only in clients. Use the
  property's configured timezone only for domain calculations such as invoice schedules,
  gate late-night rules, and daily mess cutoffs; record the timezone used.
- Define reporting periods, financial cutoffs, and scheduled jobs explicitly. A task
  that runs monthly must be safe to retry and must not issue duplicate invoices.

## Authentication and authorization

- Use short-lived JWT access tokens and rotating refresh tokens. Store refresh-token
  identifiers/session state so logout, password reset, suspension, and suspected theft
  can revoke sessions.
- Hash passwords using Django's supported password hasher. Never log passwords, OTPs,
  tokens, Aadhaar numbers, payment data, or raw document content.
- Use DRF permission classes plus domain object/scope checks. Role checks alone are
  insufficient for Owner, Manager, Staff, Tenant, and Parent requests.
- Rate-limit login, OTP, password-reset, owner-request, payment, SOS, and upload routes.
  Account lockout/step-up verification must be auditable and configurable.
- Only allow fields that are explicitly writable in serializers. Ownership, role,
  financial status, and approval fields are server-controlled.

## External adapters, files, and async tasks

- Integrate Razorpay/Cashfree, S3, SMS/WhatsApp, email, Firebase, maps, and future IoT
  providers through dedicated adapters. Services call a provider-neutral interface; SDK
  calls never live in views or core domain services.
- Uploads require content-type allowlists, file-size limits, extension/content inspection,
  malware scanning policy, randomized object keys, and authorization before issuing a
  signed upload/download URL. Store metadata and audit access.
- HTTP requests must have explicit connect/read timeouts, retry only safe operations,
  and use a circuit-breaker/failure policy for non-critical downstream dependencies.
- Send email, push, SMS/WhatsApp, PDF generation, invoice runs, reminders, image
  processing, and provider retries through Celery. HTTP requests must not wait for them.
- Use Celery Beat or a production scheduler for scheduled tasks—never in-process timers.
  Workers must be idempotent, record failures, retry with bounded exponential backoff,
  and use a dead-letter/review path for permanently failed work.
- Publish domain events only after the database transaction commits. For financial or
  safety-critical events, use an outbox record so an event is not lost between database
  commit and task dispatch.

## Security, privacy, and observability

- Configure CORS to known frontend origins, secure cookies where applicable, trusted
  hosts, HTTPS, security headers, request body limits, and production-safe Django
  settings. Do not enable debug in production.
- Validate and sanitize untrusted text before using it in rendered, exported, or
  notification content. Protect against mass assignment, object-reference attacks,
  SSRF through URL fields, and unsafe file parsing.
- Aadhaar/KYC, agreements, emergency contacts, attendance/location, and parent-linked
  data are sensitive. Collect the minimum necessary, encrypt where required, restrict
  access, set retention rules, and audit reads as well as writes for sensitive documents.
- Use structured JSON logs, request/correlation IDs, metrics, and traces. Add health
  endpoints for liveness and readiness; readiness verifies required dependencies without
  exposing secrets. Provide graceful worker/web shutdown.
- Read configuration through typed Django settings. Validate required environment values
  on startup. `.env` is local development convenience only; production secrets come from
  managed secret storage and never enter source control.

## Testing and quality gates

- Co-locate pytest unit tests with their app code. Put black-box API/role-flow tests in
  `e2e/`; use an isolated test database and confirm it is never production-like.
- Test services, selectors, permission boundaries, serializers, tasks, and adapter
  failure behavior. Mock external providers; do not mock the database for key ORM
  invariants.
- Every new endpoint needs success, validation, unauthenticated, unauthorized,
  cross-owner, and cross-property coverage where applicable.
- Financial, allocation, checkout, and webhook tests must include duplicate/concurrent
  request cases. Test task retries and idempotency for async side effects.
- Run formatting, Ruff, mypy/pyright (when configured), Django checks, migration checks,
  pytest, OpenAPI generation/validation, dependency/security scanning, secret scanning,
  and license checks in CI. Block merges on failed critical checks.
- Dependencies require a documented reason, supported version, license/security review,
  and test coverage. Do not add packages for a small helper Django/Python already offers.

## Documentation required for every app

Each app contains `<app_name>_backend_feature.md` and `<app_name>_forbidden.md`. Update
the feature map in the same commit as code or API changes. It must let a developer safely
understand the app without reading unrelated modules.

Minimum feature-map sections:

```markdown
# Properties Backend Feature Map

## Module Purpose
Explain the business boundary, ownership scope, and invariants in at least three
specific sentences.

## Directory Structure
| File/folder | Responsibility |
|---|---|

## Feature Inventory
| Endpoint | Permission/scope | Purpose | Request serializer | Response serializer |
|---|---|---|---|---|

## Data and State Architecture
- Models and tables:
- Ownership/property scope:
- Events/tasks:
- Cache keys and TTLs:
- External adapters:

## Business Flows
Describe each non-trivial mutation, transaction/lock boundary, state transition,
event, and idempotency behavior.

## Permissions and Security
Document allowed roles, object-scope rules, sensitive fields, and audit events.

## Edge Cases / AI Warnings
List at least three concrete module-specific hazards and cite the applicable rule.

## Rule Compliance Checklist
- [ ] Tenant/property scoping
- [ ] Serializer allowlist and validation
- [ ] Transactions/locks/idempotency where required
- [ ] OpenAPI and frontend route configuration updated
- [ ] Unit and E2E permission tests present
```

`<app_name>_forbidden.md` lists non-negotiable boundaries, such as “do not allocate a
bed outside the allocation service” or “do not mutate settled payments.” It must name
the safe alternative and the reason, not contain generic warnings or placeholders.

## Definition of done

A backend change is complete only when it:

1. Preserves role, owner, property, tenant, and parent isolation.
2. Uses the approved API envelope, status constants, pagination, serializers, and
   documented OpenAPI contract.
3. Handles transaction, idempotency, audit, and async requirements appropriate to the
   operation.
4. Has migrations, indexes/constraints, and rollback/data-migration considerations for
   schema changes.
5. Includes focused tests, including authorization and failure paths.
6. Updates the app feature map, forbidden rules, frontend route/type contract when
   applicable, and operational documentation for new tasks or providers.
7. Passes the local and CI quality gates without exposing secrets or sensitive data.
