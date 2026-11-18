# 05: Browser check

**Goal:** see the behavior in a real browser. Passing unit tests are not the same as a working page.

```text
Approve browser verification only, from this worktree on loopback port {PORT}.
Check port ownership first; if occupied, report PID/command and wait. Stop no existing process.
Verify each acceptance criterion, keyboard use, and a ~375px wide viewport.
Missing-team Reload: intercept the page's data response only; never edit data files.
Remove WR-1005 from a copy of the response and check the totals become 5/2/2/1, the Facilities
selection is kept, no rows show, and the caption reads "Showing 0 of 5".
Save screenshots. Restore interception afterward. Report evidence or tooling blockers.
Then STOP. No review, code edits, commit, push or PR.
```

**The subtle trap:** summary cards change when the *data* changes, but never when the *filters* change.
