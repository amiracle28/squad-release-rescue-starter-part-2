# Prompt library

Template prompts for running the workshop end to end with a Squad team. They're shorter versions of the prompts
used live. Fill in the `{placeholders}`, paste each prompt into Copilot, **read the reply**, and only
then move to the next file.

| Placeholder | Example |
|---|---|
| `{REPO}` | `your-org/squad-release-rescue-starter-part-2` |
| `{ISSUE_URL}` | `https://github.com/your-org/your-repo/issues/1` |
| `{BASE_SHA}` | Output of `git rev-parse main` |
| `{YOUR-APPROVED-MODEL}` | A model your organization has approved. You can use one per role. |
| `{PORT}` | A free local port, such as `4175` |

## The flow

| # | File | Who | Stop point |
|---|---|---|---|
| 00 | `00-setup-and-team.md` | You + Copilot | The team is confirmed and the baseline is green (17/17) |
| 01 | `01-issue-draft-and-create.md` | Copilot, normal chat | The issue is created |
| 02 | `02-plan-with-squad.md` | Squad coordinator | The plan is approved |
| 03 | `03-morty-red-tests.md` | Morty | The new tests fail for the right reasons |
| 04 | `04-rick-green-implementation.md` | Rick | All tests pass |
| 05 | `05-browser-check.md` | Coordinator | The behavior is seen in a real browser |
| 06 | `06-summer-review.md` | Summer | APPROVE or REJECT |
| 07 | `07-scribe-decision.md` | Scribe | One decision saved in `.squad/decisions.md` |
| 08 | `08-pull-request.md` | Coordinator | Draft PR created (three separate gates) |
| 09 | `09-inline-review-reply.md` | Coordinator | Reply posted in your review thread |
| 10 | `10-usage-and-finops.md` | Coordinator | Usage reported without estimates |
| 11 | `11-memory-hygiene.md` | You + Squad | `.squad` stays small |

## Five habits that made the live run work

1. **One step per prompt, then STOP.** Every prompt ends with what the agent must *not* do next.
2. **Name the owner and the files.** "Morty owns the test file; Rick owns `public/index.html`."
3. **Tests first.** RED before GREEN proves the tests can catch the problem.
4. **Evidence, not claims.** Ask for the command, exit code, counts, file names and line numbers.
5. **Requested is not verified.** If a model or a step can't be confirmed, the agent says so instead of guessing.
