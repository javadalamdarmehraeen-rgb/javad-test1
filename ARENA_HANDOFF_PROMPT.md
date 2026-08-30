# ARENA AI MASTER HANDOFF PROMPT
# Namayande Elmi

YOU ARE NOW TAKING OVER AN EXISTING SOFTWARE PROJECT.

THIS IS NOT A NEW PROJECT.

THIS IS NOT A REQUEST TO REBUILD THE APPLICATION.

THIS IS A HANDOFF FROM A PREVIOUS AI DEVELOPMENT SESSION.

Your first responsibility is to UNDERSTAND and PRESERVE the existing system.

Your second responsibility is to continue development safely.

Your third responsibility is to make only the changes explicitly requested
by the user.

============================================================
1. PROJECT
============================================================

Project name:

Namayande Elmi

GitHub repository:

https://github.com/javadalamdarmehraeen-rgb/namayandeelmi-javad

Production application:

https://namayandeelmi-javad.onrender.com

Primary branch:

main

============================================================
2. CRITICAL INSTRUCTION
============================================================

DO NOT MODIFY CODE YET.

DO NOT DELETE FILES.

DO NOT REFACTOR.

DO NOT "IMPROVE" ARCHITECTURE.

DO NOT REBUILD ANYTHING.

DO NOT CREATE A NEW IMPLEMENTATION.

DO NOT ASSUME THAT OLD CODE IS OBSOLETE.

DO NOT ASSUME THAT THE NEWEST FILE IS THE ONLY ACTIVE FILE.

DO NOT CHANGE DATABASE STRUCTURE.

DO NOT CHANGE AUTHENTICATION.

DO NOT CHANGE SYNCHRONIZATION.

DO NOT CHANGE DEPLOYMENT.

DO NOT CHANGE MOBILE AUTHENTICATION.

DO NOT CHANGE PWA/OFFLINE SYSTEM.

DO NOT CHANGE CRM CORE.

DO NOT CHANGE MANUAL DESIGNER.

UNTIL YOU COMPLETE THE INITIAL AUDIT.

============================================================
3. YOUR FIRST JOB
============================================================

Your first job is:

RECONSTRUCT THE CURRENT PROJECT CONTEXT.

You must use the actual GitHub repository as the implementation source
of truth.

You must NOT rely only on filenames.

You must inspect actual source code, imports, references, configuration,
Git history and documentation.

============================================================
4. REQUIRED MEMORY FILES
============================================================

The repository contains project-memory files.

Read ALL of them before making any implementation decision:

1. AI_PROJECT_CONTEXT.md

2. AI_ARCHITECTURE.md

3. AI_DECISION_LOG.md

4. AI_RULES.md

5. AI_TASKS.md

6. ARENA_HANDOFF_PROMPT.md

These files are complementary.

Do not treat one file as the complete truth.

============================================================
5. SOURCE OF TRUTH PRIORITY
============================================================

Use this priority:

1. Current source code
2. Database schema and migrations
3. Current configuration
4. Current Git history
5. Existing project documentation
6. AI_PROJECT_CONTEXT.md
7. AI_ARCHITECTURE.md
8. AI_DECISION_LOG.md
9. AI_RULES.md
10. AI_TASKS.md
11. Inference

If documentation conflicts with source code:

SOURCE CODE WINS.

If historical reasoning is unknown:

SAY UNKNOWN.

Never invent historical reasoning.

============================================================
6. INITIAL AUDIT
============================================================

Before changing anything, inspect:

Repository root.

Then:

src/
public/
mobile/
scripts/
.github/
configuration files
package.json
render.yaml
server.js
database files
migration files
README files
change logs
AI memory files

============================================================
7. GIT AUDIT
============================================================

Inspect:

git status

git log --oneline --decorate -30

git branch -a

git remote -v

Inspect recent commits relevant to the current subsystem.

Do not assume commit messages completely explain the implementation.

Use Git history to understand evolution.

============================================================
8. CURRENT GIT STATE
============================================================

Determine:

- current branch
- current HEAD
- latest commit
- whether working tree is clean
- whether uncommitted changes exist
- whether there are unexpected files
- whether local changes differ from GitHub

Report this before implementation.

============================================================
9. ARCHITECTURE AUDIT
============================================================

Determine the actual architecture.

At minimum inspect:

Frontend:
Next.js
React
App Router
components
pages/routes

Backend:
API routes
server logic
server.js
libraries

Database:
PostgreSQL
Drizzle
schema
migrations

PWA:
service worker
cache
IndexedDB
offline routes

Mobile:
mobile/
React Native
authentication

Synchronization:
Render
NdcoHub
pull
push
sync
conflict resolution

Deployment:
GitHub
GitLab
Render
environment configuration

============================================================
10. CRM AUDIT
============================================================

The CRM is a major subsystem.

Do not assume the current CRM architecture from filenames.

Inspect:

- crm-app.js
- crm feature files
- versioned CRM files
- imports
- script loading
- references
- forms
- lists
- fields
- widgets
- boxes
- tabs
- manual designer

Determine which files are actually active.

============================================================
11. VERSIONED CRM FILES
============================================================

The repository contains versioned CRM files.

Examples may include:

crm-features-v9.js
crm-features-v10.js
crm-features-v11.js
crm-features-v12.js
crm-features-v13.js
crm-features-v14.js
crm-features-v15.js
crm-features-v16.js
crm-features-v17.js
crm-features-v18.js

DO NOT DELETE THEM.

DO NOT MERGE THEM.

DO NOT ASSUME THEY ARE UNUSED.

Determine actual runtime usage first.

============================================================
12. CRM CORE SAFETY
============================================================

crm-app.js is HIGH RISK.

Before changing it:

Inspect:

- imports
- global functions
- dependencies
- script order
- event handlers
- initialization
- navigation
- form/list behavior

Git history shows that crm-app.js has previously caused a syntax-related
break affecting main tabs.

Therefore:

DO NOT REWRITE crm-app.js.

Prefer the smallest possible change.

============================================================
13. MANUAL DESIGNER
============================================================

The Manual Designer is HIGH RISK.

It contains functionality related to:

- fields
- field order
- field width
- form/list visibility
- row/stack layout
- tabs
- widgets
- boxes
- searchable selects
- required fields
- locking
- selective copy

Do not replace the Manual Designer.

Do not redesign it.

Do not simplify it.

Understand it first.

============================================================
14. DATABASE SAFETY
============================================================

Database changes require special care.

Inspect:

src/db/schema.ts

and:

migrations

before modifying database-related code.

Before any database change:

- find all table references
- find API consumers
- find UI consumers
- inspect migrations
- inspect synchronization
- consider existing data

Never perform destructive SQL without explicit approval.

============================================================
15. AUTHENTICATION SAFETY
============================================================

Authentication is a security boundary.

Do not modify:

- password logic
- OTP
- session handling
- mobile login
- HMAC
- device authentication

unless explicitly requested.

Never expose:

passwords
tokens
API keys
secrets
database credentials

============================================================
16. MOBILE AUTHENTICATION
============================================================

Mobile authentication is HIGH RISK.

Inspect both:

mobile/

and:

src/

before modifying mobile authentication.

The repository documents nonce/timestamp/device/phone/SIM-related
authentication and HMAC-SHA256.

Do not weaken or bypass security checks.

============================================================
17. SYNCHRONIZATION
============================================================

Synchronization is HIGH RISK.

Inspect:

uid
updated_at
origin

and:

pull
push
sync
sync status
conflict resolution

before changing anything.

Do not change conflict behavior without explaining:

- current behavior
- proposed behavior
- data-loss risk
- rollback

============================================================
18. PWA / OFFLINE
============================================================

PWA and offline functionality is HIGH RISK.

Inspect:

- service worker
- IndexedDB
- cache
- offline route
- background sync
- online/offline handling

Do not disable PWA functionality to solve unrelated problems.

============================================================
19. DEPLOYMENT
============================================================

Do not change deployment configuration unless required.

Inspect:

package.json
render.yaml
server.js
.github/workflows/
.gitlab-ci.yml

before deployment changes.

Determine the actual deployment flow.

============================================================
20. PRODUCTION
============================================================

Production:

https://namayandeelmi-javad.onrender.com

You may inspect production for verification.

Do not modify production data.

Do not run destructive operations.

Do not change production configuration without explicit authorization.

============================================================
21. IMPORTANT DISTINCTION
============================================================

You must distinguish:

VERIFIED FACT

from:

INFERENCE

from:

UNKNOWN

Example:

[VERIFIED]
A Git commit changed a particular file.

[INFERRED]
The change appears related to a specific subsystem.

[UNKNOWN]
The original user request that caused the change.

Never turn INFERENCE into VERIFIED FACT.

============================================================
22. NO FABRICATION
============================================================

If the historical chat is unavailable:

DO NOT PRETEND YOU REMEMBER IT.

Say:

"The original conversation is not available. I can reconstruct this part
from Git/source/documentation, but the original reasoning is UNKNOWN."

============================================================
23. NO IMMEDIATE CODING
============================================================

After reading the repository, DO NOT start coding.

First produce:

PROJECT UNDERSTANDING REPORT

============================================================
24. PROJECT UNDERSTANDING REPORT
============================================================

Your first response after completing the audit must contain:

# PROJECT UNDERSTANDING REPORT

## 1. Project purpose

Explain what the application currently does.

## 2. Current architecture

Explain:

frontend
backend
database
PWA
mobile
sync
deployment

## 3. Current CRM architecture

Explain:

CRM core
feature modules
forms
lists
manual designer
widgets
boxes
tabs

## 4. Database architecture

Explain:

schema location
ORM
migration system
major data areas

## 5. Authentication

Explain current authentication architecture.

## 6. Mobile

Explain current mobile architecture.

## 7. Synchronization

Explain:

Render
NdcoHub
pull
push
conflict resolution

## 8. Deployment

Explain:

GitHub
GitLab
Render

## 9. Important files

List high-impact files.

## 10. High-risk subsystems

List them.

## 11. Recent Git history

Summarize the relevant recent commits.

## 12. Current Git state

Report:

branch
HEAD
working tree
recent commit

## 13. Production state

If accessible, report what was verified.

## 14. Unknowns

List anything that could not be verified.

============================================================
25. DO NOT CLAIM SUCCESS
============================================================

Do not say:

"Everything is understood."

unless you can actually demonstrate the evidence.

Instead say:

"Current understanding is..."

and list remaining uncertainties.

============================================================
26. AFTER THE REPORT
============================================================

STOP.

Wait for the user's actual task.

Do not modify code.

Do not commit.

Do not push.

Do not delete anything.

============================================================
27. WHEN USER PROVIDES A TASK
============================================================

For every new task:

STEP 1
Understand the request.

STEP 2
Identify affected subsystem.

STEP 3
Inspect relevant files.

STEP 4
Inspect Git history.

STEP 5
Determine dependencies.

STEP 6
Prepare a minimal implementation plan.

STEP 7
Explain risk.

STEP 8
Implement only the required change.

STEP 9
Test.

STEP 10
Inspect git diff.

STEP 11
Inspect git status.

STEP 12
Report exactly what changed.

============================================================
28. NO UNRELATED CHANGES
============================================================

If the user asks:

"Fix X"

you may modify only what is necessary for X.

Do not also:

- redesign UI
- refactor database
- update dependencies
- change authentication
- change deployment
- clean old files
- change unrelated CSS
- rewrite architecture

unless explicitly required.

============================================================
29. MINIMAL CHANGE PRINCIPLE
============================================================

Preferred:

READ
→ UNDERSTAND
→ PLAN
→ MINIMAL CHANGE
→ TEST
→ VERIFY

Never:

GUESS
→ REWRITE
→ DELETE
→ HOPE

============================================================
30. BEFORE DATABASE CHANGES
============================================================

STOP.

Explain:

Current schema
Affected tables
Affected APIs
Affected UI
Migration plan
Data risks
Rollback

Then proceed only if safe and authorized.

============================================================
31. BEFORE ARCHITECTURAL CHANGES
============================================================

STOP.

Explain:

Current architecture
Problem
Why current architecture cannot satisfy the requirement
Alternative approaches
Recommended approach
Affected files
Risks
Rollback

Architectural redesign requires user approval.

============================================================
32. BEFORE FILE DELETION
============================================================

STOP.

Search:

imports
references
script tags
API references
Git history
deployment references

Then explain why deletion is safe.

If uncertain:

DO NOT DELETE.

============================================================
33. BEFORE LARGE REFACTOR
============================================================

STOP.

Prepare an impact report.

Do not perform a large refactor as part of a small feature request.

============================================================
34. GIT SAFETY
============================================================

Before changes:

git status

After changes:

git diff

Then:

git status

Do not use:

git reset --hard

git clean -fd

or destructive commands

without explicit authorization.

============================================================
35. TESTING
============================================================

Do not claim:

"FIXED"

until the affected behavior is verified.

Depending on the task, run:

build
tests
browser test
API test
mobile test
production smoke test

============================================================
36. FINAL IMPLEMENTATION REPORT
============================================================

After implementation provide:

# IMPLEMENTATION REPORT

## Requested task

...

## What I changed

...

## Files changed

...

## Why these files were changed

...

## What I intentionally did NOT change

...

## Tests performed

...

## Git diff reviewed

YES / NO

## Git status reviewed

YES / NO

## Production verified

YES / NO / NOT REQUIRED

## Remaining risks

...

## Remaining unknowns

...

============================================================
37. COMMIT / PUSH
============================================================

Do NOT automatically push.

The user may manage Git manually.

If the user asks to prepare the changes for GitHub, the expected workflow is:

git add -A
git status
git commit -m "..."
git push origin main

Before these commands:

verify that only intended changes are present.

============================================================
38. MOST IMPORTANT RULE
============================================================

THIS PROJECT ALREADY WORKS.

Your job is NOT to prove that you can write a new application.

Your job is to PRESERVE the existing working system while making the
requested improvement.

============================================================
39. SECOND MOST IMPORTANT RULE
============================================================

WHEN YOU DO NOT KNOW:

INSPECT.

WHEN YOU CANNOT VERIFY:

SAY UNKNOWN.

WHEN THE CHANGE IS HIGH RISK:

STOP AND EXPLAIN.

WHEN THE REQUEST IS CLEAR AND LOW RISK:

MAKE THE SMALLEST SAFE CHANGE.

============================================================
40. FINAL INSTRUCTION
============================================================

START NOW.

DO NOT MODIFY CODE.

READ THE PROJECT MEMORY FILES.

INSPECT THE GITHUB REPOSITORY.

INSPECT THE CURRENT GIT HISTORY.

INSPECT THE ARCHITECTURE.

INSPECT THE CURRENT SOURCE STRUCTURE.

INSPECT PRODUCTION ONLY FOR VERIFICATION.

THEN PRODUCE:

PROJECT UNDERSTANDING REPORT

AND WAIT.

============================================================
LATEST STATE ADDENDUM (2026-08-16 — v11.15.3)
============================================================

- App version: 11.15.3. Screens unchanged since 11.15.2; 11.15.3 is a
  repo/tooling release only.
- Runtime is zero-dependency (Node built-ins only); node_modules is
  deletable and gitignored; package-lock.json is dependency-free.
- Secrets: no real .env ever entered git; .gitignore hardened; template
  .env.ndcohub.example sanitized. Permanent rule: AI_RULES #65.
- Sync: user runs SYNC_ALL.bat (Windows) / sync_all.sh (Linux/Mac) → one
  command pulls then pushes to GitHub AND GitLab (gitlab remote setup in
  RAHNAMA_GITLAB.txt). .gitattributes keeps files cross-system safe.
- Memory is regenerated via `python update_chat_arena.py` after every chat;
  chat.arena v1.7 includes all turns 1-12 and full file contents.
- OFFICIAL_FILELIST.txt is the cleanup whitelist (239 entries) — register
  every new repo file there immediately.
- Permanent delivery rules: AI_RULES #62 (permissions mirror), #63
  (chat.arena append-only), #64 (fresh versioned ZIP every completed
  request), #65 (git hygiene + dual-remote sync).

============================================================
ADDENDUM v11.16.0 (2026-08-16)
============================================================

- READ FIRST: PROJECT_GRAPH.md — the auto-generated knowledge graph
  (files/functions/window-overrides/API map/storage map/tab map). Rule #66:
  regenerate with update_project_graph.py before every chat.arena build.
- New last script layer: public/crm-features-v20.js (index.html loads 17
  scripts; v20 wins all overrides). Contains: combo manager, grey chains,
  order lock, v20DupGate (exact-dup block wired into v9 + both crm-app.js
  generations), field mirror pharmacy→orders, presets, change-password FAB.
- window.state getter now exists (v20) — diagnostics depend on it.
- New state keys: selectExtraOptions (pre-existing), v20Renames,
  v20HiddenOptions, v20GreyMap, settings.v20GreyOn, settings.v20OrderLock.
- Git delivery instructions must target GitHub AND GitLab (rule #67).
- chat.arena v1.9 (turn 14 appended); permanent rules now #62-#67.

============================================================
ADDENDUM v11.16.1 (2026-08-16)
============================================================

- Remote incident: GitHub main was replaced by one manual commit
  "پروژه اولیه" (11.15.3 content). Repair tool: PUSH_FRESH_GITHUB.bat
  (merge --allow-unrelated-histories -X ours, then push). Rule: if the
  user says "GitHub didn't update", FIRST fetch and inspect origin/main.
- GitLab tokens are disabled on his account → RAHNAMA_GITLAB.txt now has
  a token-free SSH path; SYNC_ALL skips gitlab gracefully until then.

# END OF ARENA AI MASTER HANDOFF PROMPT
## Addendum — v11.17.0
- Never re-enable `mirrorPharmacyOrderToOrders`: it is intentionally a no-op to preserve field identity/layout across releases.
- v20 owns local order match/autofill, entity cascade manager, share-field lock, visit GPS/metrics/routes, route search/export and version badge.
- v9 visiblePharmacies/Doctors/Orders return reversed copies (newest first).
- GitHub workflow is pure Node/zero-dependency; do not restore Next commands.

## Addendum — v11.17.1
- Never restore `|| 1` in order quantity collection. New orders set `quantityValidated: true`; old obvious bug-pattern rows are cleaned only for sharing.
- Share fields are dynamic (`dynamicShareFields`), not a hardcoded visible subset.
- Entity manager must remain search-only (2 chars, max 50); never render 10k names.
- Legacy direct children of addTabPanel stay hidden; v20 manager owns full width and filters IDs by entity prefix/custom ownership.
- Product layout persistence is reinforced in v20; orderDate is always exempt from grey lock.

## Addendum — v11.18.0
- Never store the credential pasted in turn 19; it was intentionally redacted. Tell user to rotate it.
- Do not automate CAPTCHA. Full daily automation requires an official Snapp API.
- Snapp import supports CSV/text XLS and modern XLSX; test against the user's real pair before claiming browser verification.
- Selected source columns are zero-based [0,1,4,8,11,14,17,18,23]; import dedupes paired formats.
- Excel wrapper now downloads only XLS (do not restore orig CSV call).

## Addendum — v11.19.0
- Never restore Snapp delete UI/permission. Both rows and topups are archival and included in full-state backups.
- New imports must stay `fresh.concat(old)` and deduped.
- Share items format is `name = تعداد کالا: N / تعداد جایزه: G`; order date output is DD/MM/YYYY.
- Real user spreadsheet was not attached to workspace and production /api/state returned empty; do not claim exact real-file verification until browser feedback/sample arrives.

## Addendum — v11.20.0
- cfTargetEntity stays in DOM for compatibility but is hidden and synced from active v20 pane.
- Snapp exact schemas: trip 9 columns; topup date-time + creditor (displayed as مبلغ شارژ).
- Backup email requires RESEND_API_KEY and BACKUP_FROM_EMAIL only in Render env; never commit values. Avoid calling saveState after email success (would recurse).
- Order list uses cleanOrderItemsV9; modal details is replaced by the exact locked share text.
## Addendum — v11.20.1
- Do not make order items/totals configurable: orderFixedBlock is intentionally stable.
- Snapp date inputs must remain empty by default; year/month reports depend on that.
- Topup rows with amount <= 0 are neither newly archived nor shown.
## Addendum — v11.20.2
- Data preservation is absolute. Never replace missing arrays in an existing state with DEFAULT_INITIAL_DATA.
- Recovery candidates are scored for records/customFields/layouts/Snapp archives; richest wins.
- saveState rolling backup and v20 debounced /api/state sync must remain.
- Snapp date filters are force-blanked once against browser autofill; report buttons move to sticky v20SnappActionBar.
## Addendum — v11.20.3
- Never select only one backup again. Record arrays/custom fields must be unioned across every local snapshot and remote state.
- Richest layout objects win; remote is merged, never wholesale-replaced.
- personMatch handles Persian honorifics and partial normalized names.
## Addendum — v11.20.4
- Mobile <=768: horizontal app-nav hidden, hamburger only, forms one-column, tables internally scroll.
- Snapp temporal checkbox mode is exclusive year/month/range; range checks both From+To; month disabled until year value.
- Historical backup union is one-time (`_allSnapshotsMergedV11204`); do not resurrect manager-deleted structures later.
- Every date field gets Jalali picker/auto-slash; password/year/month are excluded.
## Addendum — v11.20.5
- Baseline settings/layout is restored once from latest snapshot lacking `_allSnapshotsMergedV11204` (the requested 11.20.3 baseline), while its records are re-merged.
- Keep mobile/filter/date features layered on top without mutating desktop structure.
## Addendum — v11.21.0
- `npm test` is mandatory and CI-blocking. Keep tests zero-dependency.
- Distributor portal automation is not claimed; URLs were absent and cross-origin/CAPTCHA make it unsafe. Credentials passwords remain session-only.
- Pharmacy imports append exact unique rows; inventory imports replace current rows.
- Final column mapping remains pending real sample files from each distributor.
## Addendum — v11.21.1
- Distributor report now has 19 columns. Daya indices are explicit; mappings for Shafaarad/Tivan/Mashateb remain regex-based pending samples.
- Database/file viewer controls live only in tab-distributor-database.
- Product CRUD final capture handlers must remain in v20.
- Snapp store dedupes existing archives with trailing-empty-insensitive rowSignature before totals.
## Addendum — v11.21.2
- Never put bulk Excel rows back in localStorage. Keep IndexedDB vault and lightweight server sync.
- Import functions MUST await saveBulkVault before save.
- Daya matching is by database column 16 to product `dayaDbCode`; formula is 1111000 + program code.
- Deleting product cascades to targets/orders/draft and removes it from canonical Daya report.
## Addendum — v11.21.3
- Absolute rule: current CRM_APP_STATE_V2 is authoritative. Do not auto-merge any old backup or remote state.
- Remote state sync is POST-only. Backups are manual recovery only.
- Empty arrays represent intentional manager deletion; never repopulate them.
- Tests explicitly reject backup reintroduction and sample default injection.
## Addendum — v11.21.4
- Last distributor date means last physical non-empty row, not max/sorted date.
- Pharmacy import remains append-only concat(fresh).
- Snapp import uses real buttons btnImportSnappTrips/Topups and robust input handlers.
- Never group product code or raw compact dates with thousands separators.
## Addendum — v11.21.5
- Syntax/HTTP tests alone missed an early-init race. Keep synchronous bindSnappImportButtons/bindProductCrudV20 and reliableFeatureBoot on load/tab click.
- Raw Snapp/distributor DB viewers are editable spreadsheets; saving must sync batch rows to master rows then await saveBulkVault.
- Product info title cells must be fixed from actual labels by fixProductInfoLabels.
## Addendum — v11.21.6
- Never assume imported/historical row is Array. Always normalizeStoredRow before map/join/indexing.
- Console regression was exact `rowSignature (r||[]).map is not a function`; unit and DOM tests now cover object/cells rows.
- Editable viewers save to batch/master rows then await IndexedDB vault.
## Addendum — v11.21.7
- Distributor dates MUST use slashOnlyPersianDate, never normSnappDate. 39694 must remain 39694; 14050819 becomes 1405/08/19.
- Desktop distributor filters are forced flex row nowrap.
## Addendum — v11.21.8
- Daya exact map is mandatory. Never use file rial columns for Daya.
- retGift percentage denominator is return-product quantity.
- Total pharmacies/invoices are global set unions, not sums of per-product counts.
- Layout engine moves fixed filters into cfHost; restoreFixedFilterGrids must return exactly 5 groups to distributorFilterGrid.
## Addendum — v11.21.9
- Inventory alignment shifts headers only, never data rows.
- Do not re-enable automatic local rolling/latest/pre-version backups; quota caused current-state loss.
- Report and all workbook sheets must follow state.products order exactly.
## Addendum — v11.22.0
- Daya inventory schema must prefer exact headers. Never use broad کالا regex before exact نام کالا; it matches کالای در راه.
- Regression fixture: row code 1112002 has quantity 6 at index2, product at index6, code at index7.
## Addendum — v11.22.1
- All visible digits must be Latin; codes/dates/phones stay ungrouped.
- SpreadsheetML percentage columns are String with `%`, not numeric.
- Sticky headers and full cell borders are global.
- List reorder must use paneId and reliable rewrap.
- Never restore fake GPS coordinates; preserve full address on click.
## Addendum — v11.22.2
- Address output must be Iran-first and postal code labeled; never replace with reversed display_name.
- DOM order lock captures beforeunload and manager edits; restore after every layout engine.
- Shafaarad inventory column10 is always recalculated as col6+col8.
- Shafaarad sales uses col8, returns col10, customer col4, invoice col6, date col7; rials derive master prices.
## Addendum — v11.22.3
- Preserve exact Shafaarad code map, notably swapped woman/man DB suffixes.
- Program table headers are gray with black text. Workbook total row red and percentages string values.
- Fixed-grid and list-order MutationObservers are required against delayed legacy renders.
- Postcode is intentionally excluded; GPS uses watchPosition best accuracy <=15m and no fake fallback.
## Addendum — v11.23.0
- Never track/package user-data.json. Render needs persistent disk for file survival.
- Permission preset UI intentionally has only level select + save-template button.
- User edits use userEditId and update existing record/auth map.
- Form/list order changes must stay atomic and must not call applyFullFormLayout.
## افزونه تحویل نسخه ۱۱.۲۴.۰
- Performance: do not restore whole-body characterData number observer or product-settings-on-every-save wrapper.
- Immediate updates use recent-user-action + active-view rendering; never globally rerender on GPS save.
- Global headers are `#87CEEB`/black in UI and Excel; frozen spacer rows stay hidden.
- Excel blank/default cells must remain borderless; only emitted cells are bordered.
- GPS rule is fixed: watch high accuracy, at least 2 samples, target <=10m, best result by 30s; Iran-first detailed address, no postcode.
## افزونه تحویل نسخه ۱۱.۲۴.۱
- Preserve corrected exact Shafa map: 1001=1391911001; 1002=1391911002; 1003=1391911003; 1004=1391911004; 1005=1391911006; 1006=1391911005; 1007=1391902006.
- Never let unmatched/blank/«نامشخص» Daya or Shafa rows become report products.
- Version badge must remain dynamic from v20 script query; do not hardcode an old number.
## افزونه تحویل نوبت ۴۴
- User requires the latest ZIP to be presented in the side file viewer in every chat.
- Every response must include copy-ready PowerShell sync commands (prefer `SYNC_ALL.bat`; also show explicit Git commands when useful).
## افزونه تحویل نسخه ۱۱.۲۵.۰
- Preserve invoice-status matching: order date ±3 inclusive, fuzzy pharmacy name plus province/city/district.
- Never show unmatched orders in this table.
- Detail rows compare order qty/gift with invoice qty/gift by canonical product.
- Keep invoiceStatusBaseCache so live search never rescans all distributor rows per keystroke.
- New permission keys begin `dist_invoice_status_` and must stay in permission UI.
## افزونه تحویل نسخه ۱۱.۲۶.۰
- Never restore per-ID-only option behavior. Same semantic label means one global option registry across DOM and custom fields.
- Deletion must persist in registry `hidden` so static markup cannot re-add it after rerender.
- New same-label dropdowns must hydrate immediately from global options.
- DOM order lock covers every tab form-grid; do not return to four-form-only lock or call full layout from pharmacy→order mirror.
- Invoice tab visibility must be reversible; missing new permission inherits existing distributor-sales permission.
- PWA must activate automatically; diagnostics must not tell users to refresh repeatedly.
## افزونه تحویل نسخه ۱۱.۲۷.۰
- Do not restore automatic layout snapshot on startup, beforeunload or broad MutationObserver. Only explicit manager actions may write manager-grid order.
- Keep synchronous manager-intent gate around legacy applyFullFormLayout; startup calls must be no-ops.
- Existing invoice permission migration is one-time; afterwards manager false must remain respected.
- Permission UI must stay exactly 28 real tab groups; never re-display historical version buckets.
- Final user create/edit/save is bindUserCrudV27/saveUserV27. Preset UI has only one level dropdown and save button.
- Gray dependency must not color label or container.
## افزونه تحویل نسخه ۱۱.۲۸.۰
- Preserve full login session writes and ID-first v20CurrentUser; this was the root of flashing/hidden tabs.
- Central permission engine is final authority for all 28 tabs and mapped subcontrols; explicit false denies, missing key allows backward compatibility, manager bypasses.
- Never read CRM_DOM_FIELD_ORDER_LOCK_V1 again. Only explicit CRM_MANAGER_GRID_ORDER_V2 may reorder.
- Gate applyFullFormLayout, applyAllFormLayouts and applyCustomFieldOrderInForm during startup.
- Restore only configured visible/nondeleted fields; intentional manager deletion remains authoritative.
- Keep dropdown/info overlay high stacking.
- GPS target remains <=10m, first qualifying fix accepted, reverse geocode parallel, timeout 15s.
## افزونه تحویل نسخه ۱۱.۲۹.۰
- Graph-first is mandatory every turn; regenerate PROJECT_GRAPH before chat.arena and update all archive docs.
- Never re-add v11 invoice-status hide; final central engine is its sole visibility authority.
- Preserve fresh V1129 one-time permission repair.
- Latin-number law must bind synchronously and cover Number/Date/DOM option/placeholder/title while never altering passwords.
- Distributor Excel month metadata must be Persian month name, not numeric month.
## افزونه تحویل نسخه ۱۱.۳۰.۰
- Never hide/remove invoice-status nav. Denial is shown inside pinned tab; keep V1130 one-time repair.
- Preserve <=950 portrait/landscape mobile rules and in-viewport form/list buttons.
- Navigation must use real directions universal URLs, never provider home/location/download pages.
- Scientific reps may only see repId/exact repName-owned records unless explicit all-reps permission; ownerless data must not leak.
- Current local state still wins. Remote GET is allowed only when the browser origin has no CRM_APP_STATE_V2 at all.
- Preserve `/api/bulk`, user-bulk-data.json gitignore/ZIP exclusion, 64MB limit, server hydrate and persistent disk directory support.
## افزونه تحویل نسخه ۱۱.۳۱.۰
- Never clear LocalStorage/IndexedDB for cache updates. Build gate may delete only CacheStorage and old service-worker registrations.
- Keep body hidden until final permissions to prevent manager-page flash.
- Preserve no-store server/SW asset path and single reload per CRM_ASSET_BUILD.
- Mobile order row/delete/clear/hamburger landscape rules are permanent.
- Android Neshan/Balad intents must retain package and destination; iOS/web universal directions remain.
- Users are the sole representative roster source. Deleted users vanish, new users appear, normal rep selectors show self only unless explicit all-reps.
- Preserve activity route fields and labels.
## افزونه تحویل نسخه ۱۱.۳۲.۰
- Preserve all security headers and never restore wildcard CORS.
- Every relative POST to CRM API must include X-CRM-Request and pass same-origin fetch metadata.
- Never write raw parsed JSON; always sanitize and atomic-write mode 0600.
- Preserve browser file/protocol/opener/drop/text guards and 32MB limit.
- Keep formula-injection neutralization and HTTPS-only distributor URL.
- Do not loosen hardware Permissions Policy except geolocation self unless user explicitly requires a capability.
- Be honest: this is defense-in-depth inside browser sandbox, not an absolute guarantee against every OS/browser vulnerability.
## افزونه تحویل نسخه ۱۱.۳۳.۰
- Never restore order product datalist/editability. Product names are readonly catalog values.
- Keep delegated total updates and explicit mobile visibility.
- Edit/delete order-row controls are manager-only and must be re-applied after dynamic row render.
- Privacy must cover activity, leave, routes, homes, monthly and targets in addition to core CRM lists.
- Preserve try/finally temporary filtering so canonical state is never mutated by rendering.
## افزونه تحویل نسخه ۱۱.۳۴.۰
- Activity route controls live only in target tab and support multiple provinces/cities/districts; do not restore them to users form.
- Target entry stays fixed-product matrix with rep/year/month header and current master prices.
- Keep all-rep product aggregate followed by per-rep achieved/remain financial cards.
- Reference instant-add is forbidden for rep/year/month/province/city/district/pharmacy-name outside manager additions.
- Keep leave form repair and rep-home edit/delete.
- After pharmacy placement, old duplicate/selection notices must stay hidden until user actually changes pharmacy name.
## افزونه تحویل نسخه ۱۱.۳۵.۰
- For every long/multipart prompt, update AI_ACCEPTANCE_CHECKLIST item-by-item and run browser-like runtime validation before ZIP.
- Canonical MENU_SECTIONS_LIST must stay aligned with all 28 static tabs; invoice-status must never be omitted during menu rebuild.
- Preserve notification permission filtering, thread reply/history and idempotent recipient sync.
- Preserve zero-dependency Web Push VAPID/aes128gcm endpoints and SW push/click. Never promise forced sound; OS settings decide audio.
- MutationObservers must never unconditionally rewrite their own observed attributes.
- Normal representative reference selects remain one fixed disabled self value.

## افزونه تحویل نسخه ۱۱.۳۶.۰
- Preserve reset-safe order layout: groupAnchor falls back to group id, reset snapshots/restores order metadata and sequence, and no startup snapshot is persisted.
- Keep placed pharmacy notices hidden with idempotent hidden/aria/display-important checks; never reintroduce an observer write loop.
- setupRepresentativeRoutes must run in boot, reliable boot and every target-tab activation.
- Builtin technical IDs such as leaveRepSelect must never appear as visible labels; Persian DOM labels override stale technical metadata.
- Activity rendering keeps canonical history but excludes removed users and is strictly self-only for every nonmanager account.

## افزونه تحویل نسخه ۱۱.۳۷.۰
- Always preserve-first: hash/read backup before code; never overwrite existing state, bulk, customFields or layout metadata.
- Fresh install is manager-only blank business state; do not restore old sample representatives.
- Preserve deletedUserTombstones enforcement and never delete canonical history merely to hide removed users.
- Order pharmacy cards and combo carets rely on final delegated handlers; keep them across rerenders.
- Route manager controls are pinned visible only for managers without mutating stored field metadata.
- Rep-home privacy must filter both table and Leaflet markers: manager all active, representative self only.
- Keep hourly leave fromTime/toTime plus legacy hours, plain notification recipient select and Persian builtin label guard.

## افزونه تحویل نسخه ۱۱.۳۸.۰
- Production is not updated by ZIP/sandbox. Report commit, branch push, PR/main merge, CI/deploy and production health separately.
- Preserve `/cache-reset`, Clear-Site-Data cache-only, server health build comparison and unique redirect.
- Never clear LocalStorage/IndexedDB/CRM data during cache rescue.
- SW navigation/code assets remain network-only fresh; only image/font fallback cache is allowed.
- Keep install/activate purge, skipWaiting/claim and CRM_BUILD_ACTIVE broadcast.

## شروع اجباری چت بعد از نوبت ۶۰
1. `PROJECT_GRAPH.md` را بخوان.
2. `GITHUB_REVIEW_HANDOFF.md` را کامل بخوان.
3. branch/commits/remotes/auth و production health را دوباره اندازه بگیر.
4. اگر GitHub reconnect شده، فقط `arena/01a006e4-namayandeelmi-javad` را push و از آن PR به main بساز.
5. source test را با deploy اشتباه نگیر؛ production در آخرین اندازه‌گیری 11.20.0 و source 11.38.0 است.
6. بعد از merge، GitHub checks، GitLab mirror، Render deploy و cache rescue را جدا تأیید کن.

## شروع اجباری چت بعد از نوبت ۶۱ (2026-08-22)
1. `PROJECT_GRAPH.md` → `GITHUB_REVIEW_HANDOFF.md` (بخش ۰ وضعیت انتشار) → `AI_ACCEPTANCE_CHECKLIST.md` → همین فایل.
2. مخزن فعال `javadalamdarmehraeen-rgb/javad-test1` و شاخه جلسه `arena/01a0262d-javad-test1` است؛ production فعال `https://javad-test1.onrender.com` که در 2026-08-21T21:24Z نسخه 11.38.0 را سرو کرد و cache-rescue زنده داشت. سرویس قدیمی namayandeelmi-javad.onrender.com هنوز 11.20.0 است و مرجع نیست.
3. قانون کاربر (نوبت ۶۱ → قانون ۹۱ AI_RULES): در هر چت همه ۱۵ فایل آرشیوی به‌روز شوند و ZIP کنار صفحه تحویل شود؛ اگر ممیزی نشان داد پرامپت معلق کدی نمانده، نسخه برنامه را بدون تغییر واقعی bump نکن.
4. push فقط وقتی 403 می‌خورد که کامیت حاوی تغییر workflow باشد؛ PR با صفر تفاوت نسبت به main ممکن نیست.
5. production /api/health تنها منبع حقیقت انتشار است؛ GitLab mirror تنها حلقه تأییدنشده است.

## شروع اجباری چت بعد از نوبت ۶۲ (2026-08-22)
1. قوانین ۶۴/۸۹/۹۱/۹۲ همگی فعال‌اند: جزبه‌جز اجرا، ورود خودکار به برنامه قبل از ZIP، ZIP کنار صفحه، بلوک دستور git پایان چت.
2. پرامپت‌های بلند تکراری کاربر: اول بند‌به‌بند راستی‌آزمایی کن (احتمال زیاد در 11.23–11.38 اعمال شده)؛ فقط شکاف واقعی را با حداقل تغییر اصلاح کن و نسخه را فقط پس از تغییر واقعی کد bump کن.
3. وضعیت تا این نوبت: production فعال javad-test1.onrender.com = 11.38.0 تأییدشده؛ main گیت‌هاب تا 5391951 + کامیت‌های آرشیوی جلسه Arena (push از جلسه بسته‌شده ممکن نیست؛ کاربر با SYNC_ALL محلی sync می‌کند)؛ GitLab mirror همچنان ناشناخته.

## شروع اجباری چت بعد از نوبت ۶۴ (2026-08-22)
1. نسخه سورس 11.38.1 است (تعویض کامل دامنه قدیمی با javad-test1.onrender.com در ۱۰ فایل کد/کانفیگ)؛ production تا push کاربر 11.38.0 می‌ماند — این تفاوت را صادقانه جدا گزارش کن.
2. دامنه قدیمی namayandeelmi-javad.onrender.com فقط در اسناد تاریخی مجاز است؛ اگر در کد/کانفیج دیده شد، خطاست.
3. اگر کاربر «تغییرات را نمی‌بیند»: اول نشان نسخه هدر و /api/health و /api/push/public-key را بگیر؛ سپس راهنمای مسیر دقیق دیدن هر تغییر (نقش مدیر/نماینده و پیش‌شرط‌ها مثل نوع مرخصی ساعتی) را بده.

## شروع اجباری چت بعد از نوبت ۶۵ (2026-08-22)
1. نسخه سورس 11.39.0: ترتیب کانونی فرم سفارشات (تاریخ اول) + مهاجرت یک‌باره CRM_V39_ORDER_CANONICAL_RESET + لینک/مخزن داینامیک (location.origin) — production تا push کاربر 11.38.0/11.38.1 می‌ماند؛ جدا گزارش کن.
2. دامنه‌ها فقط از location مشتق شوند؛ ثابت دامنه صرفاً fallback است (قانون نوبت ۶۵).
3. بندهای تکراری پرامپت بلند کاربر را با جدول شواهد نوبت‌های ۶۲/۶۵ پاس بده؛ فقط شکاف واقعی را با تغییر حداقلی اصلاح کن.
4. تغییر چیدمان/تنظیمات فقط با درخواست صریح کاربر + مهاجرت یک‌باره + تست (قوانین ۲۷/۸۷/۸۸ مبنای «چرا تنظیمات عوض نمی‌شود» است).

## شروع اجباری چت بعد از نوبت ۶۷ (2026-08-22)
1. نسخه سورس 11.40.0 (چهار موتور جدید v20: enforceRemovedIdentitiesV40، dropRemovedUserRowsV40، گیرنده نقش‌آگاه، محافظ افزودن فیلد مرجع + کلیک سه‌مسیره داروخانه)؛ تا push کاربر production عقب‌تر است.
2. در گزارش «کار نمی‌کند» اول داده واقعی کاربر را علت‌یابی کن (بکاپ قدیمی/تطابق دقیق/بازخورد)، نه فقط وجود کد؛ ادعای سند قدیمی بدون کد معتبر نیست.
3. هویت‌های حذف‌شده دائمی‌اند: جواد علمدار/نیلا محرمی + tombstoneها در هر boot اعمال می‌شوند.

## شروع اجباری چت بعد از نوبت ۸۰ (2026-08-25)
1. نسخه فعلی کد: 11.61.0 (public/crm-bundle.js = فایل اجرایی واقعی runtime؛ crm-features-v20.js آینه است). production تا push کاربر برابر آخرین دیپلوی قبلی است.
2. درس مهم این نوبت: هر تابع تغذیه‌شونده از MutationObserver که خود DOM می‌نویسد باید فقط در صورت تفاوت واقعی بنویسد؛ پنج محافظ idempotent/structural اضافه شد و تست رگرسیون آن در tests/version-11.24-regressions.test.mjs (guards v11.61.0) ثبت است؛ قبل از هر تغییر در موتورهای چیدمان، تست «جهش بیکار = ۰» را حفظ کن.
3. فیلدهای طوسی سفارشات (بند ۱۰ v11.49) و زنجیره استان→شهر→منطقه v20 رفتار طراحی‌شده‌اند؛ آن‌ها را باگ ندان و تغییر نده.

## شروع اجباری چت بعد از نوبت ۸۱ (2026-08-25)
1. نسخه فعلی کد: 11.62.0. نام داروخانه/پزشک فیلد ساده‌اند (`data-simple-name`)؛ افزودن لحظه‌ای فقط `#tab-pharmacies` و `#tab-doctors`؛ پلاک/طبقه بیرون از کادر درصد و بعد از آدرس.
2. لایه نهایی `v62simpleNames` / `v62movePlateFloor` / `v62wrapAttach` در انتهای crm-bundle را حفظ کن؛ پلاک/طبقه را دوباره داخل کادر درصد نگذار.

## شروع اجباری چت بعد از نوبت ۸۲ (2026-08-25)
نسخه 11.63.0. نام داروخانه/پزشک ساده و بدون زیرمجموعه. افزودن لحظه‌ای روی INPUT ممنوع. فرم پزشک/داروخانه گرید ۳ستونه. سفارشات روی فوکوس همه داروخانه‌های ثبت‌شده را نشان می‌دهد (v63paintOrderPharmacies).

## شروع اجباری بعد از نوبت ۸۳
نسخه 11.64.0. paintFieldBox بدون نیت مدیر اندازه نمی‌دهد. setupInstantAdd دیگر روی pharmacyName/doctorName datalist نمی‌سازد. v64paintOrderSearch جستجوی لحظه‌ای سفارشات است.

## شروع اجباری بعد از نوبت ۸۴
نسخه 11.65.0. سرور منبع واحد (mergeCrmState). سفارشات همه فیلدهای داروخانه را دارد. bootstrap همیشه GET+merge می‌کند.

## شروع اجباری بعد از نوبت ۸۵
نسخه 11.66.0. تب tab-define-routes (چک‌باکس مسیر) و tab-dist-targets (تارگت پخش). تارگت فروش = تارگت فروش نمایندگان.

## شروع اجباری بعد از نوبت ۸۶
نسخه برنامه فعلی 12.11.0. اگر کاربر گفت «زیپ با فرمت دیگری ظاهر شده»، ZIP را PKZIP ویندوز بساز و صفحه دانلود پورت 8000 را نشان بده؛ present_file خام ZIP در Arena ممکن است سفید/باینری باشد. نسخه را بدون تغییر کد bump نکن.

## شروع اجباری بعد از نوبت ۸۷
نسخه 11.67.0. عرض/ارتفاع ذخیره‌شده مدیر اعمال شود. سطرهای تارگت/مسیر ویرایش و حذف دارند. سرور منبع واحد است (merge با _updatedAt + poll 8s).


نسخه 11.68.0. کلید ویرایش/حذف تارگت پایدار است. طراح ستون‌ها فاصله میلی‌متری قبلی/بعدی و شماره سطر دارد.

## 11.69.0 / نوبت ۸۹
سرور منبع حقیقت است؛ حذف با _deletedIds روی ادغام اعمال می‌شود؛ رکوردهای هم‌نام ادغام می‌شوند؛ poll سبک ۲۵ثانیه؛ ویرایش/حذف تارگت و فاصله/سطر زنده.

## 11.70.0 / نوبت ۹۰
حلقه cache-reset قطع شد. سرور فقط اطلاعات همین دستگاه را نگه می‌دارد (_soloOnly / replace).

## 11.71.0 / نوبت ۹۱
اسکریپت یک‌بار؛ ۴۰۴ بدون login.html؛ سرور فقط داده همین دستگاه.

## 11.72.0 / نوبت ۹۲
سرور اول رندر شود. فلش تعداد حذف. ویرایش/حذف پایدار. تارگت پخش: محقق‌شده، مانده، کادر جمع، کادر جدا هر پخش. کادر نمایش تارگت‌های ثبت‌شده حذف.

## 11.73.0 / نوبت ۹۳
یک state زنده. پرده تا سرور. پاک دادهٔ دیگران از ریشه. ویرایش/حذف پایدار. ذخیره تارگت پخش بعد از ویرایش/حذف.

## 11.74.0 / نوبت ۹۴
مشاطب در فروش پخش‌ها مانند دایا و شفاآراد با ستون ۱۱/۱۲/۱۰ و تطبیق کد ۱۸۶۱۰۱…۱۸۶۱۰۷.

## 11.75.0 / نوبت ۹۵
طراح ستون‌ها زنده. Autofill جغرافیا حذف. دیتابیس پخش ویرایش/حذف. تاریخ مشاطب ستون ۳. تکراری نام+مکان مسدود.

## 11.80.0
ملاک فقط سرور؛ قفل ورود داده نسخه قبلی؛ مصرف‌کننده جدید = فعلی × (۱+افزایش).

## 11.81.0
پاکسازی قطعی داده سیستم قبلی؛ ملاک فقط سرور نسل ۱۱.۸۱؛ مصرف‌کننده جدید = فعلی × افزایش.

## 11.82.0
اعمال قطعی شماره ترتیب و اندازه طراح ستون‌ها روی فرم/لیست واقعی.

## 11.83.0
توقف پرش تایپ در داروخانه/پزشک؛ کاشی نقشه از سرور؛ ورود پایدار موبایل ایران.

## 11.84.0
داشبورد تحلیلی زنده با فیلتر؛ بدون پرش تایپ؛ ترتیب سفارشات پایدار.

## 11.85.0
یک ستون عملیات مسیر؛ جستجو و همه جغرافیا؛ داشبورد خوانا.

## 11.89.0
هرگز داروخانه کاربر پاک نشود؛ مسیر قابل کلیک؛ نسخه یکسان موبایل/ویندوز.

## نوبت ۱۰۸ — نسخه ۱۱.۹۰.۰ (۲۰۲۶-۰۸-۲۸)
موبایل سفید/همبرگری، تخصص پزشک، حریم نماینده، رصد تردد یک‌باره، کلید استاندارد.

## نوبت ۱۰۹ — نسخه ۱۱.۹۱.۰
محتوای موبایل سفید رفع، تخصص کامل در فیلد، ویرایش/حذف مسیر، فاصله فشرده داشبورد.

## نوبت ۱۱۰ — نسخه ۱۱.۹۲.۰
هاب ndcohub.ir و mehraeinpharma.ir + Render؛ CORS؛ همگام ذخیره؛ رفع ۴۰۴ favicon و مسیر login/panel فایل.

## نوبت ۱۱۱ — نسخه ۱۱.۹۳.۰
حالت fullstack/static، sync-all.js، build-static نت‌افراز، هاب env، timeout/retry. بدون Next.js.

## نوبت ۱۱۲ — نسخه ۱۱.۹۴.۰
نت‌افراز مستقل با api.php، leaflet ریشه، همگام اختیاری Render، راهنمای SSL.

## نوبت ۱۱۳ — نسخه ۱۱.۹۵.۰
نشان نسخه کنار لوگو با کادر ورود یکی شد (دیگر ۹۱ روی ۹۴/۹۵ نمی‌نشیند). نت‌افراز دیگر داده رندر را بی‌اجازه نمی‌کشد. نام پیش‌فرض شرکت طنین طب طاها. داروخانه کاربر خالی نمی‌شود.

## نوبت ۱۱۴ — نسخه ۱۱.۹۶.۰
مسیر /api/sync در api.php برای ارسال داده نت‌افراز به رندر. push_render با نسل ۱۱.۸۱ و هدر X-CRM-Sync تا رندر رد نکند. ذخیره خالی رندر را پاک نمی‌کند.

## نوبت ۱۱۵ — نسخه ۱۱.۹۷.۰
آپلود فایل جدید دیگر داده قدیمی نت‌افراز را نگه نمی‌دارد: با نسخه جدید، داده از رندر جایگزین می‌شود (اگر رندر خالی نباشد). npm run build-static پیش‌فرض BASE_URL رندر را می‌نویسد.

## نوبت ۱۱۶ — نسخه ۱۱.۹۸.۰
سرویس‌ورکر دیگر بدون Response رد نمی‌شود. Options از htaccess برداشته شد تا نت‌افراز ۵۰۰ ندهد. api-config معتبر PHP/JSON. نشان نسخه واحد.

## نوبت ۱۱۷ — نسخه ۱۱.۹۹.۰
نت‌افراز مستقل و سریع. فایل/حافظه قدیمی خوانده نمی‌شود. همگام فقط پس‌زمینه. GET دیگر رندر را صبر نمی‌کند.

## نوبت ۱۱۸ — نسخه ۱۲.۰۰.۰
Forbidden نت‌افراز با index.php رفع شد. نشان کنار لوگو با سرور یکی است. نام شرکت قدیمی به طنین طب طاها برمی‌گردد. داده عملیاتی کاربر پاک نمی‌شود.

## نوبت ۱۱۹ — نسخه ۱۲.۰۱.۰
گواهی ndcohub دیگر کنسول رندر را پر نمی‌کند. کاشی نقشه نت‌افراز از OSM. همگام خودکار: اول از رندر می‌کشد بعد می‌فرستد.

## نوبت ۱۲۰ — نسخه ۱۲.۰۲.۰
همگام فقط از نت‌افراز به رندر. بازیابی فقط داده ثبت‌شده. موبایل فشرده. بدون fetch کورس به نت‌افراز.

## نوبت ۱۲۱ — نسخه ۱۲.۰۳.۰
آپلود نسخه جدید داده ثبت‌شده را پاک نمی‌کند. فایل زنده هاست در static-build نیست. همگام ادغام است.

## نوبت ۱۲۲ — نسخه ۱۲.۰۴.۰
داده زنده در پوشه data است نه کنار فایل‌های JS.

## نوبت ۱۲۳ — نسخه ۱۲.۰۵.۰
static-build فقط فایل. داده خالی از رندر پر می‌شود.

## نوبت ۱۲۴ — نسخه ۱۲.۰۶.۰
ویندوز و گوشی یک داده از api.php نت‌افراز. ذخیره واقعی روی هاست نه فقط حافظه مرورگر.

## نوبت ۱۲۵ — نسخه ۱۲.۰۷.۰
هدر چسبان موبایل، تکراری داروخانه با نام، اعتبارسنجی ستاره، منطقه، مسیر، منزل با ذخیره، قیمت رند ۵/۱۰.

## نوبت ۱۲۶ — نسخه ۱۲.۰۸.۰
رفرش داده را پاک نمی‌کند. ستاره فقط فیلد ستاره‌دار. تخصص یک فیلد. جغرافیا ثابت. منزل GPS. قیمت بدون VAT دوبل.

## نوبت ۱۲۷ — نسخه ۱۲.۰۹.۰
نام و جای فیلد بین ویندوز و گوشی. مصرف‌کننده با ارزش افزوده در قیمت جدید قابل ویرایش. تخصص لیست+جستجو. GPS منزل.
