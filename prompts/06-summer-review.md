# 06: Summer reviews

**Goal:** an independent, read-only review. No agent approves its own work.

```text
Approve Summer {YOUR-APPROVED-MODEL} for read-only review.
Review the issue, diff, tests and actual browser evidence.
Check scope, test independence, missing-team reload, global counts, accessibility,
the definition of done (including anything not yet checked), and gaps.
Return APPROVE or REJECT with concrete findings and file/line references.
Separate blocking from non-blocking findings.
No edits, published comments, commit, push or merge. Then STOP.
```

**If REJECT:** publication stops. A *different* owner revises the change; the reviewer doesn't fix it themselves.
An agent's APPROVE is not a GitHub approval; you still decide.

Live result: APPROVE with four non-blocking items. One was a recommendation to check light and dark themes, which led to a useful extra finding.
