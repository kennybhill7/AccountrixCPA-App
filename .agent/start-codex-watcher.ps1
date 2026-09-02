$ErrorActionPreference = "Stop"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repo

$env:POLL_SECONDS = "60"
$env:AUTO_PUSH = "1"
$env:CODEX_CMD = "powershell -NoProfile -ExecutionPolicy Bypass -File .agent/codex-audit.ps1"

node .agent/watcher.mjs
