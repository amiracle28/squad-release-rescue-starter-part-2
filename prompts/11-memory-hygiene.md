# 11: Memory hygiene (keeping `.squad` small)

**Goal:** stop team memory from slowing down agents or crowding their context as a project grows.

Squad does **not** compact memory automatically. You trigger it:

```powershell
squad nap --dry-run   # preview what would move
squad nap             # archive old sections
squad nap --deep      # keep fewer recent sections
```

In the Squad shell, the same command is `/nap`.

| File | When `nap` acts | Where old content goes |
|---|---|---|
| `.squad/agents/{name}/history.md` | Over 15 KB | `history-archive.md`, moved word for word (not loaded at start) |
| `.squad/decisions.md` | Over 20 KB | `decisions-archive.md` (kept, not loaded) |
| `log/` and `orchestration-log/` | Files older than 7 days | Deleted |
| Skills and `identity/wisdom.md` | Never | Kept permanently |

## Prompt (end of a sprint)

```text
Report the size of each .squad history.md, decisions.md and the whole .squad folder.
Flag anything over the nap thresholds. Don't change files.
Recommend whether to run squad nap, and what would be archived. Then STOP.
```

## Recommended pattern

- Run `squad nap --dry-run` at the end of each sprint, and before spawning many agents at once.
- Put lasting rules in **decisions/directives** ("always…", "never…") and reusable how-tos in **skills**.
- Write history entries under their own `##` headings so `nap` can archive them cleanly.
- Commit `.squad` changes in their **own** PR, reviewed like code.

Source: [Squad docs: Memory & Knowledge](https://github.github.com/squad/docs/concepts/memory-and-knowledge/).
