#!/usr/bin/env node
/**
 * .agent/watcher.mjs — Claude/Codex orchestrator (the missing "daemon").
 *
 * Two chat agents cannot push from OneDrive or invoke each other, so the human
 * has had to nudge between phases. This watcher is the external process that
 * closes that gap: it polls git + .agent/tasks.json and, on each state change,
 * either RUNS the configured agent/push commands (full-auto) or PRINTS exactly
 * what action is needed and writes .agent/ACTION_NEEDED.md (notify-only).
 *
 * Run it OUTSIDE the chat session, ideally from a NON-OneDrive clone so it can
 * push (the OneDrive mmap bug only affects the synced copy):
 *
 *   node .agent/watcher.mjs
 *
 * Env config (all optional — unset = notify-only, which is safe):
 *   POLL_SECONDS   poll interval (default 120)
 *   REMOTE         git remote (default "origin"); branch assumed "main"
 *   AUTO_PUSH=1    push local commits ahead of origin/main automatically
 *   CODEX_CMD      shell command to invoke Codex headless to audit; receives
 *                  the task ids needing review as $TASK_IDS (e.g. a codex CLI -p)
 *   CLAUDE_CMD     shell command to invoke Claude headless to fix rework; gets
 *                  $TASK_IDS (e.g. `claude -p "fix rework_required tasks"`)
 *
 * It never invents work: with no CODEX_CMD/CLAUDE_CMD/AUTO_PUSH it only reports.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POLL = Number(process.env.POLL_SECONDS || 120) * 1000;
const REMOTE = process.env.REMOTE || "origin";
const { AUTO_PUSH, CODEX_CMD, CLAUDE_CMD } = process.env;

const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const shLoud = (cmd, env = {}) => execSync(cmd, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
const ts = () => new Date().toISOString();

function readTasks() {
  try {
    return JSON.parse(readFileSync(join(ROOT, ".agent", "tasks.json"), "utf8")).tasks || [];
  } catch {
    return [];
  }
}

function assess() {
  try { sh(`git fetch ${REMOTE} --quiet`); } catch (e) { return { error: `git fetch failed: ${e.message}` }; }
  const branch = sh("git branch --show-current");
  const dirty = sh("git status --porcelain");
  const behind = Number(sh(`git rev-list --count HEAD..${REMOTE}/main`) || "0");
  if (branch === "main" && behind > 0 && !dirty) {
    try { sh(`git merge --ff-only ${REMOTE}/main --quiet`); } catch (e) { return { error: `git fast-forward failed: ${e.message}` }; }
  }
  const ahead = Number(sh(`git rev-list --count ${REMOTE}/main..HEAD`) || "0");
  const tasks = readTasks();
  // Review work is not content-only. Fable/Claude file app, infra, fix, and
  // feature tasks too; filtering to `type === "content"` made the watcher look
  // idle while non-content work was waiting on Codex.
  const needsReview = tasks
    .filter((t) => t.status === "needs_review" && /codex/i.test(String(t.reviewer || "")))
    .map((t) => t.id);
  const rework = tasks.filter((t) => t.status === "rework_required").map((t) => t.id);
  return { ahead, needsReview, rework };
}

function actionString(s) {
  const parts = [];
  if (s.ahead > 0) parts.push(`PUSH: ${s.ahead} local commit(s) not on ${REMOTE}/main`);
  if (s.needsReview.length) parts.push(`CODEX AUDIT: ${s.needsReview.join(", ")}`);
  if (s.rework.length) parts.push(`CLAUDE FIX: ${s.rework.join(", ")}`);
  return parts.join("  |  ");
}

let last = "";
function tick() {
  const s = assess();
  if (s.error) { console.error(`[${ts()}] ${s.error}`); return; }
  const action = actionString(s);
  const summary = action || "idle — nothing pending";
  if (summary !== last) {
    console.log(`[${ts()}] ${summary}`);
    writeFileSync(join(ROOT, ".agent", "ACTION_NEEDED.md"), `# Action needed (updated ${ts()})\n\n${action ? "- " + action.split("  |  ").join("\n- ") : "Nothing pending — all caught up."}\n`);
    last = summary;
  }
  // Full-auto hooks (only if configured)
  try {
    if (s.ahead > 0 && AUTO_PUSH === "1") {
      console.log(`[${ts()}] pushing ${s.ahead} commit(s) -> ${REMOTE}/main`);
      shLoud(`git push ${REMOTE} HEAD:main`);
    }
    if (s.rework.length && CLAUDE_CMD) {
      console.log(`[${ts()}] invoking CLAUDE_CMD for: ${s.rework.join(", ")}`);
      shLoud(CLAUDE_CMD, { TASK_IDS: s.rework.join(",") });
    } else if (s.needsReview.length && s.ahead === 0 && CODEX_CMD) {
      // Only audit once the work is actually on the remote.
      console.log(`[${ts()}] invoking CODEX_CMD for: ${s.needsReview.join(", ")}`);
      shLoud(CODEX_CMD, { TASK_IDS: s.needsReview.join(",") });
    }
  } catch (e) {
    console.error(`[${ts()}] auto-action failed: ${e.message}`);
  }
}

console.log(`[${ts()}] watcher started (poll ${POLL / 1000}s, remote ${REMOTE}, auto-push ${AUTO_PUSH === "1"}, codex ${!!CODEX_CMD}, claude ${!!CLAUDE_CMD})`);
tick();
setInterval(tick, POLL);
