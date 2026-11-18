import test from "node:test";
import assert from "node:assert/strict";
import { buildDashboard } from "../src/requests.js";

const records = [
  { id: "TEST-1", title: "Prepare a room", team: "Workplace", priority: "High", status: "Open" },
  { id: "TEST-2", title: "Update a laptop", team: "IT Services", priority: "Standard", status: "In progress" },
  { id: "TEST-3", title: "Review a checklist", team: "People Operations", priority: "Standard", status: "Done" }
];

test("an empty input produces an empty dashboard", () => {
  assert.deepEqual(buildDashboard([]), {
    requests: [],
    summary: { total: 0, open: 0, inProgress: 0, done: 0 }
  });
});

test("includes the supplied requests and their fields", () => {
  assert.deepEqual(buildDashboard(records).requests, records);
});

test("summarizes requests across the three statuses", () => {
  assert.deepEqual(buildDashboard(records).summary, {
    total: 3, open: 1, inProgress: 1, done: 1
  });
});

test("counts multiple open requests", () => {
  const input = records.map((record) => ({ ...record, status: "Open" }));
  assert.deepEqual(buildDashboard(input).summary, {
    total: 3, open: 3, inProgress: 0, done: 0
  });
});

test("does not modify input records", () => {
  const input = Object.freeze(records.map((record) => Object.freeze({ ...record })));
  const result = buildDashboard(input);
  result.requests[0].title = "Changed in the view";
  assert.equal(input[0].title, "Prepare a room");
  assert.notEqual(result.requests, input);
});
