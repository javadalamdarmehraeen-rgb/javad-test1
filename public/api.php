<?php
/**
 * API نت‌افراز بدون Node — برنامه روی هاست اشتراکی مستقل از Render کار می‌کند.
 * همگام‌سازی با Render فقط اگر BASE_URL در api-config.php باشد و شبکه وصل باشد.
 */
header("X-Content-Type-Options: nosniff");
$origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";
if ($origin) {
  header("Access-Control-Allow-Origin: " . $origin);
  header("Vary: Origin");
}
header("Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CRM-Request, X-CRM-Replace, X-CRM-Sync, X-CRM-Hub-Sync, X-CRM-Build, Cache-Control");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

function cfg() {
  $f = __DIR__ . "/api-config.php";
  if (is_file($f)) {
    $c = include $f;
    if (is_array($c)) return $c;
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
function write_json($file, $data) {
  $tmp = $file . ".tmp";
  $ok = @file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
  if ($ok === false) return false;
  return @rename($tmp, $file);
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
function push_render($data) {
  $c = cfg();
  $base = isset($c["baseUrl"]) ? rtrim($c["baseUrl"], "/") : "";
  if ($base === "") return;
  $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
  $ctx = stream_context_create(array(
    "http" => array(
      "method" => "POST",
      "header" => "Content-Type: application/json\r\nX-CRM-Request: 1\r\nX-CRM-Hub-Sync: 1\r\n",
      "content" => $payload,
      "timeout" => 8,
      "ignore_errors" => true
    )
  ));
  @file_get_contents($base . "/api/state", false, $ctx);
}
function pull_render() {
  $c = cfg();
  $base = isset($c["baseUrl"]) ? rtrim($c["baseUrl"], "/") : "";
  if ($base === "") return null;
  $ctx = stream_context_create(array("http" => array("timeout" => 6, "ignore_errors" => true)));
  $raw = @file_get_contents($base . "/api/state", false, $ctx);
  if ($raw === false || $raw === "") return null;
  $j = json_decode($raw, true);
  if (!is_array($j)) return null;
  if (isset($j["data"]) && is_array($j["data"])) return $j["data"];
  return $j;
}

$DATA = __DIR__ . "/crm-netafraz-data.json";
$BULK = __DIR__ . "/crm-netafraz-bulk.json";
$p = path_info();
$method = $_SERVER["REQUEST_METHOD"];

if ($p === "health" || $p === "ping" || $p === "healthz" || $p === "") {
  send_json(array(
    "ok" => true,
    "status" => "healthy",
    "message" => "OK",
    "service" => "namayandeelmi-netafraz",
    "version" => "11.95.0",
    "platform" => "static-php",
    "host" => isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : ""
  ));
}
if ($p === "runtime-config") {
  $c = cfg();
  send_json(array(
    "platform" => "static-php",
    "baseUrl" => isset($c["baseUrl"]) ? $c["baseUrl"] : "",
    "hubs" => isset($c["hubs"]) ? $c["hubs"] : array(),
    "version" => "11.95.0"
  ));
}
if ($p === "backup/status") {
  send_json(array("status" => "ok", "cloud" => false, "local" => is_file($DATA), "platform" => "static-php"));
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
if (strpos($p, "state") === 0) {
  if ($method === "GET") {
    $local = read_json($DATA);
    $remote = pull_render();
    if ($remote && is_array($remote)) {
      $remote = strip_sample($remote);
      if ($local && is_array($local)) {
        foreach (array("pharmacies","doctors","orders","users","products") as $k) {
          $local[$k] = merge_by_id(isset($local[$k])?$local[$k]:array(), isset($remote[$k])?$remote[$k]:array());
        }
      } else {
        $local = $remote;
      }
      write_json($DATA, $local);
    }
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
    push_render($incoming);
    send_json(array("status" => "success", "data" => $incoming));
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
send_json(array("status" => "error", "message" => "not found", "path" => $p), 404);
