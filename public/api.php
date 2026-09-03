<?php
/**
 * API نت‌افراز بدون Node — برنامه روی هاست اشتراکی مستقل از Render کار می‌کند.
 * ذخیره همیشه محلی است. ارسال به رندر با POST /api/state و GET/POST /api/sync?target=render.
 * GET /api/state فقط فایل محلی crm-live-data.json را می‌خواند و منتظر رندر نمی‌ماند.
 * POST فوری پاسخ می‌دهد (queued) و بعد در پس‌زمینه به رندر می‌فرستد.
 */
header("X-Content-Type-Options: nosniff");
/* v12.13: HSTS فقط روی درخواست HTTPS (بدون preload) */
$isHttps = (!empty($_SERVER["HTTPS"]) && strtolower($_SERVER["HTTPS"]) !== "off")
  || (isset($_SERVER["HTTP_X_FORWARDED_PROTO"]) && strtolower(strval($_SERVER["HTTP_X_FORWARDED_PROTO"])) === "https");
if ($isHttps) header("Strict-Transport-Security: max-age=15552000; includeSubDomains");
$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";
$allow = array(
  "https://javad-test1.onrender.com",
  "https://mehraeinpharma.ir", "https://www.mehraeinpharma.ir",
  "https://ndcohub.com", "https://www.ndcohub.com",
  "https://ndcohub.ir"
);
if ($origin && in_array($origin, $allow, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
} else {
  header("Access-Control-Allow-Origin: https://javad-test1.onrender.com");
}
header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CRM-Request, X-CRM-Replace, X-CRM-Sync, X-CRM-Hub-Sync, X-CRM-Build, Cache-Control");
header("Access-Control-Max-Age: 86400");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

define("CRM_DEFAULT_RENDER", "https://javad-test1.onrender.com");
define("CRM_APP_VERSION", "12.15.0");

/* v12.12: همگام سه دامنه — رندر + دو دامنه نت‌افراز */
function peer_hosts() {
  $def = array("https://javad-test1.onrender.com", "https://mehraeinpharma.ir", "https://ndcohub.com");
  $cfg = cfg();
  if (!empty($cfg["hubs"]) && is_array($cfg["hubs"])) {
    foreach ($cfg["hubs"] as $h) { if (is_string($h) && $h !== "" && !in_array($h, $def, true)) $def[] = $h; }
  }
  $self = isset($_SERVER["HTTP_HOST"]) ? strtolower(preg_replace('/:\d+$/', "", $_SERVER["HTTP_HOST"])) : "";
  $self = preg_replace('/^www\./', "", $self);
  $out = array();
  foreach ($def as $d) {
    $h = strtolower((string) parse_url($d, PHP_URL_HOST));
    if (!$h) continue;
    if ($h === $self || preg_replace('/^www\./', "", $h) === $self) continue;
    if (preg_match('/^ndcohub\.ir$/', preg_replace('/^www\./', "", $h))) continue; /* گواهی نامعتبر دامنه قدیمی */
    if (!in_array($d, $out, true)) $out[] = $d;
  }
  return $out;
}
function merge_state($a, $b) {
  if (!is_array($a)) $a = array();
  if (!is_array($b)) $b = array();
  $keys = array("pharmacies", "doctors", "orders", "reps", "products", "visits", "hospitals", "leaves", "salesTargets", "repHomes", "repRoutes", "activityLog", "notifications", "users");
  foreach ($keys as $k) {
    if (!isset($b[$k]) || !is_array($b[$k]) || !count($b[$k])) continue;
    $a[$k] = merge_by_id(isset($a[$k]) ? $a[$k] : array(), $b[$k]);
  }
  if (!isset($a["settings"]) || !is_array($a["settings"])) $a["settings"] = isset($b["settings"]) && is_array($b["settings"]) ? $b["settings"] : array();
  return $a;
}
function sync_all_peers($force) {
  /* v12.13: مهارِ بار — هاست اشتراکی با انبوه درخواست ۵۰۳ می‌داد */
  $lock = sys_get_temp_dir() . "/crm_sync_" . md5(__DIR__) . ".lock";
  if (!$force) {
    $age = is_file($lock) ? (time() - intval(@file_get_contents($lock))) : 9999;
    if ($age < 20) {
      return array("throttled" => true, "retryAfter" => 20 - $age, "peers" => peer_hosts(), "reached" => 0);
    }
  }
  @file_put_contents($lock, strval(time()));
  $peers = peer_hosts();
  $local = read_json($GLOBALS["CRM_DATA_FILE"]);
  $merged = is_array($local) ? $local : array();
  $reached = 0;
  $report = array();
  foreach ($peers as $purl) {
    $res = http_json("GET", $purl . "/api/state", null);
    if (empty($res["ok"]) || empty($res["raw"])) { $report[] = array("target" => $purl, "ok" => false); continue; }
    $j = json_decode($res["raw"], true);
    if (!is_array($j)) { $report[] = array("target" => $purl, "ok" => false); continue; }
    $remote = isset($j["data"]) && is_array($j["data"]) ? $j["data"] : $j;
    $remote = strip_sample($remote);
    if (hollow_state($remote)) { $report[] = array("target" => $purl, "ok" => true, "ignored" => "empty-rejected"); continue; }
    $reached++;
    $merged = merge_state($merged, $remote);
    $report[] = array("target" => $purl, "ok" => true, "pulled" => true);
  }
  $pushed = array();
  if ($reached > 0 || (is_array($local) && !hollow_state($local))) {
    if (!hollow_state($merged)) {
      $merged = stamp_gen($merged);
      write_json($GLOBALS["CRM_DATA_FILE"], $merged);
      foreach ($peers as $purl) {
        $pr = http_json("POST", $purl . "/api/state", json_encode($merged, JSON_UNESCAPED_UNICODE));
        $pushed[] = array("target" => $purl, "ok" => !empty($pr["ok"]), "http" => isset($pr["code"]) ? $pr["code"] : 0);
      }
    }
  }
  return array("peers" => $peers, "reached" => $reached, "pull" => $report, "push" => $pushed, "records" => array(
    "pharmacies" => isset($merged["pharmacies"]) ? count($merged["pharmacies"]) : 0,
    "doctors" => isset($merged["doctors"]) ? count($merged["doctors"]) : 0,
    "orders" => isset($merged["orders"]) ? count($merged["orders"]) : 0,
  ));
}

function cfg() {
  $jf = __DIR__ . "/api-config.json";
  if (is_file($jf)) {
    $j = json_decode(@file_get_contents($jf), true);
    if (is_array($j)) return $j;
  }
  $f = __DIR__ . "/api-config.php";
  if (is_file($f)) {
    $raw = @file_get_contents($f);
    if ($raw !== false && strpos($raw, "array(") !== false) {
      $c = @include $f;
      if (is_array($c)) return $c;
    }
  }
  return array("baseUrl" => "", "hubs" => array());
}
function path_info() {
  if (!empty($_GET["path"])) return trim($_GET["path"], "/");
  $u = parse_url(isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : "/", PHP_URL_PATH);
  $u = preg_replace('#^/api/#', "", $u);
  return trim($u, "/");
}
function read_json($file) {
  if (!is_file($file)) return null;
  $raw = @file_get_contents($file);
  if ($raw === false || $raw === "") return null;
  $j = json_decode($raw, true);
  return is_array($j) ? $j : null;
}
function ensure_dir($file) {
  $d = dirname($file);
  if ($d && !is_dir($d)) @mkdir($d, 0775, true);
}
function write_json($file, $data) {
  ensure_dir($file);
  $json = json_encode($data, JSON_UNESCAPED_UNICODE);
  $tmp = $file . ".tmp";
  $ok = @file_put_contents($tmp, $json, LOCK_EX);
  if ($ok !== false && @rename($tmp, $file)) return true;
  return @file_put_contents($file, $json, LOCK_EX) !== false;
}
function send_json($arr, $code = 200) {
  http_response_code($code);
  header("Content-Type: application/json; charset=utf-8");
  header("Cache-Control: no-store");
  echo json_encode($arr, JSON_UNESCAPED_UNICODE);
  exit;
}
function too_empty($incoming, $existing) {
  if (!$existing || !is_array($existing)) return false;
  $keys = array("pharmacies", "doctors", "orders");
  foreach ($keys as $k) {
    $old = isset($existing[$k]) && is_array($existing[$k]) ? count($existing[$k]) : 0;
    $neu = isset($incoming[$k]) && is_array($incoming[$k]) ? count($incoming[$k]) : 0;
    if ($old > 0 && $neu === 0) return true;
  }
  return false;
}
function hollow_state($data) {
  if (!$data || !is_array($data)) return true;
  $ph = isset($data["pharmacies"]) && is_array($data["pharmacies"]) ? count($data["pharmacies"]) : 0;
  $doc = isset($data["doctors"]) && is_array($data["doctors"]) ? count($data["doctors"]) : 0;
  $us = isset($data["users"]) && is_array($data["users"]) ? count($data["users"]) : 0;
  return $ph === 0 && $doc === 0 && $us <= 1;
}
function stamp_gen($data) {
  if (!is_array($data)) $data = array();
  $data["_dataGen"] = "11.81.0";
  $data["_schemaVersion"] = "11.81.0";
  if (empty($data["_purgedLegacyAt"])) $data["_purgedLegacyAt"] = round(microtime(true) * 1000);
  $data["_netafrazSyncAt"] = round(microtime(true) * 1000);
  $data["_netafrazVersion"] = CRM_APP_VERSION;
  return $data;
}
function render_base($allowDefault) {
  $c = cfg();
  $base = isset($c["baseUrl"]) ? rtrim(strval($c["baseUrl"]), "/") : "";
  if ($base === "" && $allowDefault) $base = CRM_DEFAULT_RENDER;
  return $base;
}
function http_json($method, $url, $body = null) {
  $headers = array(
    "Content-Type: application/json",
    "X-CRM-Request: 1",
    "X-CRM-Hub-Sync: 1",
    "X-CRM-Sync: v81",
    "X-CRM-Build: " . CRM_APP_VERSION
  );
  if (function_exists("curl_init")) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    if (strtoupper($method) === "POST") {
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $body === null ? "" : $body);
    }
    $raw = curl_exec($ch);
    $code = intval(curl_getinfo($ch, CURLINFO_HTTP_CODE));
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false) return array("ok" => false, "code" => $code, "error" => $err ?: "curl failed", "raw" => "");
    return array("ok" => ($code >= 200 && $code < 300), "code" => $code, "error" => $err, "raw" => $raw);
  }
  $hdr = implode("\r\n", $headers) . "\r\n";
  $opts = array(
    "http" => array(
      "method" => strtoupper($method),
      "header" => $hdr,
      "timeout" => 4,
      "ignore_errors" => true
    ),
    "ssl" => array("verify_peer" => true, "verify_peer_name" => true)
  );
  if (strtoupper($method) === "POST") $opts["http"]["content"] = $body === null ? "" : $body;
  $ctx = stream_context_create($opts);
  $raw = @file_get_contents($url, false, $ctx);
  $code = 0;
  if (isset($http_response_header) && is_array($http_response_header) && isset($http_response_header[0])) {
    if (preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) $code = intval($m[1]);
  }
  if ($raw === false) return array("ok" => false, "code" => $code, "error" => "file_get_contents failed (allow_url_fopen?)", "raw" => "");
  return array("ok" => ($code >= 200 && $code < 300) || ($code === 0 && $raw !== ""), "code" => $code, "error" => "", "raw" => $raw);
}
function push_render($data) {
  $base = render_base(true);
  if ($base === "") return array("ok" => false, "error" => "baseUrl not configured", "skipped" => true);
  if (!is_array($data)) return array("ok" => false, "error" => "no data", "skipped" => true);
  if (hollow_state($data)) return array("ok" => false, "error" => "too_empty", "skipped" => true, "reason" => "empty-rejected");
  $payload = json_encode(stamp_gen($data), JSON_UNESCAPED_UNICODE);
  $res = http_json("POST", $base . "/api/state", $payload);
  $decoded = null;
  if (!empty($res["raw"])) {
    $j = json_decode($res["raw"], true);
    if (is_array($j)) $decoded = $j;
  }
  return array(
    "ok" => !empty($res["ok"]),
    "target" => $base,
    "http" => isset($res["code"]) ? $res["code"] : 0,
    "error" => isset($res["error"]) ? $res["error"] : "",
    "result" => $decoded,
    "ignored" => is_array($decoded) && !empty($decoded["ignored"])
  );
}
function pull_render() {
  $base = render_base(true);
  if ($base === "") return null;
  $res = http_json("GET", $base . "/api/state", null);
  if (empty($res["ok"]) || empty($res["raw"])) return null;
  $j = json_decode($res["raw"], true);
  if (!is_array($j)) return null;
  if (isset($j["data"]) && is_array($j["data"])) return $j["data"];
  return $j;
}

$DATA_DIR = __DIR__; /* بدون پوشه — نت‌افراز فولدر آپلود نمی‌کند */
$DATA = $DATA_DIR . "/crm-live-data.json";
$GLOBALS["CRM_DATA_FILE"] = &$DATA;
$BULK = $DATA_DIR . "/crm-live-bulk.json";
if (!is_file($DATA) && is_file(__DIR__ . "/data/crm-live-data.json")) $DATA = __DIR__ . "/data/crm-live-data.json";
if (!is_file($BULK) && is_file(__DIR__ . "/data/crm-live-bulk.json")) $BULK = __DIR__ . "/data/crm-live-bulk.json";
/* crm-netafraz-data.json فایل قدیمی است و دیگر خوانده نمی‌شود */
function fill_if_empty($local, $file) {
  /* v12.06: مبنای داده نت‌افراز است؛ از رندر پر نمی‌شود */
  return $local;
}
$p = path_info();
$method = $_SERVER["REQUEST_METHOD"];

if ($p === "health" || $p === "ping" || $p === "healthz" || $p === "") {
  $c = cfg();
  send_json(array(
    "ok" => true,
    "status" => "healthy",
    "message" => "OK",
    "service" => "namayandeelmi-netafraz",
    "version" => CRM_APP_VERSION,
    "platform" => "static-php",
    "sync" => true,
    "baseUrl" => isset($c["baseUrl"]) ? $c["baseUrl"] : "",
    "hubs" => peer_hosts(),
    "host" => isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : ""
  ));
}
if ($p === "runtime-config") {
  $c = cfg();
  send_json(array(
    "platform" => "static-php",
    "baseUrl" => isset($c["baseUrl"]) ? $c["baseUrl"] : "",
    "hubs" => isset($c["hubs"]) ? $c["hubs"] : array(),
    "version" => CRM_APP_VERSION,
    "sync" => true
  ));
}
if ($p === "backup/status") {
  send_json(array("status" => "ok", "cloud" => false, "local" => is_file($DATA), "platform" => "static-php", "sync" => true));
}
function strip_sample($st) {
  if (!is_array($st)) return $st;
  $bad = array("ph-1"=>1,"ph-2"=>1,"ph-3"=>1,"doc-1"=>1,"doc-2"=>1,"ord-1"=>1,"u-2"=>1,"u-3"=>1,"u-4"=>1,"prod-1"=>1,"tgt-1"=>1);
  foreach (array("pharmacies","doctors","orders","users","reps") as $k) {
    if (!isset($st[$k]) || !is_array($st[$k])) continue;
    $st[$k] = array_values(array_filter($st[$k], function ($r) use ($bad) {
      if (!is_array($r)) return false;
      $id = isset($r["id"]) ? strval($r["id"]) : "";
      return !$id || empty($bad[$id]);
    }));
  }
  return $st;
}
function merge_by_id($a, $b) {
  $map = array();
  foreach (array_merge(is_array($a)?$a:array(), is_array($b)?$b:array()) as $r) {
    if (!is_array($r)) continue;
    $id = isset($r["id"]) ? strval($r["id"]) : md5(json_encode($r));
    $prev = isset($map[$id]) ? $map[$id] : null;
    $t = isset($r["_updatedAt"]) ? intval($r["_updatedAt"]) : 0;
    $pt = ($prev && isset($prev["_updatedAt"])) ? intval($prev["_updatedAt"]) : 0;
    if (!$prev || $t >= $pt) $map[$id] = $r;
  }
  return array_values($map);
}

if ($p === "sync" || strpos($p, "sync/") === 0) {
  $target = isset($_GET["target"]) ? strval($_GET["target"]) : "render";
  if (strpos($p, "sync/") === 0) {
    $rest = trim(substr($p, 5), "/");
    if ($rest !== "") $target = $rest;
  }
  if ($target === "all" || $target === "peers" || $target === "domains") {
    $force = isset($_GET["force"]) && strval($_GET["force"]) === "1";
    $r = sync_all_peers($force);
    send_json(array(
      "status" => "success",
      "message" => "three-domain sync (render + netafraz)",
      "version" => CRM_APP_VERSION,
      "synced" => $r
    ));
  }
  $local = read_json($DATA);
  if ($target === "render" || $target === "push") {
    if (!$local || !is_array($local) || hollow_state($local)) {
      $remote = pull_render();
      if ($remote && is_array($remote) && !hollow_state($remote)) {
        $local = stamp_gen($remote);
        write_json($DATA, $local);
        send_json(array("status" => "success", "message" => "filled from render", "pulled" => true, "data" => $local));
      }
      send_json(array("status" => "skipped", "message" => "no local data", "queued" => true));
    }
    $sync = push_render($local);
    if (!empty($sync["skipped"]) && isset($sync["error"]) && $sync["error"] === "too_empty") {
      send_json(array("status" => "skipped", "message" => "too_empty", "sync" => $sync));
    }
    if (empty($sync["ok"])) {
      send_json(array(
        "status" => "error",
        "message" => "render unavailable",
        "target" => isset($sync["target"]) ? $sync["target"] : render_base(true),
        "sync" => $sync
      ), 502);
    }
    send_json(array(
      "status" => "success",
      "message" => "synced to render",
      "target" => $sync["target"],
      "result" => isset($sync["result"]) ? $sync["result"] : null,
      "http" => $sync["http"]
    ));
  }
  if ($target === "pull" || $target === "netafraz") {
    $mode = isset($_GET["mode"]) ? strval($_GET["mode"]) : "";
    $remote = pull_render();
    if (!$remote) {
      send_json(array("status" => "error", "message" => "render unavailable", "target" => render_base(true)), 502);
    }
    $remote = strip_sample($remote);
    if (hollow_state($remote) || ($local && too_empty($remote, $local))) {
      send_json(array("status" => "success", "ignored" => true, "reason" => "empty-rejected", "data" => $local));
    }
    if ($mode === "replace" || !$local) {
      $local = stamp_gen($remote);
    } else {
      foreach (array("pharmacies","doctors","orders","users","products") as $k) {
        $local[$k] = merge_by_id(isset($local[$k])?$local[$k]:array(), isset($remote[$k])?$remote[$k]:array());
      }
      $local = stamp_gen($local);
    }
    write_json($DATA, $local);
    send_json(array("status" => "success", "message" => $mode === "replace" ? "replaced from render" : "pulled from render", "data" => $local));
  }
  send_json(array("status" => "error", "message" => "invalid target", "target" => $target), 400);
}

/* v12.13: پاک‌سازی ریشه — فقط فایل‌های داده‌ای که برنامه دیگر نمی‌خواند */
if ($p === "cleanup" || $p === "purge-legacy") {
  $removed = array();
  $legacy = array("crm-netafraz-data.json", "crm-netafraz-bulk.json", "server-db.json");
  foreach ($legacy as $fname) {
    $fp = __DIR__ . "/" . $fname;
    if (is_file($fp)) { if (@unlink($fp)) $removed[] = $fname; }
    $fp2 = __DIR__ . "/data/" . $fname;
    if (is_file($fp2)) { if (@unlink($fp2)) $removed[] = "data/" . $fname; }
  }
  send_json(array(
    "status" => "success",
    "message" => "legacy data files removed",
    "version" => CRM_APP_VERSION,
    "removed" => $removed,
    "kept" => array("crm-live-data.json", "crm-live-bulk.json")
  ));
}

if (strpos($p, "state") === 0) {
  if ($method === "GET") {
    $local = fill_if_empty(read_json($DATA), $DATA);
    send_json($local ? array("status" => "success", "data" => $local) : array("status" => "empty"));
  }
  if ($method === "POST") {
    $raw = file_get_contents("php://input");
    $incoming = json_decode($raw, true);
    if (!is_array($incoming)) send_json(array("status" => "error", "message" => "bad json"), 400);
    $existing = read_json($DATA);
    if (too_empty($incoming, $existing)) {
      send_json(array("status" => "success", "data" => $existing, "ignored" => true, "reason" => "empty-rejected"));
    }
    write_json($DATA, $incoming);
    header("Content-Type: application/json; charset=utf-8");
    header("Cache-Control: no-store");
    echo json_encode(array("status" => "success", "data" => $incoming, "sync" => array("queued" => true)), JSON_UNESCAPED_UNICODE);
    if (function_exists("fastcgi_finish_request")) {
      fastcgi_finish_request();
    } else {
      if (function_exists("ob_end_flush")) { @ob_end_flush(); }
      @flush();
    }
    push_render($incoming);
    exit;
  }
}
if (strpos($p, "bulk") === 0) {
  if ($method === "GET") {
    $b = read_json($BULK);
    send_json($b ? array("status" => "success", "data" => $b) : array("status" => "empty"));
  }
  if ($method === "POST") {
    $raw = file_get_contents("php://input");
    $incoming = json_decode($raw, true);
    if (!is_array($incoming)) send_json(array("status" => "error"), 400);
    write_json($BULK, $incoming);
    send_json(array("status" => "success"));
  }
}
if (strpos($p, "tiles/") === 0) {
  if (!preg_match('#^tiles/([0-9]+)/([0-9]+)/([0-9]+)#', $p, $tm)) {
    http_response_code(204);
    exit;
  }
  $z = $tm[1]; $x = $tm[2]; $y = $tm[3];
  $srcs = array(
    "https://tile.openstreetmap.de/" . $z . "/" . $x . "/" . $y . ".png",
    "https://tile.openstreetmap.org/" . $z . "/" . $x . "/" . $y . ".png"
  );
  foreach ($srcs as $src) {
    $ch = curl_init($src);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_USERAGENT, "namayandeelmi-tile/12.01");
    $bin = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($bin !== false && $code >= 200 && $code < 300 && strlen($bin) > 80) {
      header("Content-Type: image/png");
      header("Cache-Control: public, max-age=86400");
      echo $bin;
      exit;
    }
  }
  http_response_code(204);
  exit;
}
send_json(array("status" => "error", "message" => "not found", "path" => $p), 404);
