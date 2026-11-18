# 00: Setup and team check

**Goal:** a known-good starting point before any agent work begins.

1. Clone or unzip the starter. Run `npm test` and expect **17 passing**. Run `npm start` and open the dashboard.
2. In Copilot (CLI, VS Code or the Copilot app), choose the **Squad** agent and paste:

```text
Read .squad/team.md, .squad/routing.md and each member's charter.
Summarize who is on the team, what each member owns, and the routing rules.
Confirm the repo, branch and base commit you are working in.
Don't start any work, spawn agents or change files. Then STOP.
```

**Check:** you should see Rick (developer), Morty (tester) and Summer (reviewer), plus Scribe and the other support agents. Routing should say "No agent approves its own work".
