# 08: Pull request (three separate gates)

**Goal:** publish exactly what was reviewed, and nothing else.

## Gate 1: draft the description

```text
Draft the PR for this issue. No commit, push or creation.
Include summary, "Closes {ISSUE_URL}", acceptance checklist and actual evidence.
Separate local tests, browser checks, the review, models and unverified items.
List only public/index.html and test/requests.regression.test.js for the commit.
Keep .squad out. Wait for approval.
```

## Gate 2: commit

```text
Approve one commit of public/index.html and test/requests.regression.test.js only.
Inspect staged files first; if any others are present, stop and report.
Stage exact paths only; leave .squad untouched.
Report SHA and file list. Do not push.
```

## Gate 3: push and create (draft)

```text
Approve pushing the reviewed branch and creating a DRAFT PR in {REPO} against main.
Use the approved description. Publish the reviewed commit only.
If the tool requires other files to be committed, report and STOP.
Return the PR URL and issue link, then STOP. No merge or auto-merge.
```

**Tip from the live run:** some tools refuse to create a PR while *any* file is uncommitted, such as the `.squad`
memory change. The agent stopped and reported it, and we approved `gh pr create --draft` as a fallback.
Don't let the tool commit `.squad` into the feature PR just to get unblocked.

See `examples/pr-description.md` for the description we published.
