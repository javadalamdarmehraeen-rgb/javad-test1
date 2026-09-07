# -*- coding: utf-8 -*-
"""ZIP تحویلی نسخه 12.18.4 — قانون GITHUB_REVIEW_HANDOFF:
   - زیپ استاندارد PKZIP با create_system=0 (ویندوز اکسپلورر بدونِ هشدارِ مجوزهایِ لینوکس بازش کند)
   - دقیقاً درختِ گیت + chat.arena — بدونِ node_modules و بدونِ فایل‌هایِ حساس (§5.4)
   - نام: namayandeelmi-v{VER}.zip در ریشه‌ی ورک‌اسپیس
"""
import io
import os
import subprocess
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
VER = "12.18.4"
OUT = os.path.join(ROOT, "namayandeelmi-v%s.zip" % VER)

FORBID = (
    "node_modules/", ".git/", "dist/", "build/", ".next/", "coverage/",
)
FORBID_EXACT = {
    "server-db.json", "public/server-db.json", "public/user-data.json",
    "public/user-bulk-data.json", "public/push-subscriptions.json", "public/push-vapid.json",
    "public/crm-live-data.json", "public/crm-live-bulk.json", "public/crm-netafraz-data.json",
    "public/crm-netafraz-bulk.json", "public/.env", ".env", "data/user-data.json",
}

def rel_list():
    r = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True)
    files = [f for f in r.stdout.decode("utf-8").split("\0") if f]
    if os.path.exists(os.path.join(ROOT, "chat.arena")) and "chat.arena" not in files:
        files.append("chat.arena")
    return sorted(set(files))

def allowed(rel):
    if any(rel.startswith(p) for p in FORBID):
        return False
    if rel in FORBID_EXACT:
        return False
    if rel.endswith(".zip") or rel.endswith(".env"):
        return False
    return True

def main():
    files = [f for f in rel_list() if allowed(f)]
    if os.path.exists(OUT):
        os.remove(OUT)
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for rel in files:
            full = os.path.join(ROOT, rel)
            if not os.path.isfile(full):
                continue
            data = io.open(full, "rb").read()
            info = zipfile.ZipInfo(rel, date_time=(2026, 9, 6, 12, 0, 0))
            info.create_system = 0            # ← قانونِ ویندوز: DOS/PKZIP
            info.external_attr = 0o666 << 16  # بدونِ x-bitهایِ یونیکس
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data)
    print("ZIP:", OUT, os.path.getsize(OUT), "bytes,", len(files), "files")

if __name__ == "__main__":
    main()
