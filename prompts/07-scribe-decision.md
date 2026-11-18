# 07: Scribe records the decision (team memory)

**Goal:** make one *accepted* decision durable, so future sessions and agents know it.

```text
Approve Scribe {YOUR-APPROVED-MODEL} to record one accepted decision for this issue:
{ONE-SENTENCE DECISION, e.g. "A selected team absent after Reload stays selected and shows
no matches. Filters affect rows only; cards describe all refreshed data."}
Use this worktree's Squad decision workflow and cite the real issue.
Report the file and the exact saved entry. Don't edit other agents' histories.
No feature edits, commit, push, PR, comment or merge. Then STOP.
```

**Check:** open `.squad/decisions.md` and read the entry yourself. See `examples/squad-files/decisions.md`.

## Optional: fresh recall

In a **new** conversation on the **same** branch, ask without giving the answer:

```text
What did the team decide about a selected team that disappears after Reload?
Find the answer in this repo's Squad memory; cite file and entry.
If absent, say so. Don't create or change memory.
```
