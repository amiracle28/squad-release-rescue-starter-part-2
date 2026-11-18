# Squad Release Rescue: Part 2 starter

A small, offline work-request dashboard and a ready-made Squad team (Rick, Morty and Summer), for
practicing an issue-to-pull-request workflow with GitHub Copilot and
[Squad](https://github.com/github/squad).

This is the starting point of the Part 2 workshop (Nov 17, 2026). Part 1's duplicate-request fix is
already included. **All data is synthetic.**

## Quick start

```powershell
npm start          # http://127.0.0.1:4173 (no npm install needed)
npm test           # expect 17 tests, 17 passing
```

Requires Node.js 22.5 or later. If PowerShell blocks `npm.ps1`, use `npm.cmd`. See `START-HERE.txt` for ports and details.

## The mission

Add **Team** and **Priority** filters next to Status. The summary cards stay **global**: they show all
requests, whatever the filters. **Reload data** keeps every selection, even a team that's missing from
the refreshed data.

## What's in here

| Path | What it is |
|---|---|
| `public/`, `src/`, `server.js`, `data/` | The app. `data/requests.json` is a protected fixture: agents must never edit it. |
| `test/` | Node's built-in test runner. 17 tests at the start. |
| `.squad/` | The team, as plain files: roster, routing rules, charters, memory. |
| `.github/agents/squad.agent.md` | The Squad coordinator agent. |
| `prompts/` | **Template prompt library**: one file per step, with `{placeholders}` and approval gates. |
| `examples/` | What our live run produced: the issue, the PR description and annotated `.squad` files. |

## How to run the workshop

Open `prompts/README.md` and follow the steps in order. You approve each one before the next starts:

1. Setup and team check
2. Draft and create the issue
3. Plan with Squad
4. Morty writes failing tests (RED)
5. Rick implements (GREEN)
6. Browser check
7. Summer reviews
8. Scribe records the decision
9. Pull request
10. Inline review
11. Usage
12. Memory hygiene

## Ground rules

- Synthetic data only. No customer data, credentials or real work requests.
- Use your organization's approved Copilot setup and models. Replace `{YOUR-APPROVED-MODEL}` in the prompts.
- Agents propose and you approve. Nothing is committed, pushed or merged without your say-so.
- Keep `.squad/` changes in their own pull request, separate from feature code.

## Learn more

- Squad: <https://github.com/github/squad>
- Squad memory and `squad nap`: <https://github.github.com/squad/docs/concepts/memory-and-knowledge/>
- Copilot billing and AI credits: <https://docs.github.com/en/billing/concepts/product-billing/github-copilot-billing>
