import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../server.js";

let server;
let baseUrl;

before(async () => {
  server = createApp();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server?.listening) {
    const closed = once(server, "close");
    server.close();
    server.closeAllConnections();
    await closed;
  }
});

test("serves the dashboard", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(await response.text(), /Work requests/);
});

test("serves a request list with a numeric summary", async () => {
  const response = await fetch(`${baseUrl}/api/requests`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const dashboard = await response.json();
  assert.ok(Array.isArray(dashboard.requests));
  for (const key of ["total", "open", "inProgress", "done"]) {
    assert.equal(typeof dashboard.summary[key], "number");
  }
});

test("does not expose source files", async () => {
  const response = await fetch(`${baseUrl}/server.js`);
  assert.equal(response.status, 404);
});

test("does not expose repository metadata", async () => {
  const response = await fetch(`${baseUrl}/.git/config`);
  assert.equal(response.status, 404);
});

test("rejects writes to the data endpoint", async () => {
  const response = await fetch(`${baseUrl}/api/requests`, { method: "POST" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
});
