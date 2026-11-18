import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { buildDashboard } from "./src/requests.js";

const pageUrl = new URL("./public/index.html", import.meta.url);
const dataUrl = new URL("./data/requests.json", import.meta.url);

export function createApp() {
  return createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      console.error("Request failed:", error);
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Unable to load the dashboard. Check the server terminal." }));
    });
  });
}

async function handleRequest(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");

  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET", "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed.");
    return;
  }

  const pathname = new URL(request.url, "http://127.0.0.1").pathname;

  if (pathname === "/" || pathname === "/index.html") {
    const html = await readFile(pageUrl);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  }

  if (pathname === "/api/requests") {
    const records = JSON.parse(await readFile(dataUrl, "utf8"));
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(buildDashboard(records)));
    return;
  }

  if (pathname === "/favicon.ico") {
    response.writeHead(204);
    response.end();
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT === undefined ? 4173 : Number(process.env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const server = createApp();
  server.on("error", (error) => {
    console.error(`Unable to start the dashboard: ${error.message}`);
    console.error("If the port is in use, set PORT to another port and try again.");
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Work requests: http://127.0.0.1:${port}`);
    console.log("Synthetic data only. Press Ctrl+C to stop.");
  });
}
