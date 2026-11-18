import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createContext, runInContext } from "node:vm";
import { createApp } from "../server.js";
import { buildDashboard } from "../src/requests.js";

const summaryKeys = ["total", "open", "inProgress", "done"];
const expectedSummary = { total: 6, open: 3, inProgress: 2, done: 1 };
const realRecords = JSON.parse(await readFile(new URL("../data/requests.json", import.meta.url), "utf8"));
const page = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const realRequests = [
  { id: "WR-1001", title: "Repair the lobby badge reader", team: "Workplace", priority: "High", status: "Open" },
  { id: "WR-1002", title: "Update the training-room workstation", team: "IT Services", priority: "Standard", status: "In progress" },
  { id: "WR-1003", title: "Review the onboarding checklist", team: "People Operations", priority: "Standard", status: "Open" },
  { id: "WR-1004", title: "Replace the conference-room adapter", team: "IT Services", priority: "Standard", status: "Done" },
  { id: "WR-1005", title: "Correct the supply inventory label", team: "Facilities", priority: "High", status: "Open" },
  { id: "WR-1006", title: "Update the printer location", team: "Workplace", priority: "Standard", status: "In progress" }
];

const uniqueSamples = Object.freeze([
  Object.freeze({ id: "REG-OPEN", title: "Inspect a workstation", team: "IT Services", priority: "High", status: "Open" }),
  Object.freeze({ id: "REG-PROGRESS", title: "Prepare a room", team: "Workplace", priority: "Standard", status: "In progress" }),
  Object.freeze({ id: "REG-DONE", title: "Review a checklist", team: "People Operations", priority: "Standard", status: "Done" })
]);
const repeatedSamples = Object.freeze([
  uniqueSamples[0],
  uniqueSamples[1],
  Object.freeze({ ...uniqueSamples[0] }),
  uniqueSamples[2],
  Object.freeze({ ...uniqueSamples[1] }),
  Object.freeze({ ...uniqueSamples[2] })
]);

function sortedRequests(requests) {
  return [...requests].sort((left, right) => left.id.localeCompare(right.id));
}

async function withApp(run) {
  const server = createApp();
  try {
    const listening = once(server, "listening");
    server.listen(0, "127.0.0.1");
    await listening;
    return await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    if (server.listening) {
      const closed = once(server, "close");
      server.close();
      server.closeAllConnections();
      await closed;
      assert.equal(server.listening, false);
    }
  }
}

async function readDashboard(baseUrl) {
  const response = await fetch(`${baseUrl}/api/requests`);
  assert.equal(response.status, 200);
  return response.json();
}

// Run the shipped scripts without adding a browser/DOM dependency.
class TestElement {
  children = [];
  listeners = new Map();
  dataset = {};
  value = "";
  text = "";

  get textContent() {
    return this.text + this.children.map((child) => child.textContent).join("");
  }

  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.text = "";
    this.children = children;
  }

  setAttribute(name, value) {
    if (name === "data-theme") this.dataset.theme = String(value);
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  async dispatch(type) {
    for (const listener of this.listeners.get(type) ?? []) {
      await listener({ type, target: this });
    }
  }
}

async function loadRealPage(baseUrl) {
  const elements = new Map(
    [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => [match[1], new TestElement()])
  );
  const document = {
    documentElement: new TestElement(),
    getElementById: (id) => elements.get(id),
    createElement: () => new TestElement(),
    createTextNode: (text) => ({ textContent: String(text) })
  };
  const context = createContext({
    document,
    window: { location: new URL(baseUrl), matchMedia: () => ({ matches: false }) },
    URL,
    URLSearchParams,
    fetch: (url, options) => fetch(new URL(url, baseUrl), options)
  });
  for (const match of page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    await runInContext(match[1], context, { filename: "public\\index.html" });
  }
  assert.equal(elements.get("error").hidden, true, elements.get("error-detail").textContent);
  assert.equal(elements.get("dashboard").hidden, false);
  return elements;
}

test("repeated identities appear once in the request list", () => {
  const dashboard = buildDashboard(repeatedSamples);
  assert.deepEqual(sortedRequests(dashboard.requests), sortedRequests(uniqueSamples));
});

test("summary counts repeated identities once in every status", () => {
  assert.deepEqual(buildDashboard(repeatedSamples).summary, {
    total: 3, open: 1, inProgress: 1, done: 1
  });
});

test("distinct IDs with identical visible fields remain legitimate", () => {
  const requests = [
    { ...uniqueSamples[0], id: "REG-SAME-A" },
    { ...uniqueSamples[0], id: "REG-SAME-B" }
  ];
  const dashboard = buildDashboard(requests);
  assert.deepEqual(sortedRequests(dashboard.requests), requests);
  assert.deepEqual(dashboard.summary, { total: 2, open: 2, inProgress: 0, done: 0 });
});

test("repeats do not erase distinct IDs with the same visible fields", () => {
  const requests = [
    { ...uniqueSamples[0], id: "REG-SAME-A" },
    { ...uniqueSamples[0], id: "REG-SAME-B" }
  ];
  const dashboard = buildDashboard([
    requests[0], requests[1], { ...requests[0] }, { ...requests[1] }
  ]);
  assert.deepEqual({
    requests: sortedRequests(dashboard.requests),
    summary: dashboard.summary
  }, {
    requests,
    summary: { total: 2, open: 2, inProgress: 0, done: 0 }
  });
});

test("real API lists all six legitimate requests exactly once", async (t) => {
  await withApp(async (baseUrl) => {
    const dashboard = await readDashboard(baseUrl);
    t.diagnostic(
      `Raw fixture rows=${realRecords.length}; raw unique IDs=${new Set(realRecords.map((record) => record.id)).size}; ` +
      `API rows=${dashboard.requests.length}; API unique IDs=${new Set(dashboard.requests.map((request) => request.id)).size}`
    );
    assert.deepEqual(sortedRequests(dashboard.requests), realRequests);
  });
});

test("real API reports identity-based totals and status buckets", async (t) => {
  await withApp(async (baseUrl) => {
    const dashboard = await readDashboard(baseUrl);
    t.diagnostic(`BEFORE API summary=${JSON.stringify(dashboard.summary)}; expected=${JSON.stringify(expectedSummary)}`);
    assert.deepEqual(dashboard.summary, expectedSummary);
  });
});

test("real UI filters and reload preserve unique rows and global counts", async (t) => {
  await withApp(async (baseUrl) => {
    const elements = await loadRealPage(baseUrl);
    const allIds = ["WR-1001", "WR-1002", "WR-1003", "WR-1004", "WR-1005", "WR-1006"];
    const views = [
      { label: "All statuses", status: "", ids: allIds },
      { label: "Open", status: "Open", ids: ["WR-1001", "WR-1003", "WR-1005"] },
      { label: "In progress", status: "In progress", ids: ["WR-1002", "WR-1006"] },
      { label: "Done", status: "Done", ids: ["WR-1004"] },
      { label: "All statuses again", status: "", ids: allIds },
      { label: "Reload", status: "", ids: allIds }
    ];
    const observed = [];
    for (const view of views) {
      elements.get("status-filter").value = view.status;
      await elements.get("status-filter").dispatch("change");
      if (view.label === "Reload") await elements.get("reload").dispatch("click");
      assert.equal(elements.get("error").hidden, true, elements.get("error-detail").textContent);
      assert.equal(elements.get("dashboard").hidden, false);
      const ids = elements.get("request-rows").children.map((row) => row.children[0].textContent).sort();
      const summary = Object.fromEntries(summaryKeys.map((key) => [key, Number(elements.get(key).textContent)]));
      observed.push({
        view: view.label,
        ids,
        caption: elements.get("queue-caption").textContent,
        summary
      });
      t.diagnostic(
        `BEFORE ${view.label}: visible=${ids.length}; unique IDs=${new Set(ids).size}; cards=${JSON.stringify(summary)}`
      );
    }
    assert.deepEqual(observed, views.map((view) => ({
      view: view.label,
      ids: view.ids,
      caption: `Showing ${view.ids.length} of 6 requests. Summary cards cover all statuses.`,
      summary: expectedSummary
    })));
  });
});
