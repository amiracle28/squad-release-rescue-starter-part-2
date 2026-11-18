# 10: Usage and FinOps

**Goal:** honest cost numbers, with no estimates and no double counting.

**Before you start step 02**, record a starting snapshot (in the CLI, run `/usage`; in the app, open the usage panel).
Without a snapshot, the totals cover the whole conversation, including setup.

```text
Show available calls, tokens and AI credits for this session.
State the interval and which conversations/agents are included.
Break down by role where the records support it; say where they don't.
Include context-compaction calls separately if recorded.
Use N/A for unavailable values; don't estimate.
Don't double-count sub-agent totals already included in the session total.
```

## Reading the numbers

- **AI credit:** GitHub's billing unit. 1 credit = $0.01 USD ([billing docs](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-billing)).
- **Input tokens:** everything the model *reads* on each call: instructions, files and chat history.
- **Cache write:** the first time a large, repeated prefix is sent, it's stored.
- **Cache read:** later calls reuse that stored prefix at a much lower rate. This is why long sessions stay affordable.
- **Output tokens:** what the model *writes*. **Reasoning** tokens are its "thinking" and count as output.
- **Compaction:** when the conversation fills the context window, older history is summarized to make room. That summary is model work, so it costs credits too.
- **Context %:** how full the working memory is *right now*. It isn't a running cost.
