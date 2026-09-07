# -*- coding: utf-8 -*-
"""صفحهٔ دانلودِ ZIP — پورت ۸۰۰۰ (قانون ۶۴+۹۳): لینکِ مستقیمِ /zip با Content-Disposition: attachment
   هر بار که فایلِ زیپِ تازه ساخته شود، همین سرور همانِ فایلِ تازه را می‌دهد (خواندن در هر درخواست)."""
import http.server
import os
import re
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8000
VER = "12.18.3"
ZIP_NAME = "namayandeelmi-v%s.zip" % VER
ZIP_PATH = os.path.join(ROOT, ZIP_NAME)


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        if self.path in ("/zip", "/download", "/" + ZIP_NAME):
            if not os.path.isfile(ZIP_PATH):
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"zip missing")
                return
            data = open(ZIP_PATH, "rb").read()
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Content-Disposition", "attachment; filename=\"%s\"" % ZIP_NAME)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            try:
                self.wfile.write(data)
            except BrokenPipeError:
                pass
            return
        size = "-"
        if os.path.isfile(ZIP_PATH):
            size = "{:,} بایت".format(os.path.getsize(ZIP_PATH))
        html = (
            "<!doctype html><html dir='rtl' lang='fa'><meta charset='utf-8'>"
            "<meta name='viewport' content='width=device-width,initial-scale=1'>"
            "<title>دانلود ZIP — نسخه %s</title>"
            "<style>body{font:15px/2 Tahoma,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}"
            ".card{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px 34px;max-width:560px;text-align:center}"
            "a.btn{display:inline-block;background:#0d9488;color:#fff;font-weight:800;padding:12px 34px;border-radius:10px;text-decoration:none;margin-top:12px}"
            "a.btn:hover{background:#0f766e}.muted{color:#94a3b8;font-size:12px}</style>"
            "<div class='card'><h1>📦 نماینده علمی — نسخه %s</h1>"
            "<p>زیپِ کاملِ سورسِ همین نسخه (درختِ ریپو + chat.arena) — استانداردِ ویندوز، بدونِ node_modules.</p>"
            "<p class='muted'>حجم: %s</p>"
            "<a class='btn' href='/zip' download='%s'>⬇ دانلود ZIP</a>"
            "<p class='muted'>ذخیره در پوشهٔ Downloads، سپس Extract All و جایگزینی روی هاست (نت‌افراز) یا آپلود به ریپو.</p>"
            "</div></html>"
        ) % (VER, VER, size, ZIP_NAME)
        body = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("0.0.0.0", PORT), Handler) as httpd:
        print("zip server on :%d -> %s" % (PORT, ZIP_PATH))
        httpd.serve_forever()
