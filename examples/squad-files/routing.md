# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Primary | Secondary |
|-----------|---------|-----------|
| Problem investigation, root-cause analysis, implementation and bug fixes | Rick | - |
| Independent regression test design, test implementation and edge cases | Morty | - |
| Code review, correctness, simplicity and unintended effects | Summer | - |

Only the three approved specialists are routing destinations. Squad coordinates
scope, assignments, handoffs, and review gates.

## Handoffs

1. Squad scopes an authorized task and assigns investigation or implementation to Rick.
2. Morty independently derives regression cases from requirements and observable behavior; test expectations must not merely mirror the proposed fix.
3. Summer reviews the proposed change and supporting evidence for correctness, simplicity, and unintended effects.
4. Review rejection and reassignment follow the canonical coordinator governance. No agent approves its own work.

## Built-in Support

- Scribe remains the silent merger of accepted durable decisions.
- Ralph remains the work monitor; initialization does not start monitoring or queue processing.
- Rai remains the on-demand Responsible AI reviewer.
- Fact Checker remains the on-demand verification and counter-hypothesis support identity.

These fixed identities are not specialist casting entries or routing destinations.

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Squad coordinator |
| `squad:{name}` | Pick up issue and complete the work | Named member |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, the **Squad coordinator** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for coordinator review.

## Rules

1. **Explicit scope first.** Team initialization alone does not dispatch specialists or begin issue pickup.
2. **One accountable owner.** Route by the primary concern, adding only bounded collaboration required by the task.
3. **Independent testing.** Morty defines regression expectations independently of Rick's implementation.
4. **Independent review.** Summer challenges the change rather than rubber-stamping it.
5. **Support on demand.** Follow the existing support charters; roster membership does not activate a support agent.
6. **Quick facts stay direct.** The coordinator answers simple factual questions from available context.
7. **Issue-labeled work.** The coordinator triages base `squad` issues; `squad:rick`, `squad:morty`, and `squad:summer` identify the responsible specialist.
