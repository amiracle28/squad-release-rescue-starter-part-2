# 01: Draft and create the issue

**Goal:** turn a one-line request into a reviewable contract *before* anyone writes code.
Use a **normal** Copilot chat, not Squad.

## Draft only

```text
Draft a GitHub issue for {REPO}; do not create it.
Request: add Team and Priority filters alongside Status. Summary cards stay global
(all requests, ignoring filters) and are labeled that way.
Reload data keeps every selection, including a selected team absent from refreshed data.
Show an exact no-matches message. Preserve existing duplicate-ID behavior.
Include current behavior, acceptance criteria (numbered), non-goals and definition of done.
data/requests.json is read-only for every agent; use in-test payloads instead.
Use the existing test harness. No server/data/API/dependency/CI/deployment changes.
Don't edit code or invoke Squad. Wait for my approval.
```

**Review it like a teammate:** are the edge cases explicit? Are the exact strings written down? Is the protected file named?

## Create (after your approval)

```text
Approved. Create this reviewed issue in {REPO}.
Return its URL and author, then STOP. No implementation.
```

See `examples/issue-dashboard-filters.md` for the issue we created live.
