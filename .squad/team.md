# Squad Team

> A local, synthetic Node.js work-request dashboard.

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Rick | Developer | `.squad/agents/rick/charter.md` | Active |
| Morty | Tester | `.squad/agents/morty/charter.md` | Active |
| Summer | Reviewer | `.squad/agents/summer/charter.md` | Active |

## Built-in Support Agents

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Scribe | Decision Merger | `.squad/agents/scribe/charter.md` | Silent |
| Ralph | Work Monitor | `.squad/agents/ralph/charter.md` | Idle |
| Rai | RAI Reviewer | `.squad/agents/Rai/charter.md` | On demand |
| Fact Checker | Devil's Advocate & Verification Agent | `.squad/agents/fact-checker/charter.md` | On demand |

## Working Agreement

- Rick investigates problems and implements focused fixes.
- Morty questions assumptions and independently defines regression tests from requirements and observable behavior, not from Rick's proposed patch.
- Summer challenges proposed changes for correctness, simplicity, and unintended effects.
- The Rick and Morty theme is limited to names. Everyone uses professional communication and disciplined engineering practices.
- Built-in support identities remain separate from specialist casting and routing.
- Initialization configures the team only. No engineering mission is started, and no commit, push, or model change is authorized by setup.

## Project Context

- **Owner:** Amir Gill
- **Project:** squad-release-rescue-starter
- **Description:** A local, synthetic work-request dashboard for a Squad engineering workshop.
- **Stack:** Node.js >=22.5.0, JavaScript ES modules, Node.js built-in test runner (`node --test`).
- **Universe:** Rick and Morty (user-selected custom universe).
- **Created:** 2026-10-20
