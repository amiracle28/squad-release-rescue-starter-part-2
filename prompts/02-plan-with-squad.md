# 02: Plan with Squad

**Goal:** a plan that names the location, owners, models and stop points before anything changes.

Start a **new session** from the issue, in an isolated branch or worktree, in **Plan** mode, with the **Squad** agent selected.
Attaching an issue to a normal chat does not select Squad.

```text
You are Squad coordinating ONE issue: {ISSUE_URL}
Expected repo: {REPO}. Expected base: {BASE_SHA}.
Use only this session's worktree and its own .squad folder.
PLAN FIRST: report repo, branch, base, worktree, ownership and stop points.
Wait for approval before any specialist or edit.
Models: Rick {YOUR-APPROVED-MODEL}; Morty {YOUR-APPROVED-MODEL}; Summer {YOUR-APPROVED-MODEL};
Scribe {YOUR-APPROVED-MODEL}, only at the separately approved memory step.
Pass each model explicitly; stop on rejection or mismatch. Report "requested" separately from "verified".
Morty owns test/requests.regression.test.js; Rick owns public/index.html.
Order: Morty RED, STOP. Rick GREEN, STOP. Browser check, STOP. Summer review, STOP.
Never edit data files; use response interception for missing-data cases.
Keep .squad writes out of the feature PR.
No installs, extra agents, commit, push, PR, comment or merge.
```

**Approve the boundaries, not just the design:** check that the plan has no hidden PR step, no data edits and no extra agents.
