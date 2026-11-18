# 03: Morty writes failing tests (RED)

**Goal:** tests written from the *issue*, not from a fix, that fail against the unchanged app.
A failing test proves it can catch the missing feature.

```text
Approve Morty's tests and RED run only, using the approved issue.
Morty {YOUR-APPROVED-MODEL} owns test/requests.regression.test.js; no UI implementation.
Keep existing duplicate/count assertions; only the old caption expectation may change.
For the missing-team Reload case, build refreshed data in the test (no data file edits).
Run the full suite against the unchanged UI. Report command, exit code and pass/fail counts,
and map each failure to an acceptance criterion.
Then STOP. No Rick, browser check, commit, push, PR, comment or merge.
```

**Check:** failures should name *missing features*. Missing imports or broken tooling don't count.
Live result: 39 tests, 18 passed, 21 failed (the expected failures).
