<!-- Description of draft PR #2 from the live run, as published. -->

Closes #1

## Summary

This PR adds **Team** and **Priority** filters next to the existing **Status** filter in the request queue.

- **Filtering.** The three filters combine with AND and affect only the table rows.
- **Summary cards.** The four cards stay a global view of all de-duplicated requests. The summary section's accessible label and the queue caption now say so.
- **Reload data** keeps all three selections. That includes a selected team or priority that is missing from the refreshed data: it stays in its select, stays selected, and the table shows the existing empty state `No requests in this view.`
- **Unchanged.** De-duplication (`buildDashboard`, first occurrence wins), `/api/requests`, and `data/requests.json` are unchanged.

## Changes: commit scope is exactly two files

| File | Diff | Purpose |
|---|---|---|
| `public/index.html` | +53 / −12 | UI: Team and Priority filters, global card labeling, selection retention on Reload |
| `test/requests.regression.test.js` | +332 / −5 | Independent regression tests for AC1–AC15, using the existing `node:test` harness |

Total: 2 files, +385 / −17.

**`public/index.html`**, SHA256 `cbfad53481bb9607449b82c318a667b7d86e07e5772072d643f669b0fe00ee28`:
- `#team-filter` (line 249) and `#priority-filter` (line 255), each with a visible `<label for>` and an "All teams" / "All priorities" default.
- `populateFilter(id, field, allLabel)` (line 305):
  - Builds the options from the distinct values in the de-duplicated list, sorted alphabetically.
  - Keeps the current selection as an option when it is absent from the refreshed data.
  - Is called on load and on each Reload (lines 372–373).
- Rows are filtered by all three selects with AND. The cards are not filtered.
- Caption (line 355): `Showing N of M requests. Summary cards cover all requests and ignore filters.`
- The summary section's `aria-label` (line 210) is `Summary for all requests (ignores filters)`.
- `.filters` flex-wrap layout rule (line 140). **This is the only CSS change; no colors or theme tokens change.**
- The existing filter's visible label text changes from "Show" to **"Status"** (line 240). See the disclosures.

**`test/requests.regression.test.js`**, SHA256 `db436c1d321accc0fd046ee2f55bfd6e43c0ea554cf75a96a4c5a18d6e71b4e2`:
- Test-only seams, which the issue's test approach allows:
  - `loadRealPage(baseUrl, fetchImplementation = fetch)` (line 119) and `withReloadResponses` (line 228) script the Reload payloads.
  - `TestElement` now records tag names and attributes and hydrates `<option>` children, so tests can assert real option membership. This addresses the harness limitation described in the issue.
- The missing-team Reload payload is built in memory with `buildDashboard(realRecords.filter((record) => record.id !== "WR-1005"))` (line 452). `data/requests.json` is never written.
- New tests are tagged by AC, from `[AC14, AC15]` at line 340 through line 532.
- Only one existing assertion changed: the caption string in "real UI filters and reload preserve unique rows and global counts" (line 334). The de-duplication tests (lines 243–278), `requests.test.js`, and `server.test.js` are unmodified.

**Not in this PR:**
- `.squad/decisions.md`: local Squad team state; see the Scribe section.
- `server.js`: no longer shows as modified in `git status`; excluded from the commit.

## Acceptance criteria (from #1)

`[x]` means evidence is cited below. `[ ]` means not proven, with the reason given.

- [x] **AC1.** Three labeled selects with "All …" defaults; 6 rows initially.
  - Tests: line 362.
  - Browser: Stage 3 canvas (file 35, text only); Stage 7 screenshots `80_20`–`80_50`.
- [x] **AC2.** Team and Priority options derived from the data and sorted alphabetically.
  - Tests: lines 362 and 532.
  - Browser: file 35.
- [x] **AC3.** Single-filter results.
  - Tests: line 399.
  - Browser: file 35 (text only).
- [x] **AC4.** Combined AND results.
  - Tests: line 399.
  - Browser: file 35 (text only).
- [x] **AC5.** Resetting all filters shows 6 rows.
  - Tests: line 408.
  - Browser: file 35; `32` (375 px, 6 of 6).
- [x] **AC6.** Cards read 6/3/2/1 under every combination.
  - Tests: lines 399–440.
  - Browser: file 35; `32`, `33`; Stage 7 `80_` results.
- [x] **AC7.** The accessible label and the caption say the cards cover all requests and ignore filters.
  - Tests: lines 379 and 222.
  - Browser: Stage 7 `80_` results (exact strings).
- [x] **AC8.** Exact empty state with `Showing 0 of M …`, hidden again once rows match.
  - Tests: line 429.
  - Browser: `33`; Stage 7 empty-state screenshots.
- [x] **AC9.** Reload keeps Open/Workplace/High and the visible rows.
  - Tests: line 440.
  - Browser: file 35 (click); `80_10`/`80_11` (Space key).
- [x] **AC10.** Absent Facilities is retained and selected after Reload.
  - Tests: line 451.
  - Browser: screenshot `30`. Facilities stays selected, 0 rows, exact empty text, cards 5/2/2/1, caption `Showing 0 of 5 …`.
- [x] **AC11.** Absent Priority is retained.
  - Tests: lines 466 and 495.
  - Browser: file 35 only (text, no screenshot).
- [x] **AC12.** A retained-but-absent option drops on the next Reload once the user changes the selection.
  - Tests: line 495.
  - Browser: file 35 only (text, no screenshot).
- [x] **AC13.** A failed Reload (HTTP 503) keeps the selections, and a later successful retry still applies them.
  - Tests: line 513.
  - Browser: file 35 only (text, no screenshot).
- [x] **AC14.** De-duplication and payload are unchanged; no duplicate IDs appear in any view.
  - `src/` has no diff. `server.js` has only the CRLF difference and is excluded.
  - The de-duplication tests (lines 243–278) pass unmodified. Every filtered view asserts unique IDs (line 205).
  - Summer: evidenced.
- [x] **AC15.** A repeated ID with conflicting fields uses its first occurrence. **Evidenced by tests only** (lines 340 and 532); see the disclosures.
- [ ] **AC16.** `data/requests.json` is byte-for-byte unchanged "at any point". **Unchecked.**
  - Its SHA256 `26282f9914bb85c184003effbff49f7a55acf7d726dd11408ce67dec572ea27f` is unchanged at every recorded snapshot and now, and `git diff --name-only` does not list it.
  - However, "at any point / mid-work" rests on per-phase snapshots, not continuous monitoring (a gap Summer listed).
  - `main...HEAD` can only be checked after the commit exists.

## Definition of done (from #1)

- [ ] **All of AC1–AC16 are met.** Unchecked because AC16 is unchecked.
- [x] **Guardrail.** The working tree does not list `data/requests.json`, and Summer confirmed it in review. Re-run `git diff --name-only main...HEAD` on the actual commit.
- [x] **Regression tests added; `npm test` passes in full; existing tests unchanged except the caption.** Local only, not CI; see "Local tests".
- [x] **Morty derived the tests independently of Rick.** File-time order from Summer's review: test file written 11:01:06, RED run 11:01:18, Rick's first edit 11:09:20. The RED run against the unchanged UI had 21 failures.
- [ ] **Manual verification via `npm start` at http://127.0.0.1:4173.** Unchecked:
  - Verification ran with `PORT=4175 node server.js` from this worktree, not `npm start` on 4173. The served `index.html` hash matched the worktree.
  - Dark-theme card label readability fails (2.78:1).
  - Filters, the no-matches message, Reload with selections and with an absent team, desktop and 375 px, light theme, and keyboard focus on all three selects passed.
- [x] **Summer reviewed; no self-approval.** Verdict APPROVE. Note that her review predates the Stage 7 dark-contrast finding.
- [x] **Diff limited to `public/index.html` and test files; data untouched; no new dependencies.** Commit `7856d89` changes only `public/index.html` and `test/requests.regression.test.js`; `data/` and `package.json` are unchanged.
- [ ] **PR links this issue; nothing published or deployed.** Unchecked until the PR exists. The body contains `Closes #1`. Nothing has been published or deployed.

## Evidence

The evidence lives in a local folder and is not uploaded or attached to this PR. File names below refer to that folder. Its index is `evidence-index.txt`, Stages 0–8.

### 1. Local tests: not CI

| Run | Command | Result | File |
|---|---|---|---|
| RED, Morty, unchanged UI | `npm.cmd test` (`node --test`) | 39 tests, 18 pass, 21 fail, exit 1 | `11_morty_RED-suite-output_39tests-18pass-21fail.txt` |
| GREEN, Rick | `npm.cmd test` | 39 tests, 39 pass, 0 fail, exit 0 | `21_rick_GREEN-suite-output_39pass.txt` |
| GREEN, coordinator's independent rerun | `npm.cmd test` | 39 tests, 39 pass, 0 fail, exit 0, 772 ms | `22_coordinator_independent-GREEN-rerun_39pass.txt` |

- **No CI result exists.** None of the four workflows in `.github/workflows/` runs `npm test` or `node --test`: `squad-heartbeat`, `squad-issue-assign`, `squad-triage`, `sync-squad-labels`.
- The source and test hashes are unchanged since those runs; they were re-checked at drafting time.

### 2. Browser checks: this worktree, 127.0.0.1:4175

**Stage 3, the first acceptance pass:**
- **In-app browser canvas.** The AC1–AC13 and AC15 observations are recorded only as text in `35_coordinator_browser-gate-stage-summary_LATER-SUMMARY.md`, which was written afterward. The only per-AC screenshot is AC10's.
- **AC10 by response interception.** An in-page `window.fetch` wrapper matched only `/api/requests`. It took the real response, removed WR-1005 from a `structuredClone` copy, and recomputed the totals to 5/2/2/1. No data file was edited, and the native `fetch` was restored afterward.
  - Result: Facilities is still an option and still selected, 0 rows, `No requests in this view.`, caption `Showing 0 of 5 …`.
  - Screenshot: `30_browser_missing-team-reload_Facilities-0of5-totals-5-2-2-1.png`.
- **Headless Edge through DevTools (CDP).** Enter on Reload, tab order (theme toggle → Reload → Status → Team → Priority), visible focus, typeahead, and no page-level overflow at 375 px. At that time, Space was recorded as **false**.
  - Raw results: `34_browser_keyboard-and-375px-results_CDP.json`.
  - Screenshots: `31_browser_keyboard-focus-ring-on-Team-select_1280.png`, `32_browser_375px-default-all-filters-6of6.png`, `33_browser_375px-empty-state-Done-Workplace-0of6.png`.

**Stage 7, a focused recheck** (headless Edge 157):
- The server was started as PID 39232 and stopped afterward. The served `index.html` SHA256 matched the worktree.

| Check | Result | Files |
|---|---|---|
| Space on Reload keeps Open/Workplace/High | **PASS**: trusted key events, exactly one real `GET /api/requests` (200), WR-1001 the only row, cards 6/3/2/1 | `80_10_space_reload_results.json`, `80_10_space_reload_BEFORE.png`, `80_11_space_reload_AFTER.png` |
| Light, 1280×900 | **PASS** | `80_20_light_desktop-1280_*` (JSON and 2 PNGs) |
| Light, 375×812 | **PASS** | `80_40_light_mobile-375_*` (JSON and 2 PNGs) |
| Dark, 1280×900 | **UNVERIFIED**: total-card text contrast 2.78:1 | `80_30_dark_desktop-1280_*` (JSON and 2 PNGs) |
| Dark, 375×812 | **UNVERIFIED**: total-card text contrast 2.78:1 | `80_50_dark_mobile-375_*` (JSON and 2 PNGs) |

The exact pass/fail summary is in `80_95_exact-pass-fail-summary.txt`; the manifest is `80_99_evidence_manifest.json`.

**Exact strings observed in the browser:**
- `Showing 6 of 6 requests. Summary cards cover all requests and ignore filters.`
- `Showing 0 of 6 requests. Summary cards cover all requests and ignore filters.`
- `No requests in this view.`
- `Summary for all requests (ignores filters)` (the summary section's accessible label)

**Measured contrast in Stage 7:**

| Element | Light | Dark |
|---|---|---|
| Filter focus outlines (3px, solid) | 6.63:1 | 6.62:1 |
| Caption and empty-state text | 6.69:1 | 4.62:1 |
| "Total requests" and "Across all statuses" | passed | **2.776:1**: rgb(145,145,145) on an effective rgb(87.88,70.62,72.42) background, below the 4.5:1 threshold |

### 3. Review: Summer, read-only

**Verdict: APPROVE** (`50_summer_review_VERBATIM-excerpt.txt`).

Non-blocking findings:
- The Show→Status label change (line 240): accept it and disclose it.
- After Reload, focus moves to the page body. She judged this pre-existing: Reload is disabled and re-enabled at lines 359 and 382, which match HEAD lines 322 and 343.
- AC14 is evidenced.
- AC15 is evidenced by tests only.
- AC16 was verified at review time; the "at any point" clause rests on snapshots.
- `server.js` has only the CRLF difference; keep it out of the PR.

Gaps she listed, with what has happened since:

| Gap | Status now |
|---|---|
| Space key not proven | Since verified in Stage 7 |
| Themes not checked | Stage 7: light passes, dark fails |
| No screen-reader test | Still open |
| No baseline comparison | Still open |
| Run on 4175, not 4173 | Still true |

She also wrote: "Check both themes before merge."

**Her APPROVE predates Stage 7, and she has not reviewed the dark-contrast finding.**

### 4. Team decision: Scribe (local Squad state, not part of this PR)

Scribe recorded this entry in `.squad/decisions.md`. The file is uncommitted and excluded from this PR. Exact entry, from `60_scribe_saved-decision-entry_EXACT.md`:

```
### 2026-11-17T19-16-40: Issue #1: a selected team absent after Reload stays selected; summary cards stay global
**By:** Amir Gill (amiracle28), accepted 2026-11-17; recorded by Squad (Coordinator)
**What:** A selected team absent after Reload stays selected and shows no matches. Filters affect rows only; cards describe all deduplicated refreshed data.
**Why:** User-accepted decision for issue #1 after Summer's APPROVE review. It corresponds to acceptance criteria AC6, AC7, AC10 and AC14 of the live issue.
**References:** Issue #1 (copy: [issue-dashboard-filters.md](issue-dashboard-filters.md))
```

The coordinator, not Scribe, wrote the AC mapping in "Why". Before/after evidence for `.squad`: `60_squad-diff_before-after.txt`, `60_squad-state_BEFORE-snapshot.txt`, `60_squad-state_AFTER-snapshot.txt`.

### 5. Models: requested and dispatched only, no independent attestation

| Role | Agent | Requested | Dispatched (runtime metadata) | Recorded activity |
|---|---|---|---|---|
| Tester | Morty | `gpt-6.1-sol` | `gpt-6.1-sol` | 22 tool calls, about 378 s |
| Developer | Rick | `claude-sonnet-5.5` | `claude-sonnet-5.5` | 15 tool calls, about 47 s |
| Reviewer | Summer | `claude-opus-5.5` | `claude-opus-5.5` | 23 tool calls, about 174 s |
| Scribe | Scribe | `claude-sonnet-5.5` | `claude-sonnet-5.5` | 11 tool calls, 20.66 s |

These values come from the app's runtime dispatch metadata, recorded in `evidence-index.txt`. Nothing independently attests which model actually served each response.

### 6. Unverified or not done

- **Dark theme:** "Total requests" and "Across all statuses" measure 2.78:1, below 4.5:1. The DoD readability item is **unmet**.
- **Screen reader:** none tested. There was also no physical-device, cross-browser, or full WCAG audit.
- **`npm start` on 4173:** not used. Manual checks ran on 4175 with `PORT=4175 node server.js`.
- **Baseline:** no comparison at HEAD for dark contrast or focus behavior.
- **AC11–AC13 in the browser:** text-only evidence (file 35), no screenshots.
- **AC15 in the browser:** not demonstrable with the shipped fixture.
- **AC16:** "at any point" is not continuously proven; see above.
- **CI:** no CI run exists. Local tests are not CI.
- **Summer:** has not reviewed the Stage 7 findings.
- **Fresh recall:** not demonstrated (Stage 6). A new chat could not attach to this feature worktree, and no recall prompt was sent.

## Disclosures

1. **Show→Status label.** The existing filter's visible label changed from "Show" to "Status" (`public/index.html` line 240) so it matches the issue's naming. Summer accepted it, provided it's disclosed.
2. **Focus after a keyboard Reload.** Focus moves to the page body after Reload (seen in Stage 3 and Stage 7). This is likely pre-existing: the disable/enable lines (359 and 382) match HEAD (322 and 343). It is not fixed here.
3. **Dark-theme card label contrast is 2.78:1.** This diff changes no colors; its only CSS change is the `.filters` layout rule at line 140. The issue is likely pre-existing, but **the baseline was not checked**. The DoD readability item is **unmet**.
4. **Space key is now verified.** The `80_10`/`80_11` files supersede the earlier "Space false" in file 34.
5. **AC15 is tests-only.** The fixture's duplicate copies are identical, so first-occurrence-wins with conflicting fields can't be shown in the browser.
6. **No screen-reader test** was performed.
7. **Fresh recall was not demonstrated.** The persisted decision is evidenced only by the `60_` files.

## Commit scope (committed as 7856d89)

```
git add -- public/index.html test/requests.regression.test.js
```

- Exclude `.squad/decisions.md` (local Squad state) and `server.js` (CRLF-only working-tree difference).
