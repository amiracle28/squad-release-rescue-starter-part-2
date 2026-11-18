# The team in plain files: annotated `.squad` examples

Squad's "team" is ordinary Markdown and JSON in the repo. You can read it, edit it, and review changes in a pull request
like any other code. These files are copies from our live run on Nov 17, 2026. The live `.squad/` folder
at the repo root is the **starting** state; this folder shows what it looked like **after** the run.

## Who's on the team

| File | What it does | What to notice |
|---|---|---|
| `team.md` | The roster: coordinator, Rick, Morty, Summer, plus support agents (Scribe, Ralph, Rai, Fact Checker) | The "Working Agreement": Morty tests **independently** of Rick's fix |
| `routing.md` | Who handles which kind of work | Rule 3, *Independent testing*, and Rule 4, *Independent review*. "No agent approves its own work." |
| `ceremonies.md` | Team rituals: a design review before multi-agent work, a retrospective after a failure or rejection | Each one has a written trigger condition |
| `casting/registry.json` | Persistent names and roles (the Rick and Morty theme) | Names are cosmetic; roles and charters drive behavior |

## How each member thinks: charters

`agents/{name}/charter.md` is each member's job description: identity, what they own, how they work, and their boundaries.

- **Morty** (`agents/morty/charter.md`): *"Derive expectations from requirements … before relying on a proposed patch."* That's why his tests failed first (RED).
- **Rick** (`agents/rick/charter.md`): investigates and implements the smallest focused fix.
- **Summer** (`agents/summer/charter.md`): *"Distinguish blocking defects from optional suggestions."* That's why she approved with four non-blocking recommendations.
- **Scribe** (`agents/scribe/charter.md`): silently merges *accepted* decisions into shared memory.

## Memory: three layers

| Layer | File | Who reads it | Our run |
|---|---|---|---|
| **Shared decisions** | `decisions.md` | Every agent, before working | Scribe added **one** accepted decision for issue #1 |
| **Personal history** | `agents/{name}/history.md` | Only that agent | Still about 360 bytes each, with empty `## Learnings` (a single-day run) |
| **Team wisdom** | `identity/wisdom.md` | Every agent | Empty. It grows only from distilled, reusable patterns |

Open `decisions.md` to see the real entry: **who** accepted it, **what** was decided, **why**, and a reference to the issue.

## When memory grows

Squad doesn't compact automatically. Run `squad nap` (see `prompts/11-memory-hygiene.md`):

- Histories over 15 KB are archived to `history-archive.md`.
- `decisions.md` over 20 KB is archived to `decisions-archive.md`.

Skills and wisdom are never compacted.
