# Accountrix agent bridge protocol

This directory is the machine-readable handoff bridge for Claude, Codex, and any future orchestrator.

The app repo remains the source of truth. Do not use chat summaries as authoritative state when `.agent/tasks.json`, `.agent/events.jsonl`, Git commits, and CI disagree.

## Files

- `tasks.json` — current task queue and ownership state.
- `events.jsonl` — append-only activity log; one JSON object per line.
- `locks/` — optional short-lived lock files for external orchestrators. Human-driven chat agents should avoid creating locks unless they are actively editing the task state.

## Task lifecycle

Allowed statuses:

- `pending` — ready for an agent to pick up.
- `active` — an agent is currently working it.
- `needs_review` — implementation/content is filed and awaits the reviewer named in `reviewer`.
- `rework_required` — reviewer rejected it; `findings` must explain exact blockers.
- `approved` — reviewer signed off.
- `blocked` — cannot move without a user/external decision.
- `done` — fully complete, integrated, and no further review/action remains.

Allowed agents:

- `claude`
- `codex`
- `human`
- `ci`

## Required workflow

1. Before starting work, read `tasks.json`, latest `events.jsonl`, `git status --short`, and recent commits.
2. Never overwrite another agent's uncommitted work. Stage only files in your scope.
3. If authoring content, set status to `needs_review` and reviewer to the other agent.
4. If auditing, write `approved` or `rework_required` with concrete file/line findings.
5. Always append an event to `events.jsonl` for material actions: start, file, reject, approve, fix, block.
6. Let GitHub Actions be the external gate. A local green run is useful; a remote CI pass is the shared referee.

## Content audit floor

For CPA/REG tax content, use the 2026 Public Law 119-21 baseline unless a lesson explicitly names a different tax year. Prefer official sources for unstable tax law.

For authored curriculum:

- Run `npm run build:curriculum` if CMA files changed.
- Run `npm run build:cpa-curriculum` if CPA files changed.
- Run `npm run validate:content`.
- Run `npm run type-check`.
- Run `npm run build` for integration-impacting changes.

## Conflict rules

- If `tasks.json` says one thing and committed review queues say another, trust the newest commit and append a reconciliation event.
- If CI fails, do not mark the task done.
- If a task is rejected, do not start the dependent next unit unless the task explicitly allows parallel work.
