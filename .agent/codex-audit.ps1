$ErrorActionPreference = "Stop"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
$taskIds = $env:TASK_IDS
if ([string]::IsNullOrWhiteSpace($taskIds)) {
  Write-Host "No TASK_IDS provided; nothing to audit."
  exit 0
}

$prompt = @"
You are Codex running the Accountrix audit loop.

Repository: $repo
Task ids to audit: $taskIds

For each listed task id:
1. Read .agent/tasks.json and the task's listed files.
2. Run:
   - npm.cmd run build:cpa-curriculum
   - npm.cmd run validate:content
   - npm.cmd run type-check
3. Audit the content, not just the schema:
   - verify every quiz answer key;
   - verify worked examples/math;
   - verify accounting/audit/tax accuracy for the unit;
   - reject with exact file:line findings if anything is wrong.
4. Update .agent/tasks.json, .agent/events.jsonl, and REVIEW_QUEUE_CODEX.md:
   - status approved when fully correct;
   - status rework_required with concrete findings when not.
5. Commit the audit verdict and push to origin main.

Do not author new lessons. Do not force-push. Do not edit unrelated files.
"@

$prompt | codex exec --cd "$repo" --sandbox danger-full-access --ask-for-approval never -
