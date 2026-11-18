<!-- Copy of the issue created live on Nov 17, 2026 (issue #1 in the workshop repo). -->
# Add Team and Priority filters to the request queue (summary cards stay global)

## Summary
The request queue can only be filtered by **status**. Add **Team** and **Priority** filters alongside it so people can narrow the queue by ownership and urgency. The four summary cards stay a **global** view of all (de-duplicated) requests and say so. Every filter selection survives **Reload data**, including a selected team that no longer appears in the refreshed data.

## Current behavior (verified in the repo at HEAD)
- `public/index.html`: one `#status-filter`; `renderRows()` filters `dashboard.requests` client-side by status only.
- Caption today: `Showing N of M requests. Summary cards cover all statuses.`
- Empty state today: `<p id="empty">No requests in this view.</p>`, hidden whenever at least one row shows.
- `src/requests.js` `buildDashboard()` de-duplicates by `id` (**first occurrence wins**) and computes `summary` from the de-duplicated list. `data/requests.json` intentionally contains repeated `WR-1001` and `WR-1005` rows (8 raw rows → 6 unique).
- "Reload data" refetches `/api/requests` and calls `renderRows()`. The status `<select>` is never rebuilt, so its selection survives today. New data-driven selects must not lose that property.
- Fixture data: teams `Workplace`, `IT Services`, `People Operations`, `Facilities`; priorities `High`, `Standard`.

## Proposed behavior
1. **Three filters** in the queue header: Status (existing), **Team** (new), **Priority** (new). Each has a visible `<label for>`. Defaults: "All statuses", "All teams", "All priorities".
2. **Filters combine with AND.** A row shows only if it matches every non-default filter.
3. **Team and Priority options come from the loaded data** (distinct values from the de-duplicated requests, sorted alphabetically, after the "All …" option). Status options stay the fixed existing list.
4. **Summary cards are global.** They never change with any filter and are explicitly labeled as covering all requests regardless of filters.
5. **Reload keeps all selections.** After "Reload data", Status, Team and Priority keep their values. If the selected team (or priority) is **absent from the refreshed data**, it stays in the select, still selected, so the filter stays in force instead of silently resetting to "All".
6. **No-matches state** uses the existing text, exactly: `No requests in this view.`
7. **Duplicate-ID behavior is unchanged.** Filtering runs on the already de-duplicated list; the retained record is the first occurrence.

## Acceptance criteria
Expected results use the shipped fixture (`data/requests.json`). Unique rows: WR-1001 Workplace/High/Open · WR-1002 IT Services/Standard/In progress · WR-1003 People Operations/Standard/Open · WR-1004 IT Services/Standard/Done · WR-1005 Facilities/High/Open · WR-1006 Workplace/Standard/In progress.

**Filters**
- [ ] AC1. A Team select and a Priority select appear next to the Status select, each with a visible label and an "All …" default; initial view shows all 6 requests.
- [ ] AC2. Team options are exactly "All teams" + `Facilities`, `IT Services`, `People Operations`, `Workplace` (derived from data, alphabetical). Priority options are "All priorities" + `High`, `Standard`.
- [ ] AC3. Single filters: Team=Workplace → WR-1001, WR-1006. Team=IT Services → WR-1002, WR-1004. Priority=High → WR-1001, WR-1005. Priority=Standard → WR-1002, WR-1003, WR-1004, WR-1006.
- [ ] AC4. Combined (AND): Workplace+High → WR-1001. IT Services+Standard+In progress → WR-1002. Open+High → WR-1001, WR-1005.
- [ ] AC5. Returning every filter to its "All …" option shows all 6 again.

**Summary cards (global, labeled)**
- [ ] AC6. Under every filter combination above, the cards read Total 6 · Open 3 · In progress 2 · Done 1.
- [ ] AC7. The summary section's accessible label and the queue caption state that cards cover **all requests and ignore filters**. Proposed caption: `Showing N of M requests. Summary cards cover all requests and ignore filters.` (`M` = de-duplicated total, as today.)

**No-matches state**
- [ ] AC8. When no request matches (e.g. Workplace + Done, or Facilities + Standard), the table body is empty, `#empty` is visible with exactly `No requests in this view.`, and the caption shows `Showing 0 of M …`. The message is hidden again as soon as at least one row matches.

**Reload**
- [ ] AC9. With Status=Open, Team=Workplace, Priority=High selected, "Reload data" leaves all three selections and the visible rows unchanged.
- [ ] AC10. With Team=Facilities selected and refreshed data that contains **no** Facilities requests: after reload the Team select still has `Facilities` as an option **and** it is still selected; zero rows show; `No requests in this view.` is displayed; the cards reflect the refreshed data's global totals; the Facilities filter is **not** silently reset to "All teams".
- [ ] AC11. The same retention applies to a selected Priority absent from refreshed data.
- [ ] AC12. A retained-but-absent option exists only while selected; once the user picks another value it may disappear on the next reload.
- [ ] AC13. A failed reload (HTTP error) does not clear any selection; a later successful reload still honors them.

**Duplicate IDs (unchanged)**
- [ ] AC14. `buildDashboard`, the `/api/requests` payload shape, and the de-duplication rule are unchanged. No duplicate ID ever appears in any filtered view or is counted in the caption's `M`.
- [ ] AC15. If a repeated ID's copies disagree on team/priority/status, filtering and counts use the first occurrence only. Distinct IDs with identical visible fields still appear as separate rows.

**Guardrail: `data/requests.json` is read-only for every agent**
- [ ] AC16. `data/requests.json` is **byte-for-byte unchanged** by this work: `git diff --name-only` against `main` never lists it, at any point (not at commit time, not mid-work, not "restored afterward").

## Guardrail: protected data file
`data/requests.json` is the shipped fixture and the source of the intentional duplicate rows (`WR-1001`, `WR-1005`). **No agent (Rick, Morty, Summer, Scribe, Ralph, Rai, Fact Checker, @copilot, or any sub-agent) may modify it**: no edits, reformatting, line-ending changes, regeneration, de-duplication, added or removed records, or temporary changes during testing, even if reverted afterward.
- Agents may **read** it.
- Anything that needs different data (e.g. a team absent after reload) must use in-test payloads or an injected `fetch`, never an edited data file.
- The coordinator must pass this exclusion explicitly in every specialist prompt for this issue.
- If an agent believes the file must change, it **stops and reports** instead of editing; changing it requires a separate, explicitly approved issue.
- Enforcement: Summer checks the diff for this path; the Definition of done below includes a diff check.

## Test approach (existing harness only)
- Add cases to the existing `node:test` suite, reusing the real-page VM harness in `test/requests.regression.test.js` (`withApp`, `loadRealPage`, `TestElement`). New controls need ids (e.g. `team-filter`, `priority-filter`); the harness discovers elements by `id="…"` automatically.
- **Harness limitation to design around:** `TestElement` does not enforce option membership. Assigning `.value` always sticks, unlike a real `<select>`, which resets to "" when the value has no matching `<option>`. The reload/absent-team test must therefore assert that the select's children **contain an option with that value** after reload, not merely that `.value` is unchanged.
- **Refreshed data without a team:** add a minimal test-only seam to `loadRealPage` (e.g. a swappable `fetch` implementation) so the second load can return a payload lacking that team. The real server stays as is, and tests must **never write to, rename, or temporarily modify `data/requests.json`** (see guardrail). The existing "real API…" and "real UI…" tests already pin the fixture's observable content (6 unique requests, summary 6/3/2/1), so changes to it would also fail them.
- Update only the caption string in the existing "real UI filters and reload preserve unique rows and global counts" test. All other existing tests (`requests.test.js`, `server.test.js`, de-dup regression tests) must pass unmodified.
- No new dependencies, browser, or DOM library (`START-HERE.txt`: no `npm install`).

## Non-goals
- Any change to `buildDashboard`, de-duplication, `/api/requests`, or `server.js`.
- **Any change at all to `data/requests.json`** (protected file; see guardrail). Fixing, de-duplicating, or adding sample records is explicitly out of scope.
- Making summary cards filter-aware, or adding per-filter counts.
- Persisting selections across a browser refresh or navigation (URL params, `localStorage`). "Reload" here means the **Reload data** button only.
- Multi-select, search box, sorting, pagination, or a "clear all filters" button.
- Special labeling/styling for a retained-but-absent option beyond showing its plain value.
- Visual redesign or theme changes beyond fitting two more selects (must still work at ≤760px width).
- New dependencies, build steps, cloud services, or deploying/publishing anything.

## Definition of done
- [ ] All acceptance criteria AC1–AC16 are met.
- [ ] **Guardrail verified:** `git diff --name-only main...HEAD` (and the working tree) does **not** list `data/requests.json`; Summer confirms this in review.
- [ ] Regression tests covering the criteria are added to the existing suite; `npm test` passes in full, with existing tests unchanged except the one caption assertion.
- [ ] Morty derived the new test expectations from these criteria independently of Rick's implementation.
- [ ] Manually verified via `npm start` at http://127.0.0.1:4173: filters, no-matches message, Reload data with selections (and with an absent team), desktop and ≤760px, light and dark themes, keyboard focus on all three selects.
- [ ] Summer reviewed for correctness, simplicity, and unintended effects; no self-approval.
- [ ] Diff limited to `public/index.html` and test files; **`data/requests.json` untouched**; synthetic data only; no new dependencies.
- [ ] PR links this issue; nothing published or deployed.

## Suggested routing (`.squad/routing.md`)
Rick implements in `public/index.html` · Morty writes independent regression tests · Summer reviews. Every prompt includes the explicit exclusion: *do not modify `data/requests.json`*.

