# 09: Inline review reply

**Goal:** a human question on a real line of the diff, answered *in the same thread* with evidence.

1. In GitHub, open the PR's **Files changed** tab, then comment on a changed line and submit it as a **Comment** review (not Approve). Example:
   > Where do we prove that Reload keeps the selected team when that team disappears from the returned data?
2. Back in the implementation session:

```text
Reply inside my existing inline PR review thread with the relevant test file,
test name, line numbers and what its assertions prove.
Do not post a disconnected top-level comment or change code.
Leave the thread unresolved for me to inspect. Do not merge.
```

**Check:** the reply is *in the thread*, names a real test, and the thread is still unresolved.
