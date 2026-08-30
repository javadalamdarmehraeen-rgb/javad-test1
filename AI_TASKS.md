## 12.12.0
همگام لحظه‌ای ۸۰۰ms + پل نت‌افراز→رندر؛ هدر «برنامه ویزیت و گزارشات (مهر آیین نیک دارو)» و «طنین طب طاها  TANIN TEB TAHA».

## 12.11.0
- [x] GPS منزل پایدار (retry + last fix) و کلید ذخیره در هدر
- [x] پلاک و طبقه در رندر V37 لیست منزل
- [x] جغرافیا دیگر با لیست سراسری قاطی نمی‌شود
- [x] قیمت جدید لحظه‌ای از درصد افزایش و consVat*(1-vat%) سپس fromCons
- [x] همگام ۲ثانیه‌ای ویندوز/گوشی بدون رفرش دستی

## 12.10.0
- [x] GPS منزل بگیر/نگیر → getCurrentPosition+watch، دقت ۸۰م، پلاک/طبقه در جدول
- [x] استان/شهر/منطقه ثابت → populate بدون rebuild + skip v56 روی فرم
- [x] درصد افزایش در کادر قیمت جدید همان لحظه + consVat باقیمانده سپس fromCons
- [x] همگام لحظه‌ای بدون رفرش دستی؛ PHP _lastSavedAt

## 11.77.0
تب قیمت‌گذاری کالاها با دو کادر فعلی/جدید و اعمال زمان‌بندی‌شده.

## 11.76.0
آرشیو فایل پخش/اسنپ قفل شد؛ Autofill جغرافیا قطع؛ نام داروخانه ساده؛ هیت‌مپ فعالیت.

# AI TASKS
# Namayande Elmi
# Current Project Status & Work Tracking

This file is the operational task memory for the project.

It tells an AI agent:

- What has already been done
- What is currently being worked on
- What is known to be important
- What must be verified
- What remains unfinished
- What the next task should be

IMPORTANT:

This file must NOT be treated as a replacement for the source code.

The actual source code remains the final source of truth.

---

# 1. CURRENT PROJECT

Project:
Namayande Elmi

Repository:
https://github.com/javadalamdarmehraeen-rgb/namayandeelmi-javad

Production:
https://namayandeelmi-javad.onrender.com

Primary branch:
main

---

# 2. PROJECT STATUS

Status:

ACTIVE DEVELOPMENT

The project is a large evolving CRM / field-representative / pharmacy /
doctor / order-management system with:

- Web application
- Admin panel
- Representative panel
- CRM
- Forms
- Lists
- Manual Designer
- Maps
- GPS
- Orders
- Products
- Pharmacies
- Doctors
- Messaging
- PWA
- Mobile application
- Synchronization
- PostgreSQL
- Render deployment
- NdcoHub integration

The project has a long Git history and must NOT be treated as a new project.

---

# 3. CURRENT DEVELOPMENT PRINCIPLE

The project is being developed incrementally.

Existing functionality must be preserved unless the current task explicitly
requires changing it.

The next AI agent must continue the existing project rather than rebuilding it.

---

# 4. COMPLETED FOUNDATION

The following project-memory files have been created:

- AI_PROJECT_CONTEXT.md
- AI_ARCHITECTURE.md
- AI_DECISION_LOG.md
- AI_RULES.md
- AI_TASKS.md

These files exist to restore project context when starting a new AI chat.

Before implementation, the AI agent must read them.

---

# 5. CURRENT SYSTEM AREAS

The project currently contains or documents the following major areas:

## Core application

- Next.js
- App Router
- TypeScript
- PostgreSQL
- Drizzle ORM

## CRM

- CRM main application
- CRM feature modules
- versioned CRM feature files
- forms
- lists
- fields
- field ordering
- field sizing
- row/stack layouts
- boxes
- widgets
- tabs
- manual designer

## Users / Roles

- Admin
- Representatives
- other application users

## Business entities

- Pharmacies
- Doctors
- Products
- Orders
- Targets
- Visits
- Records

## Geography

- Provinces
- Cities
- Map
- GPS
- Geocoding
- Distance calculation

## Communication

- Telegram
- Bale
- Eitaa
- WhatsApp
- SMS

## Mobile

- React Native / mobile application
- mobile authentication
- device authentication
- SIM-related authentication

## PWA

- Service Worker
- IndexedDB
- Offline support
- Cache
- Background Sync

## Synchronization

- Render
- NdcoHub
- pull
- push
- sync run
- sync status

## Deployment

- GitHub
- GitLab
- Render
- NdcoHub

---

# 6. RECENT DEVELOPMENT HISTORY

The Git repository contains many iterative commits.

Recent history includes development around:

- CRM navigation
- CRM forms
- CRM lists
- fields
- field order
- field width
- row/stack layout
- boxes
- widgets
- manual designer
- searchable selects
- geography
- pharmacy matching
- freeze headers
- login/password
- visit tracking
- notification behavior
- product display
- order fields
- product editing
- default list behavior

The exact implementation must always be confirmed from Git and source code.

Do NOT assume that a commit title completely describes the current behavior.

---

# 7. CURRENT HIGH-RISK AREAS

The following areas must be considered HIGH RISK:

1. Authentication
2. Mobile authentication
3. Database schema
4. Database migrations
5. Synchronization
6. CRM core
7. Manual Designer
8. PWA / Service Worker
9. Offline storage
10. Deployment configuration
11. Messaging providers
12. Production data
13. API contracts

Any change in these areas requires extra inspection and testing.

---

# 8. CURRENT LOW-RISK CHANGE EXAMPLES

The following may usually be treated as localized changes,
provided dependency analysis confirms this:

- isolated text change
- isolated label change
- small CSS adjustment
- small visual spacing adjustment
- isolated UI wording
- small non-breaking display change

Even low-risk changes must be verified.

---

# 9. TASK STATUS SYSTEM

Use these statuses:

TODO
IN_PROGRESS
BLOCKED
NEEDS_REVIEW
TESTING
DONE
CANCELLED

---

# 10. CURRENT TASK

Current task:

RESTORE AI PROJECT CONTEXT FOR CONTINUED DEVELOPMENT

Status:

IN_PROGRESS

Goal:

Create a persistent project-memory system so a new AI agent can continue
development without relying on the broken historical chat.

---

# 11. CONTEXT RESTORATION TASKS

## TASK-001

Create AI_PROJECT_CONTEXT.md

Status:
DONE

Purpose:
Store high-level project context and historical knowledge.

---

## TASK-002

Create AI_ARCHITECTURE.md

Status:
DONE

Purpose:
Document system architecture and major dependencies.

---

## TASK-003

Create AI_DECISION_LOG.md

Status:
DONE

Purpose:
Preserve important historical decisions and implementation reasoning.

---

## TASK-004

Create AI_RULES.md

Status:
DONE

Purpose:
Prevent unsafe AI modifications, unnecessary refactoring,
deletion of important files and architectural damage.

---

## TASK-005

Create AI_TASKS.md

Status:
IN_PROGRESS

Purpose:
Track current development state and future tasks.

---

## TASK-006

Create ARENA_HANDOFF_PROMPT.md

Status:
DONE

Note:
ARENA_HANDOFF_PROMPT.md exists in the repository root and fulfils these
requirements; verified present in the current working tree.

Purpose:

Provide a single prompt that can be pasted into a new Arena AI Agent Mode
conversation.

The prompt must force the new agent to:

1. Read the project memory files.
2. Inspect the GitHub repository.
3. Inspect the current source code.
4. Inspect recent Git history.
5. Inspect the production application.
6. Reconstruct the current architecture.
7. Report its understanding.
8. Identify uncertainties.
9. NOT modify code immediately.

---

## TASK-007

Apply the 14-point user change request as version v11.15.0

Status:
DONE

Scope summary:

1. Old default required-star behaviour removed; only pharmacyName and
   doctorName stay required (one-time state migration in v19 `fixRequiredDefaults`).
2. Additions tab (افزودن‌ها) compacted; the "compact list of all selects" and
   "field info" boxes removed; typed add-option inside combos; small colored
   "add option" button removed (v19 + index.html markup removal).
3. All delete buttons iconified 🗑️ and all edit buttons ✏️ (v19 `iconifyButtons`).
4. "Instant add option" (افزودن لحظه‌ای) toggle available and persisted for
   every field type incl. builtins (v11 save branch + getUnifiedFieldList).
5. Real per-field list ordering; row number + rep name as first columns
   (v19 list reorder engine).
6. Routing column rendered as a GPS icon per row (v19 `paintRouteIcons`).
7. "پاک کردن" (clear) button added to pharmacies / doctors / orders forms.
8. Field delete in field-info table now deletes completely; delete button no
   longer morphs into "نمایش مجدد" (v11 `deleteAnyField` / `renderColFieldList`).
9. Edit ✏️ button next to delete on each order-item row opens the matching
   catalog product for editing. NOTE: the user's sentence for this item was
   ambiguous/typo'd; this interpretation must be confirmed by the user.
10. Box info (اطلاعات کادرها) and key info (اطلاعات کلیدها) shown only in
    their own sections, removed from the fields-info table.
11. Products mega-fix (add-field bar labels, real box/list ordering, info
    panel under the bar, working per-row edit, تعداد کالا renames, gift image
    removed, row total = qty × unit price, VAT% admin-only, two readonly
    totals, admin-editable formula, combo arrow fixed, default 0 cleared on
    typing, thousands separators, correct order total).
12. Backup page excluded from auto layout; auto backup actually runs; manual
    backup lands in the admin-chosen folder/file (File System Access API with
    persisted handle in IndexedDB when available).
13. Granular diagnostics (v19 `runDetailedDiagnostics`); fake
    `testServerConnectivity` replaced by the real granular check.
14. PERMANENT RULE: every added/removed/changed capability must be reflected
    in permissions; new permission group "ابزارهای مدیریت (نسخه ۱۱.۱۵)" added
    in crm-data.js; AI_RULES.md #62 records the rule.

Implementation:
Single new versioned file public/crm-features-v19.js (loaded after v18) plus
small surgical edits in index.html, crm-app.js, crm-features-v11.js,
crm-data.js, sw.js, server.js, package.json. Project skeleton and the
versioned-file pattern were kept unchanged.

Verification status:
- `node --check` passes for all JS files (VERIFIED).
- `node server.js` smoke test: /api/health reports 11.15.0, / serves
  index.html including the v19 script tag, /crm-features-v19.js serves 200
  (VERIFIED).
- In-browser behaviour of the 14 items must be verified by the user in
  Chrome/Edge (PENDING USER VERIFICATION).

---

## TASK-008

Create and maintain chat.arena as the full session/project memory file

Status:
DONE

Scope summary:

1. chat.arena created at repository root (user-requested permanent artifact).
2. It contains: project summary, architecture explanation, full ordered
   user/AI chat log (verbatim where available), permanent rules, delivery
   workflow, risk map, and the full embedded source of all text files in the
   repository.
3. AI_RULES.md #63 created: chat.arena must be updated after every chat and
   every delivered version, and must be included in every delivered ZIP.

---

## TASK-009

v11.15.1 hotfix — remove hardcoded required-field saves (star-respecting saves)

Status:
DONE

User report: after v11.15.0, with only pharmacyName starred, saving a
pharmacy still raised a forced-field warning for province/city/district/
address.

Root cause (VERIFIED): 9 hardcoded empty-field alert blocks in entity save
paths (3 active handlers in crm-features-v9.js; 6 duplicated in two code
generations of crm-app.js), independent of the star system.

Fix (VERIFIED): all 9 replaced with calls to the star-aware
`window.validateRequiredFields(tabId)`; only admin-starred fields can block
saving now, app-wide. Order "minimum one item" rule kept (business rule).
Version bumped to 11.15.1 everywhere (package.json, server.js, sw.js,
index.html ?v=). node --check green; server smoke green (11.15.1).

PENDING USER VERIFICATION in browser on all three forms (pharmacy/doctor/
order) with only their chosen starred fields.

---

## TASK-010

v11.15.2 — duplicate-save warning becomes a real yes/no choice

Status:
DONE

User report: the duplicate pharmacy warning had only OK and always saved.
Wanted: بله saves / خیر cancels.

Fix (VERIFIED): all 4 duplicate-warning sites (pharmacy+doctor in v9 active
handlers; both app.js generations) converted to `window.confirm`; cancel
returns before push. Version 11.15.2 everywhere. node --check green; smoke
green.

---

## TASK-011

Relationship map in chat.arena + durable generator + OFFICIAL_FILELIST fix

Status:
DONE

Scope:
1. chat.arena gained section ۳-ب: detailed file/code relationship map (load
   chain, state lifecycle and key ownership, 7 cross-file flows, storage-key
   map, 8 relationship hazards).
2. The session sandbox reset deleted workspace-root helpers; the chat.arena
   generator was recreated INSIDE the repo as `update_chat_arena.py` so it
   ships with the ZIP and cannot be lost again.
3. CRITICAL FINDING: OFFICIAL_FILELIST.txt (whitelist used by the user's
   CLEAN_EXTRA_FILES.bat) was missing chat.arena, public/crm-features-v17.js,
   v18.js, v19.js and the AI_*/ARENA_HANDOFF memory files — running cleanup
   would have deleted them locally. All added to the list (now protected).
   chat.arena rule #8 records this permanently.

---

# 12. NEXT IMMEDIATE TASK

No pending coding task.

Awaiting user in-browser verification of v11.15.0 (TASK-007), especially:

1. List column ordering after setting «شماره ترتیب در لیست».
2. Typed add-option rows appearing as children of the same combo.
3. Backup to a chosen folder (requires Chrome/Edge and secure context).
4. Granular diagnostics output in the troubleshooting tab.
5. Order item totals, VAT, and the admin-only formula box.

After user confirmation, the next task is whatever new change request the
user issues following their verification pass.

---

# 13. ARENA AGENT INITIALIZATION REQUIREMENT

When a new Arena AI conversation starts, the agent must NOT immediately modify
code.

First perform:

PHASE 1
Read project memory.

PHASE 2
Inspect repository.

PHASE 3
Inspect architecture.

PHASE 4
Inspect recent Git history.

PHASE 5
Inspect relevant source code.

PHASE 6
Inspect production application.

PHASE 7
Generate a Project Understanding Report.

PHASE 8
Wait for the user's actual development request.

---

# 14. PROJECT UNDERSTANDING REPORT

Before the first code modification, the AI agent should be able to explain:

## Application

What the application does.

## Architecture

How frontend, backend, database and deployment interact.

## CRM

How CRM features are structured.

## Database

Where schema and database access live.

## Authentication

How users authenticate.

## Mobile

How mobile authentication and APIs work.

## PWA

How offline/cache/service-worker behavior works.

## Sync

How Render and NdcoHub synchronize.

## Deployment

How GitHub/GitLab/Render/NdcoHub are connected.

## High-risk files

Which files must not be modified casually.

## Current Git state

Which commit is currently at the top of main.

---

# 15. UNCERTAINTY REGISTER

If the new AI agent discovers something it cannot verify,
it must record it here or report it.

Format:

### UNKNOWN-001

Question:
...

Why it matters:
...

How to verify:
...

Status:
OPEN

Do not convert guesses into facts.

---

# 16. BUG REGISTER

Known bugs should be recorded here.

Format:

### BUG-001

Title:
...

Symptoms:
...

Expected:
...

Actual:
...

Affected files:
...

Status:
OPEN

Fix:
...

Verification:
...

---

# 17. FEATURE REGISTER

Future features should be recorded here.

Format:

### FEATURE-001

Title:
...

Purpose:
...

Requested by:
User

Status:
TODO

Affected areas:
...

Risk:
LOW / MEDIUM / HIGH

---

# 18. DO NOT MARK DONE WITHOUT TESTING

A task may only become:

DONE

after appropriate verification.

For example:

Code change
→ Build
→ Relevant test
→ Browser test
→ Production test if required
→ Git diff
→ Git status
→ Commit

---

# 19. GIT WORKFLOW

The project update workflow is:

git add -A

git status

git commit -m "DESCRIBE ACTUAL CHANGE"

git push origin main

After pushing:

1. Confirm GitHub.
2. Confirm deployment.
3. Test affected feature.

---

# 20. IMPORTANT GIT RULE

Do not automatically push code after every change.

First:

- inspect
- test
- review diff
- confirm intended files

Then push.

---

# 21. CURRENT DEPLOYMENT

Production application:

https://namayandeelmi-javad.onrender.com

GitHub:

https://github.com/javadalamdarmehraeen-rgb/namayandeelmi-javad

The current repository documentation indicates Render deployment with
Next.js production build and a health-check endpoint.

The exact current deployment configuration must be verified from:

- render.yaml
- package.json
- GitHub workflows
- GitLab CI
- current Render configuration

Do not rely only on this file.

---

# 22. CURRENT DATABASE

The project uses:

PostgreSQL

with:

Drizzle ORM

The actual database schema must be verified from:

src/db/schema.ts

and migration files.

Do not assume this file contains the complete current schema.

---

# 23. CURRENT SYNCHRONIZATION

The project includes synchronization between:

Render

and

NdcoHub

Known concepts include:

- uid
- updated_at
- origin
- pull
- push
- sync run
- sync status

The actual current implementation must be verified from source code.

---

# 24. CURRENT MOBILE SYSTEM

The repository includes a mobile application.

Known mobile-related areas include:

mobile/
src/simAuth.ts

Mobile authentication must be treated as security-sensitive.

Do not modify it without inspecting both client and server implementations.

---

# 25. CURRENT CRM SYSTEM

The CRM contains many historical iterations.

The repository includes versioned CRM feature files.

Do not assume the newest filename is automatically the only active implementation.

Always inspect:

- script loading
- imports
- references
- actual runtime behavior

---

# 26. CURRENT MANUAL DESIGNER

The Manual Designer is an important subsystem.

Known functionality includes:

- field selection
- field ordering
- field size
- form/list configuration
- row/stack layout
- widgets
- boxes
- tabs
- searchable selects
- locking
- selective copying

Changes to this subsystem require regression testing.

---

# 27. CURRENT MAP SYSTEM

Known map-related areas include:

- MapExplorer
- map pages
- geocoding
- province/city handling
- distance calculations
- GPS

Changes to geography should be tested with actual locations.

---

# 28. CURRENT MESSAGING SYSTEM

Messaging supports multiple providers/platforms.

Known platforms:

- Telegram
- Bale
- Eitaa
- WhatsApp

Never commit real credentials.

---

# 29. CURRENT PWA SYSTEM

The application contains PWA/offline behavior.

Known concepts:

- Service Worker
- IndexedDB
- Cache
- Offline route
- Background Sync
- online/offline detection

Do not disable these systems to solve unrelated UI issues.

---

# 30. PRODUCTION SAFETY

Production is considered important.

Do not:

- delete production data
- reset production database
- expose secrets
- change authentication casually
- change sync conflict rules casually
- disable security controls
- change deployment architecture casually

---

# 31. AI AGENT HANDOFF PRINCIPLE

A new AI conversation should be able to reconstruct the project from:

1. Repository
2. AI_PROJECT_CONTEXT.md
3. AI_ARCHITECTURE.md
4. AI_DECISION_LOG.md
5. AI_RULES.md
6. AI_TASKS.md
7. Git history

The historical chat is helpful but must NOT be the only source of project
knowledge.

---

# 32. CONTINUOUS MEMORY RULE

After completing a significant feature or architectural decision:

Update the appropriate memory file.

Examples:

New architecture decision
→ AI_DECISION_LOG.md

New architecture knowledge
→ AI_ARCHITECTURE.md

New general project knowledge
→ AI_PROJECT_CONTEXT.md

New safety rule
→ AI_RULES.md

New task / bug / status
→ AI_TASKS.md

---

# 33. MEMORY MAINTENANCE

The AI agent must keep these files synchronized with reality.

Do not allow them to become outdated documentation.

If source code contradicts a memory file:

SOURCE CODE WINS.

Then update the memory file.

---

# 34. FINAL PROJECT STATE

Current state:

The project is an active production-oriented CRM/application.

The immediate objective is NOT to redesign the application.

The immediate objective is:

RESTORE RELIABLE AI CONTEXT
+
PROTECT EXISTING CODE
+
CONTINUE DEVELOPMENT SAFELY

---

---

# 35. V11.15.3 — GIT SYNC + HYGIENE (DONE 2026-08-16)

Completed:
1. One-command dual sync: SYNC_ALL.bat / sync_all.sh
   (pull → commit → push to GitHub + GitLab).
2. Cross-system files: .gitattributes line-ending normalization.
3. Secrets hygiene: .env verified never tracked; .gitignore hardened;
   template sanitized. Rule: AI_RULES #65.
4. Zero-dependency runtime: express/cors removed; lock regenerated;
   node_modules deletable (commands documented in CHANGES_V11.md).
5. .gitlab-ci.yml build de-Nextified; GitLab mirror kept optional.
6. OFFICIAL_FILELIST.txt repaired (KEEP_ONLY_GITHUB.bat) + grown (239).

Pending user-side verification:
- Sync script run on his Windows machine(s).
- GitLab remote one-time setup per RAHNAMA_GITLAB.txt (needs HIS account).

---

# 36. V11.16.0 — KNOWLEDGE GRAPH + FORM UX PACK (DONE 2026-08-16)

Completed (code + sandbox tests):
1. PROJECT_GRAPH.md knowledge graph + update_project_graph.py generator
   (rule #66: read first, regenerate every delivery).
2. crm-features-v20.js: combo manager (Persian labels, stacked options,
   per-option edit/delete, instant search, live refresh), grey chains,
   order-form lock, typed-add auto-save, pharmacy↔order field mirror,
   product-field rendering fix, list column-order enforcement, number
   spinner removal, top change-password button, role presets.
3. Exact-duplicate hard block on all 4 save paths (v20DupGate).
4. Diagnostics repaired (window.state getter, /api/state neutral, banner).
5. Permissions mirrored (crm-data.js «نسخه ۱۱.۱۶» group — rule #62).
6. Delivery commands now dual-remote (rule #67).

Pending user-side verification (browser):
- Combo manager edit/delete/search on his data.
- Grey chains + order lock behavior in a real order.
- Exact-duplicate block (identical record) and near-dup confirm.
- Product-field insertion (order/size) and list column order in lists.
- Role preset application on a test user.
- Typed-add ⇒ auto-save of a new pharmacy.

---

# 37. V11.16.1 — GITHUB PUSH REPAIR (DONE 2026-08-16)

Completed:
1. Diagnosed remote: single manual commit c0abb06 "پروژه اولیه" (11.15.3
   snapshot) replaced the history → normal pushes rejected.
2. PUSH_FRESH_GITHUB.bat one-time repair (merge --allow-unrelated-histories
   -X ours → push) + works as rescue for any future replaced history.
3. RAHNAMA_GITLAB.txt: token-free SSH method added (token UI disabled on
   his GitLab); GitLab support preserved in code (SYNC_ALL auto-detects).

Pending user-side verification:
- Run PUSH_FRESH_GITHUB.bat once, then confirm GitHub web shows
  public/crm-features-v20.js + PROJECT_GRAPH.md (Ctrl+F5).
- Later: SSH setup for GitLab when he is ready.

---

# 38. V11.16.2 — USER VERIFICATION FIX PACK (DONE 2026-08-16)

Completed (from user's browser findings):
1. Combo manager: side-by-side card grid; Persian labels (placeholder +
   V20_FA_IDS dictionary); jalali سال/ماه excluded from that section.
2. Uniform greying via setFieldGrey (whole form-group + visible combo
   input disabled, pointer-events off) + scroll preserved (no field jump).
3. Orders: product section always active; pharmacy field-order changes
   mirror into orders; grey combos are truly unselectable.
4. Change-password button now sits beside the logout button (not on it).
5. False "قبلاً ثبت شده" on brand-new records fixed (autosave signature
   suppression + editing-record exclusion in v20DupGate).

Pending user verification: same list, in browser after Ctrl+Shift+R.

## ۳۹) نسخه ۱۱.۱۷.۰ — بازخورد نوبت ۱۶
- [x] تثبیت جای/شناسه فیلدها و توقف مرتب‌سازی خودکار نسخه‌ای
- [x] پیام هم‌نام سفارش کنار فیلد و جایگذاری دقیق همه وابستگی‌ها
- [x] کارت‌های چندستونه فارسی افزودن‌ها + مدیریت داروخانه/پزشک وابسته
- [x] جدیدترین سطر در بالا + قفل فیلدهای اشتراک مدیر
- [x] آدرس ریز، GPS واقعی، کارت آمار، تاریخچه رصد، جستجو و اکسل
- [x] نسخه در هدر و اصلاح ضربدر قرمز GitHub Actions
- [ ] تأیید مرورگری کاربر پس از استقرار و Ctrl+Shift+R

## ۴۰) نسخه ۱۱.۱۷.۱ — بازخورد نوبت ۱۸
- [x] حذف کالای تعداد خالی از ذخیره/ارسال/جمع + پاکسازی الگوی قدیمی
- [x] پیام‌رسان پویا مطابق تمام ستون‌های فعلی و سفارشی
- [x] کارت‌های واقعی کنارهم، حذف سبک قدیم، تفکیک کامل تب‌ها
- [x] جستجوی مقیاس‌پذیر نام داروخانه/پزشک
- [x] تاریخ فعال، پاکسازی نام سفارش و هشدار شناور بدون تغییر ترتیب
- [x] نسخه فقط مدیر + تضمین ذخیره تنظیمات کالا
- [ ] تأیید مرورگری کاربر پس از استقرار و پاک‌سازی کش

## ۴۱) نسخه ۱۱.۱۸.۰ — اسنپ سازمانی و موقعیت همه نمایندگان
- [x] تب/منوی اسنپ سازمانی + دسترسی‌های رسمی
- [x] ورود امن دستی و عدم ذخیره credential/CAPTCHA bypass
- [x] ورود چند فایل، dedupe، ۹ ستون منتخب، فیلتر و تجمیع
- [x] رفع دانلود دوتایی و استاندارد رنگ اکسل/حذف
- [x] همه نمایندگان روی نقشه + آدرس متنی هر نماینده
- [ ] تأیید ساختار فایل واقعی خروجی اسنپ توسط کاربر
- [ ] خودکارسازی روزانه فقط در صورت ارائه API رسمی اسنپ

## ۴۲) نسخه ۱۱.۱۹.۰ — پیام، اسنپ افزایش موجودی، فرم‌ها و تارگت
- [x] همه فیلدهای صفحه + ترتیب عددی متن ارسالی
- [x] فرمت اقلام با تعداد/جایزه و تاریخ روز/ماه/سال
- [x] آرشیو حذف‌ناپذیر اسنپ، جدیدترین بالا و تضمین پشتیبان
- [x] فیلتر نماینده، کلید تهیه گزارش و سرستون واقعی
- [x] آرشیو و تجمیع جداگانه افزایش موجودی
- [x] مرتب‌سازی تب‌های عمومی و بازگردانی کلیدهای تردد
- [x] تارگت تعداد/ریال پخش/ریال داروخانه در سطح قلم، نماینده و کل
- [ ] تأیید فایل واقعی در مرورگر کاربر

## ۴۳) نسخه ۱۱.۲۰.۰ — افزودن خودکار، schema اسنپ و سفارش پاک
- [x] حذف انتخاب تب و ارث‌بری هم‌نام
- [x] انتخاب وابسته استان/شهر/منطقه و تثبیت جای فیلد
- [x] schema سفر، تفکیک تاریخ/ساعت و تطبیق کاربران
- [x] فیلتر مستقل/کلید گزارش شارژ و عنوان مبلغ شارژ
- [x] مخفی‌شدن جایگذاری و یکسانی لیست/مودال/ارسال سفارش
- [x] endpoint ایمیل پشتیبان + env example امن
- [ ] تنظیم Resend در Render و تأیید ارسال واقعی کاربر
## ۴۴) نسخه ۱۱.۲۰.۱
- [x] بلوک ثابت اقلام/جایزه/جمع ردیف/جمع VAT
- [x] حذف کامل پیام‌های جایگذاری
- [x] دو کلید گزارش بالای اسنپ و تاریخ اختیاری
- [x] حذف شارژ صفر/خالی و سه‌رقمی اعداد
- [ ] تأیید مرورگری کاربر
## ۴۵) نسخه ۱۱.۲۰.۲
- [x] نوار ثابت و آشکار کلیدهای اسنپ
- [x] خالی‌سازی مقاوم تاریخ‌ها در برابر autofill
- [x] منع مطلق تزریق نمونه به state موجود
- [x] rolling backup + انتخاب غنی‌ترین backup + server sync/recovery
- [ ] تأیید حفظ داده واقعی کاربر پس از deploy
## ۴۶) نسخه ۱۱.۲۰.۳
- [x] ادغام همه backupها و بازیابی رکوردهای جاافتاده
- [x] تست مستقل بازیابی کاربر «خانم فائزه مغانی» + داروخانه/پزشک/کالا
- [x] remote merge بدون overwrite
- [x] تطبیق هوشمند اسنپ و آخرین تاریخ فایل‌ها
- [x] تراز فرم بدون تغییر ترتیب
- [ ] تأیید بازیابی واقعی در مرورگر کاربر
## ۴۷) نسخه ۱۱.۲۰.۴
- [x] mobile hamburger-only و حذف overflow
- [x] فیلتر تک‌حالته سفر/شارژ و وابستگی سال/ماه
- [x] dedupe کل ردیف نرمال‌شده
- [x] قانون تاریخ سراسری و استثنای رمز/سال/ماه
- [x] قفل ساختار مگر اقدام مدیر
- [ ] تأیید Android و iOS کاربر
## ۴۸) نسخه ۱۱.۲۰.۵
- [x] بازگردانی تنظیمات/چیدمان مبنای ۱۱.۲۰.۳
- [x] re-merge داده‌های snapshot برای فائزه/داروخانه/پزشک/کالا
- [x] حفظ موبایل و فیلترهای ۱۱.۲۰.۴ بدون تغییر ساختار
- [x] اصلاح خاموشی range و قفل ماه
- [ ] تأیید مرورگری کاربر
## ۴۹) نسخه ۱۱.۲۱.۰
- [x] unit regression و automated HTTP smoke + CI gate
- [x] تست parser اعداد و dedupe اسنپ
- [x] مشاهده آرشیو فایل‌های سفر/شارژ
- [x] اطلاعات ۴ شرکت پخش و credential session-safe
- [x] import داروخانه append / موجودی replace / مشاهده فایل‌ها
- [x] فیلتر و جداول ۱۵ ستونی all+4 + multi-sheet Excel
- [ ] دریافت URL و نمونه Excel واقعی چهار پخش برای mapping نهایی
## ۵۰) نسخه ۱۱.۲۱.۱
- [x] اصلاح جمع/تکرار اسنپ و مشاهده فایل‌ها
- [x] grey کامل و disabled ماه
- [x] CRUD نهایی کالا
- [x] تب دیتابیس پخش‌ها و تاریخ نرمال
- [x] گزارش ۱۹ ستون و محاسبات دایا/قیمت/درصد/unique
- [x] خطوط کامل جدول و تست‌ها
- [ ] نگاشت دقیق ستون‌های سه پخش دیگر پس از نمونه فایل
## ۵۱) نسخه ۱۱.۲۱.۲
- [x] IndexedDB bulk persistence و migration refresh
- [x] last-date fallback و تاریخ اسلش‌دار viewer
- [x] کد کالا 1001..1007 و formula آینده
- [x] Daya column16 canonical matching
- [x] delete cascade و compact layout
- [x] 19-column corrected metrics/borders
- [x] ۹ تست سبز
- [ ] تأیید refresh با فایل واقعی کاربر
## ۵۲) نسخه ۱۱.۲۱.۳
- [x] حذف کامل auto backup merge و historical recovery
- [x] حذف remote GET overwrite/reload
- [x] حذف runtime merger
- [x] تست authoritative current + empty arrays + no defaults
- [x] ۹/۹ تست سبز
- [ ] کاربر یک‌بار اطلاعات ناخواسته فعلی را اصلاح کند؛ پس از آن پایدار می‌ماند
## ۵۳) نسخه ۱۱.۲۱.۴
- [x] آخرین تاریخ از سطر آخر ستون ۱۴
- [x] append-only فایل داروخانه
- [x] grid پنج‌ستونه فیلتر پخش
- [x] عدم group تاریخ/رمز/کد
- [x] دکمه واقعی import سفر/شارژ
- [x] ۱۰/۱۰ تست سبز
- [ ] تأیید import واقعی XLSX کاربر
## ۵۴) نسخه ۱۱.۲۱.۵
- [x] تست واقعی DOM runtime
- [x] رفع early-init race اسنپ/پخش/کالا
- [x] ویرایش سلولی و ذخیره دیتابیس اکسل
- [x] sync batch edit با master database
- [x] label واقعی اطلاعات فرم کالا
- [x] ۱۰/۱۰ unit/smoke + DOM بدون خطا
- [ ] تأیید فایل واقعی XLSX کاربر
## ۵۵) نسخه ۱۱.۲۱.۶
- [x] رفع exact TypeError rowSignature.map
- [x] migration Object/cells/row/data/string → Array
- [x] DOM test با legacy state و ۴ handler
- [x] editable spreadsheet save master+IDB
- [x] label واقعی product info
- [x] ۱۰/۱۰ tests + DOM zero error
- [ ] تأیید فایل واقعی کاربر
## ۵۶) نسخه ۱۱.۲۱.۷
- [x] عدم تبدیل 39694 و مقادیر غیرشمسی
- [x] فقط افزودن اسلش به 14050819
- [x] last date/filter/viewer پخش slash-only
- [x] flex nowrap یک‌سطر فیلترها
- [x] ۱۰/۱۰ تست سبز
- [ ] تأیید دیتابیس واقعی کاربر
## ۵۷) نسخه ۱۱.۲۱.۸
- [x] schema قطعی ۵/۴/۸/۷/۲۲/۱۳/۱۴/۱۶/موجودی۳
- [x] همه ریال‌ها از master price
- [x] درصدهای سه‌گانه صحیح
- [x] customer/invoice unique per product و global
- [x] DOM واقعی: ۵ فیلد در flex row nowrap
- [x] ۱۲/۱۲ تست سبز
- [ ] تأیید اعداد فایل واقعی کاربر
## ۵۸) نسخه ۱۱.۲۱.۹
- [x] هم‌ترازی یک‌سلولی سرستون موجودی دایا
- [x] حذف backupهای خودکار حجیم و rolling save
- [x] ترتیب گزارش/اکسل مطابق master products
- [x] شیت‌های period metadata + 19 columns + total
- [x] ۱۳/۱۳ tests و DOM 5 fields row
- [ ] تأیید نمونه واقعی موجودی دایا
## ۵۹) نسخه ۱۱.۲۲.۰
- [x] schema واقعی موجودی دایا
- [x] exact header matching name/code/inventory
- [x] جلوگیری از match کالای در راه
- [x] fixture 1112002 qty6
- [x] ۱۴/۱۴ تست سبز
- [ ] تأیید مجموع واقعی همه شعب در مرورگر کاربر
## ۶۰) نسخه ۱۱.۲۲.۱
- [x] همه اعداد Latin
- [x] Excel border/grouping/percent text
- [x] sticky headers global
- [x] no-shake product info
- [x] address guard/full reverse/high accuracy GPS
- [x] list ordering paneId/fuzzy/rewrap
- [x] ۱۵/۱۵ tests
- [ ] تأیید مرورگری کاربر
## ۶۱) نسخه ۱۱.۲۲.۲
- [x] آدرس ایران-first و کد پستی label
- [x] قفل DOM ترتیب فرم‌ها بین refresh
- [x] schema داروخانه شفاآراد 8/10/4/6/date7
- [x] ستون10 موجودی = ستون6+8
- [x] فرمول ریالی/درصد شفاآراد
- [x] ۱۶/۱۶ tests
- [ ] تأیید فایل واقعی شفاآراد
## ۶۲) نسخه ۱۱.۲۲.۳
- [x] mapping هفت کد شفاآراد
- [x] header طوسی/مشکی برنامه و Excel
- [x] total red/percent text/grouping/borders Excel
- [x] fixed-grid observer و list-order observer
- [x] address no postcode + best GPS + dim button
- [x] ۱۷/۱۷ tests
- [ ] تأیید UI واقعی کاربر
## ۶۳) نسخه ۱۱.۲۳.۰
- [x] code-first شفاآراد و scientific scan
- [x] save real user edit/auth sync
- [x] real tab/sub permission checkboxes
- [x] save permission templates + role dropdown apply
- [x] separate gitignored user-data.json
- [x] atomic form/list order no disappearance
- [x] ۱۸/۱۸ tests
- [ ] persistent disk setup on Render for user-data file

# END OF AI TASKS
## ۶۴) نسخه ۱۱.۲۴.۰
- [x] حذف full-body number rescans و رندرهای تکراری شروع
- [x] اعمال لحظه‌ای ثبت کاربر در نمای فعال
- [x] حذف فاصله سرستون تا داده
- [x] header آبی آسمانی/مشکی در UI و Excel
- [x] خط‌کشی فقط سلول واقعی Excel
- [x] GPS ثابت <=10m / 30s و آدرس کامل‌تر
- [x] ۲۴/۲۴ تست ضد‌رگرسیون
- [ ] تأیید روانی و GPS روی موبایل واقعی کاربر
## ۶۵) نسخه ۱۱.۲۴.۱
- [x] ثبت هر ۷ کد اصلاحی شفاآراد
- [x] مهاجرت خودکار کد قدیمی کالا به کد جدید
- [x] حذف «نامشخص» از گزارش دایا
- [x] خواندن پویای نسخه هدر از فایل فعال
- [x] ۲۵/۲۵ تست
- [ ] تأیید گزارش واقعی دایا/شفاآراد توسط کاربر
## ۶۶) نسخه ۱۱.۲۵.۰
- [x] تب و منوی وضعیت فاکتور پخش‌ها
- [x] فیلتر تک‌سطر و قانون چک‌باکس/طوسی
- [x] تطبیق نام تقریبی + استان/شهر/منطقه
- [x] پنجره زمانی دقیق ±۳ روز
- [x] نام پخش، اختلاف روز و نام ویزیتور
- [x] مودال مقایسه تعداد و جایزه سفارش/فاکتور
- [x] cache برای جستجوی لحظه‌ای سبک
- [x] شش مجوز جدید
- [x] ۲۸/۲۸ تست
- [ ] تأیید با فایل واقعی هر چهار پخش توسط کاربر
## ۶۷) نسخه ۱۱.۲۶.۰
- [x] registry سراسری گزینه‌ها بر اساس لیبل
- [x] افزودن/ویرایش/حذف هم‌زمان همه فیلدهای هم‌نام
- [x] پرشدن فیلد هم‌نام جدید از اطلاعات موجود
- [x] قفل ترتیب همه form-gridهای تمام تب‌ها
- [x] حذف full-layout مخرب مسیر آینه سفارش
- [x] رفع ناپدیدشدن تب وضعیت فاکتور
- [x] فعال‌سازی خودکار SW و حذف هشدار رفرش دستی
- [x] ۳۲/۳۲ تست
- [ ] تأیید رفتار واقعی مدیر روی مرورگر و چیدمان ذخیره‌شده کاربر
## ۶۸) نسخه ۱۱.۲۷.۰
- [x] مهاجرت یک‌باره دسترسی تب وضعیت فاکتور
- [x] اتصال مستقیم setup تب وضعیت فاکتور روی کلیک
- [x] مهار synchronous موتور layout در startup
- [x] snapshot چیدمان فقط با اقدام مدیر
- [x] ۲۸ گروه دسترسی دقیقاً مطابق نام تب‌ها
- [x] حذف گروه‌های نسخه‌ای قدیمی از نمای دسترسی
- [x] CRUD نهایی کاربر و کلید ذخیره همیشه‌نمایان
- [x] فقط یک dropdown سطح + کلید ذخیره سطح
- [x] حذف لرزش صفحه دسترسی
- [x] طوسی فقط فیلد و checkbox، نه لیبل
- [x] ۳۵/۳۵ تست
- [ ] تأیید DOM واقعی و چیدمان داده ذخیره‌شده کاربر
## ۶۹) نسخه ۱۱.۲۸.۰
- [x] ذخیره کامل session کاربر در login
- [x] یافتن user بر اساس crmUserId
- [x] موتور نهایی دسترسی ۲۸ تب
- [x] اعمال زیرمجوزها روی کنترل‌های واقعی و رندرهای جدید
- [x] حذف کامل fallback قفل V1
- [x] مهار applyFull/applyAll/applyCustom startup
- [x] بازگردانی فقط فیلدهای مجاز و غیرحذف‌شده
- [x] نمایش overlay بالای کادرهای بعدی
- [x] GPS <=10m با geocode موازی و حداکثر 15s
- [x] ۳۷/۳۷ تست
- [ ] تأیید ورود با کاربر واقعی و تغییر مجوز در مرورگر کاربر
## ۷۰) نسخه ۱۱.۲۹.۰
- [x] حذف hide قدیمی invoice-status از v11
- [x] مهاجرت تازه V1129 برای مجوز تب
- [x] نصب synchronous قانون ارقام انگلیسی
- [x] پوشش option/placeholder/title و DOM جدید
- [x] حفظ password و تقویم فارسی
- [x] نام فارسی ماه در Excel پخش
- [x] بروزرسانی گراف/chat/همه آرشیوها
- [x] ۳۸/۳۸ تست
- [ ] تأیید تب و ارقام روی مرورگر واقعی کاربر
## ۷۱) نسخه ۱۱.۳۰.۰
- [x] pin دائمی تب وضعیت فاکتور + پیام عدم دسترسی داخل تب
- [x] مهاجرت دسترسی V1130
- [x] واکنش‌گرایی portrait/landscape تا 950px
- [x] کلیدهای فرم/لیست داخل viewport
- [x] لینک مسیریابی واقعی نشان/بلد/Google/Waze
- [x] حریم داده نماینده بر اساس مالکیت و مجوز all-reps
- [x] ثبت repId در رکوردهای جدید
- [x] bootstrap امن فقط برای origin کاملاً خالی
- [x] endpoint و فایل پایدار bulk برای Excel بین لینک‌ها
- [x] پشتیبانی CRM_DATA_DIR و /var/data
- [x] ۴۳/۴۳ تست شامل API bulk round-trip
- [ ] تنظیم Persistent Disk واقعی Render و CRM_DATA_DIR توسط کاربر
- [ ] تأیید Android/iOS و universal links روی گوشی واقعی
## ۷۲) نسخه ۱۱.۳۱.۰
- [x] پاک‌سازی cache/SW قدیمی پیش از نمایش build جدید بدون حذف داده
- [x] no-store سرور، CDN و SW برای HTML/JS/CSS
- [x] حذف flash صفحه مدیر با crm-booting
- [x] grid موبایل اقلام سفارش و کلید حذف 40px
- [x] کوچک‌سازی کلید پاک‌کردن فرم
- [x] همبرگری landscape و drawer داخل صفحه
- [x] Android intent نشان و بلد + universal iOS/web
- [x] بازسازی reps از users و حذف نام کاربران حذف‌شده
- [x] selector فقط خود نماینده مگر مجوز all-reps
- [x] فیلدهای استان/شهر/مناطق فعالیت و نمایش کنار نام
- [x] حذف کاربر همراه auth/reps/selectors
- [x] ۴۴/۴۴ تست
- [ ] تأیید کش، Android/iOS، همبرگری و intent روی دستگاه واقعی
## ۷۳) نسخه ۱۱.۳۲.۰
- [x] CSP/Permissions Policy/HSTS/security headers
- [x] مسدودسازی camera/mic/USB/Bluetooth/serial/HID/payment/sensors
- [x] حذف CORS wildcard
- [x] same-origin POST + X-CRM-Request
- [x] recursive JSON sanitizer ضد prototype pollution
- [x] atomic write + mode 0600 + safe read
- [x] file executable/type/32MB guard
- [x] unsafe URL/window opener/link/drop guard
- [x] input control/HTML character guard
- [x] Excel formula injection guard
- [x] HTTPS-only distributor panel URL
- [x] پنل وضعیت امنیت در عیب‌یابی
- [x] ۴۵/۴۵ تست
- [ ] ممیزی نفوذ مستقل و HTTPS/Render production headers توسط متخصص بیرونی
## ۷۴) نسخه ۱۱.۳۳.۰
- [x] نام ثابت و readonly کالا بدون datalist
- [x] جمع مبلغ زنده با delegated listener
- [x] visibility قطعی جمع مبلغ در موبایل
- [x] edit/delete ردیف کالا فقط مدیر
- [x] privacy فعالیت لحظه‌ای و نقشه آن
- [x] privacy مرخصی، مسیر، منزل، ماهانه و تارگت
- [x] privacy مستقیم v20 routes/targets
- [x] selector نماینده self-only بعد هر render/delete
- [x] ۴۷/۴۷ تست
- [ ] تأیید رفتار واقعی گوشی و حساب نماینده
## ۷۵) نسخه ۱۱.۳۴.۰
- [x] کادر بالای تارگت برای تعریف چندمسیره نماینده
- [x] multi استان/شهر/منطقه و cascade
- [x] حذف route fields از فرم کاربر بدون حذف داده
- [x] ماتریس ثابت کالاهای تارگت و تعداد عددی
- [x] قیمت/جمع پخش و داروخانه و جمع کل
- [x] گزارش همه نمایندگان به تفکیک کالا
- [x] کارت گزارش جدا برای هر نماینده با محقق/مانده
- [x] ترمیم HTML مرخصی
- [x] ویرایش/حذف منزل نماینده
- [x] منع افزودن عملیاتی به فیلدهای مرجع
- [x] حذف دائمی پیام قبلاً ثبت‌شده بعد جایگذاری
- [x] حذف نماینده غیرفعال از نمایش فعالیت
- [x] ۴۹/۴۹ تست
- [ ] تأیید UI واقعی target matrix و multi-select توسط کاربر
## ۷۶) نسخه ۱۱.۳۵.۰
- [x] فایل acceptance checklist دائمی و OFFICIAL_FILELIST
- [x] runtime ورود/اجرای واقعی همه اسکریپت‌ها با JSDOM
- [x] کشف root cause منوی ۲۷تبی و افزودن invoice به MENU_SECTIONS_LIST
- [x] اعلان عمومی وابسته به notify_all_users
- [x] پاسخ و تاریخچه thread پیام‌ها
- [x] Web Push VAPID/AES128GCM/subscribe/send/SW click
- [x] کلید فعال‌سازی اعلان دستگاه
- [x] رفع حلقه observer و سفیدشدن جایگذاری داروخانه
- [x] نماینده ثابت self-only با ظاهر ساده در منزل/پروفایل
- [x] ۵۴/۵۴ تست فعلی + runtime صفر خطا (پیش از ZIP دوباره اجرا شود)
- [ ] تأیید Push واقعی روی Android/iOS/Windows با اجازه Notification و Persistent Disk

## ۷۷) نسخه ۱۱.۳۶.۰
- [x] قفل ترتیب همه گروه‌های سفارش، شامل کادر بدون input داخلی
- [x] حفظ layout metadata هنگام پاک‌کردن فرم
- [x] مخفی‌ماندن قطعی و loop-safe پیام داروخانه پس از جایگذاری
- [x] اجرای واقعی setup مسیر نمایندگان در تارگت
- [x] عنوان فارسی builtinها و حذف شناسه‌های فنی دیداری
- [x] حذف دیداری فعالیت کاربران حذف‌شده
- [x] فعالیت نماینده فقط self حتی با مجوز قدیمی all-reps
- [x] ۵۵/۵۵ تست + runtime مرورگرمانند هدفمند
- [ ] تأیید نهایی ظاهر و رفتار با داده واقعی کاربر پس از استقرار

## ۷۸) نسخه ۱۱.۳۷.۰
- [x] backup خصوصی و manifest پیش از تغییر
- [x] حفظ state/meta/order/leave با sentinel runtime
- [x] fresh install بدون کاربران نمونه قدیمی
- [x] tombstone پایدار حذف کاربر
- [x] انتخاب delegated کارت داروخانه سفارش
- [x] pin فیلدهای route مدیر در تارگت
- [x] guard سراسری label فارسی builtin
- [x] privacy جدول و نقشه منزل مدیر/نماینده
- [x] دو فیلد مستقل از ساعت/تا ساعت
- [x] گیرنده اعلان plain select
- [x] فلش کشویی delegated و قابل کلیک
- [x] ۵۶/۵۶ تست + runtime مدیر/نماینده صفر خطا
- [ ] تأیید روی داده واقعی کاربر پس از استقرار

## ۷۹) نسخه ۱۱.۳۸.۰
- [x] endpoint cache-reset با Clear-Site-Data cache
- [x] auto health build mismatch در index/login
- [x] SW purge-all و network-only برای کد/HTML
- [x] build broadcast و auto rescue در crm-app
- [x] حفظ LocalStorage/IndexedDB/state sentinel
- [x] هدر واقعی HTML/SW/health
- [x] ۵۷/۵۷ تست + build/syntax/HTTP/runtime
- [x] commit محلی `2c4fe0b`
- [ ] reconnect GitHub App با Workflows/Refs permission؛ push/PR/merge/deploy هنوز مسدود با 403
- [ ] GitLab mirror پس از main push و secrets معتبر

## ۸۰) تحویل به چت جدید / GitHub review
- [x] ساخت GITHUB_REVIEW_HANDOFF.md
- [x] ثبت commit chain، branch و خطای 403
- [x] ثبت production health واقعی 11.20.0
- [x] مستندسازی مویرگی cache/data/CRM/SW/workflow/tests
- [x] افزودن فایل به OFFICIAL_FILELIST
- [x] اصلاح ابتدای README برای runtime واقعی
- [ ] پس از reconnect: push شاخه Arena، PR، checks، merge، GitLab mirror، Render و health 11.38.0

## ۸۱) نوبت ۶۱ — اندازه‌گیری مجدد و تأیید انتشار 11.38.0
- [x] خواندن چهار سند شروع (graph → handoff → checklist → handoff-prompt)
- [x] اندازه‌گیری Git/auth/remote: working tree clean، origin فقط main در f541301، GitHub App با API محدود
- [x] push موفق شاخه `arena/01a0262d-javad-test1` (بدون تغییر workflow در کامیت)
- [x] تلاش PR: رد صفر‌تفاوت (نوک شاخه == main → سورس از قبل merged)
- [x] checks ورک‌فلو روی f541301: build/test موفق
- [x] تعیین production واقعی کاربر: `https://javad-test1.onrender.com`
- [x] health دو بار مستقل: `11.38.0` (2026-08-21T21:24:15Z)
- [x] مشاهده redirect زنده cache-rescue: `/login?build=11.38.0&__crm_reload=...`
- [x] ZIP `namayandeelmi-v11.38.0.zip` ساخته/تأیید/تحویل
- [ ] GitLab mirror — ناشناخته (remote و لاگ خام در دسترس نیست)

## ۸۲) نوبت ۶۱ — ممیزی ۲۰ چت اخیر و همگام‌سازی کامل آرشیو
- [x] استخراج پرامپت‌های نوبت ۴۱ تا ۶۰ از chat.arena (بخش ۸)
- [x] ممیزی با ۲۲ نشانگر کد: همه نسخه‌های 11.23.0 تا 11.38.0 در سورس حاضرند
- [x] 58/58 تست + syntax همه JS + build + diff-check موفق
- [x] تصمیم: بدون تغییر کد، نسخه برنامه 11.38.0 می‌ماند (bump ساختگی ممنوع)
- [x] ثبت قانون ۹۱ AI_RULES (همگام‌سازی ۱۵ فایل آرشیو در هر چت) + تأکید دوباره قانون ZIP
- [x] به‌روزرسانی GITHUB_REVIEW_HANDOFF/AI_ACCEPTANCE_CHECKLIST/AI_DECISION_LOG/AI_TASKS/AI_PROJECT_CONTEXT/ARENA_HANDOFF_PROMPT/CHANGES_V11/README
- [x] به‌روزرسانی قالب update_project_graph.py و بازسازی PROJECT_GRAPH.md
- [x] افزودن نوبت ۶۱ به update_chat_arena.py و بازسازی chat.arena 1.56
- [x] بازسازی ZIP نهایی و تحویل کنار صفحه

## ۸۳) نوبت ۶۲ — قانون جزبه‌جز و راستی‌آزمایی کامل پرامپت بلند کاربر
- [x] شکستن پرامپت کاربر به ۲۱ بند مستقل شماره‌دار
- [x] ثبت قانون دائمی ۹۲ در AI_RULES (اجرا جزبه‌جز + ورود خودکار قبل از ZIP + بلوک دستور پایان چت)
- [x] راستی‌آزمایی هر بند با شواهد کد (خط‌های واقعی v20/crm-app/index.html)
- [x] ورود خودکار به برنامه: سرور واقعی + app-smoke ۴/۴ + مجموع ۵۸/۵۸
- [x] نتیجه: صفر بند معلق؛ بدون تغییر کد؛ نسخه 11.38.0 ثابت
- [x] به‌روزرساری ۱۵ فایل آرشیوی + بازسازی graph/chat + ZIP + سرور دانلود پورت 8000

## ۸۴) نوبت ۶۴ — تعویض دامنه قدیمی و 11.38.1
- [x] شفاف‌سازی کاربر + اثبات زنده کد 11.38 روی سرویس فعال
- [x] grep کامل دامنه قدیمی؛ تبدیل ۱۰ فایل؛ صفر رد باقی‌مانده
- [x] اصلاح keep_alive به سرویس فعال
- [x] ارتقای 11.38.1 + همگام‌سازی ۶ فایل نسخه + انتظارات تست
- [x] 58/58 + syntax + app-smoke 4/4
- [x] آرشیوها/graph/chat 1.57 + ZIP 11.38.1 + سرور دانلود
- [ ] push کاربر → دیپلوی → health 11.38.1

## ۸۵) نوبت ۶۵ — نسخه 11.39.0
- [x] ترتیب کانونی فرم سفارشات (تاریخ اول) + مهاجرت یک‌باره V2
- [x] داینامیک: apiEndpointUrl/diag host/API_BASE موبایل
- [x] سنجش کارایی (1.34MB خام → 327KB gzip) + علت خواب سرویس + UptimeRobot
- [x] تأیید تارگت به تفکیک کالا و قانون اعداد لاتین با سند کد
- [x] تست رگرسیون جدید + 59/59 + app-smoke 4/4
- [x] آرشیوها/graph/chat/ZIP 11.39.0 + سرور دانلود
- [ ] push کاربر → دیپلوی → health 11.39.0

## ۸۶) نوبت ۶۷ — نسخه 11.40.0
- [x] ریشه‌یابی چهار گزارش زنده + اصلاح واقعی در v20 (چهار موتور جدید)
- [x] تست رگرسیون هشت‌ادعایی جدید؛ 60/60؛ app-smoke 4/4
- [x] آرشیوها/graph/chat 1.59 + ZIP 11.40.0 + سرور دانلود
- [ ] push کاربر → دیپلوی → تأیید چشمی

## ۸۷) نوبت ۸۰ — نسخه 11.61.0: بستن حلقه‌های خودتغذی MutationObserver سه تب
- [x] بازتولید با سنجش واقعی: طوفان ~۲هزار جهش DOM در ثانیه در تب سفارشات (حتی پنهان) کشف شد
- [x] پنج وصله idempotent/structural در crm-bundle.js + آینه در crm-features-v20.js
- [x] تست رگرسیون جدید پنج‌قفلی + همگام‌سازی انتظارات نسخه؛ ۸۲/۸۲ تست سبز
- [x] راستی‌آزمایی End-to-End: انتخاب کشویی، فیلتر تایپی، تایپ فارسی، پیام اعتبارسنجی، جهش بیکار = ۰
- [x] آرشیوها/graph/chat بازسازی؛ پیش‌نمایش 11.61.0 پورت 8000؛ ZIP تحویل شد
- [ ] push کاربر → دیپلوی → health 11.61.0 و صحت چشمی سه تب

## ۸۸) نوبت ۸۱ — نسخه 11.62.0
- [x] نام داروخانه/پزشک فیلد ساده + افزودن لحظه‌ای فقط دو تب + پلاک/طبقه بیرون از کادر درصد
- [x] تست رگرسیون جدید + ۸۳/۸۳
- [x] آرشیوها/graph/chat/ZIP 11.62.0
- [ ] push کاربر → دیپلوی → health 11.62.0

## ۸۹) نوبت ۸۲ — نسخه 11.63.0
- [x] نام ساده + حذف instant-add متنی + گرید ۳ستونه + لیست داروخانه سفارشات
- [x] ۸۴/۸۴ تست + ZIP
- [ ] push کاربر

## ۹۰) نوبت ۸۳ — 11.64.0
- [x] قفل چیدمان + نام ساده + جستجوی لحظه‌ای سفارشات
- [ ] push کاربر

## ۹۱) نوبت ۸۴ — 11.65.0 یکپارچگی داده + فیلدهای سفارشات
- [x] انجام شد
- [ ] push

## ۹۲) نوبت ۸۵ — 11.66.0 مسیر و تارگت پخش
- [x] انجام شد
- [ ] push

## ۹۳) نوبت ۸۶ — فرمت ZIP ویندوز (بدون bump نسخه)
- [x] بازسازی ZIP به‌صورت PKZIP ویندوز (create_system=0)
- [x] صفحه دانلود فارسی پورت 8000 با attachment + HEAD
- [x] آرشیوها/graph/chat 1.67
- [ ] push کاربر → health 11.66.0

## ۹۴) نوبت ۸۷ — 11.67.0 عرض/ارتفاع + ویرایش تارگت + همگام زنده
- [x] اعمال واقعی size/height
- [x] ویرایش/حذف سطر تارگت و مسیر
- [x] همگام‌سازی زنده سرور
- [ ] push کاربر


## ۹۵) نوبت ۸۸ — 11.68.0 ویرایش/حذف پایدار تارگت + فاصله میلی‌متری و شماره سطر
- دکمه‌های ویرایش/حذف تارگت و مسیر کار می‌کنند و بعد از ذخیره تارگت جدید پنهان نمی‌شوند.
- سه کنترل جدید در طراح ستون‌ها: فاصله قبلی، فاصله بعدی (میلی‌متر)، شماره سطر.

## 11.69.0 / نوبت ۸۹
سرور منبع حقیقت است؛ حذف با _deletedIds روی ادغام اعمال می‌شود؛ رکوردهای هم‌نام ادغام می‌شوند؛ poll سبک ۲۵ثانیه؛ ویرایش/حذف تارگت و فاصله/سطر زنده.

## 11.70.0 / نوبت ۹۰
حلقه cache-reset قطع شد. سرور فقط اطلاعات همین دستگاه را نگه می‌دارد (_soloOnly / replace).

## 11.71.0 / نوبت ۹۱
اسکریپت یک‌بار؛ ۴۰۴ بدون login.html؛ سرور فقط داده همین دستگاه.

## 11.72.0 / نوبت ۹۲
سرور اول؛ حذف فلش تعداد؛ ویرایش/حذف پایدار روی هر سطر؛ تارگت پخش با محقق/مانده و کادر جمع.
- [ ] push کاربر → health=11.72.0

## 11.73.0 / نوبت ۹۳
یک state زنده؛ پرده تا سرور؛ حذف ریشه دادهٔ سیستم‌های دیگر؛ ویرایش/حذف پایدار؛ ذخیره تارگت پخش.
- [ ] push کاربر → health=11.73.0
- [ ] اگر origin/main هنوز تاریخچه جداست: git push origin HEAD:main --force

## 11.74.0 / نوبت ۹۴
گزارش فروش مشاطب مانند دایا و شفاآراد.
- [ ] push کاربر → health=11.74.0

## 11.75.0 / نوبت ۹۵
طراح ستون‌ها، Autofill جغرافیا، دیتابیس پخش ویرایش/حذف، تاریخ مشاطب، تکراری نام+مکان.
- [ ] push کاربر → health=11.75.0

## 11.78.0
قیمت مصرف‌کننده، مارژین قانونی (to-from)/to، ویرایش VAT هر سطر، طراح زنده بدون به‌هم‌ریختن سفارشات، اعمال لحظه‌ای ذخیره بدون رفرش.

## 11.79.0
فقط اطلاعات همین دستگاه؛ ستون تکراری کد کالا حذف شد؛ پاکسازی فایل اضافی در بلوک پاورشل پایان چت.

## 11.80.0
قفل ورود داده قبلی، unify روی سرور، مصرف‌کننده کادر جدید از فعلی و درصد افزایش.
- [ ] push کاربر → health=11.80.0

## 11.81.0
پاکسازی نسل قبل + فرمول مصرف‌کننده کادر جدید.
- [ ] push کاربر → health=11.81.0

## 11.82.0
اعمال ترتیب/اندازه طراح روی فرم و لیست واقعی.
- [ ] push کاربر → health=11.82.0

## 11.83.0
پرش تایپ داروخانه/پزشک، موبایل ایران، حذف download html قدیمی.
- [ ] push کاربر → health=11.83.0

## 11.84.0
داشبورد فیلتردار، توقف پرش تایپ، قفل ترتیب سفارشات.
- [ ] push کاربر → health=11.84.0

## 11.85.0
مسیر، جغرافیا، داشبورد.
- [ ] push کاربر → health=11.85.0

## 11.89.0
توقف wipe داروخانه، مسیر، موبایل.
- [ ] push کاربر → health=11.89.0 و force main برای Render موبایل

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
