#!/usr/bin/env node
/**
 * Benchmark script: Node.js vs Bun MCP Server performance comparison
 *
 * Usage:
 *   npx ts-node scripts/benchmark.ts
 *   NODE_URL=http://localhost:3001 BUN_URL=http://localhost:3002 npx ts-node scripts/benchmark.ts
 *   BENCH_DURATION=10 BENCH_CONNECTIONS=50 node --loader ts-node/esm scripts/benchmark.ts
 *   bun scripts/benchmark.ts
 *
 * Works for both local and Docker deployments.
 */

import autocannon, { type Result } from "autocannon";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const NODE_URL = process.env.NODE_URL ?? "http://localhost:3001";
const BUN_URL = process.env.BUN_URL ?? "http://localhost:3002";
const DURATION = parseInt(process.env.BENCH_DURATION ?? "20");
const CONNECTIONS = parseInt(process.env.BENCH_CONNECTIONS ?? "100");
const PIPELINING = parseInt(process.env.BENCH_PIPELINING ?? "10");
const OUTPUT_FILE = process.env.BENCH_OUTPUT ?? "bench-results.md";

const MCP_INIT_BODY = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "bench-client", version: "1.0.0" },
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url: string, retries = 20): Promise<boolean> {
  const pingUrl = url.endsWith("/") ? `${url}ping` : `${url}/ping`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(pingUrl);
      if (res.ok) return true;
    } catch {
      // not ready yet
    }
    await sleep(500);
  }
  return false;
}

function runAutocannon(opts: autocannon.Options): Promise<Result> {
  return new Promise((resolve, reject) => {
    const instance = autocannon(opts, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    autocannon.track(instance, { renderProgressBar: true });
  });
}

function fmt(n: number | undefined | null, unit = ""): string {
  if (n == null || isNaN(n)) return `N/A${unit}`;
  return `${Math.round(n).toLocaleString("en")}${unit}`;
}

function speedup(bunVal: number, nodeVal: number): string {
  if (nodeVal === 0) return "N/A";
  const ratio = bunVal / nodeVal;
  return `${ratio.toFixed(2)}×`;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------
interface ScenarioResult {
  name: string;
  node: Result;
  bun: Result;
}

async function benchPing(): Promise<ScenarioResult> {
  console.log("\n🔵  Scenario: GET /ping  (raw HTTP throughput)");
  console.log(`   Node.js → ${NODE_URL}/ping`);
  const node = await runAutocannon({
    url: `${NODE_URL}/ping`,
    connections: CONNECTIONS,
    pipelining: PIPELINING,
    duration: DURATION,
    title: "Node.js /ping",
  });

  await sleep(2000);

  console.log(`   Bun     → ${BUN_URL}/ping`);
  const bun = await runAutocannon({
    url: `${BUN_URL}/ping`,
    connections: CONNECTIONS,
    pipelining: PIPELINING,
    duration: DURATION,
    title: "Bun /ping",
  });

  return { name: "GET /ping (raw throughput)", node, bun };
}

async function benchMcpInit(): Promise<ScenarioResult> {
  console.log("\n🟢  Scenario: POST /mcp  MCP initialize  (latency)");
  const baseOpts: Partial<autocannon.Options> = {
    connections: 10, // lower concurrency for stateful protocol
    pipelining: 1,
    duration: DURATION,
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: MCP_INIT_BODY,
  };

  console.log(`   Node.js → ${NODE_URL}/mcp`);
  const node = await runAutocannon({
    ...(baseOpts as autocannon.Options),
    url: `${NODE_URL}/mcp`,
    title: "Node.js /mcp init",
  });

  await sleep(2000);

  console.log(`   Bun     → ${BUN_URL}/mcp`);
  const bun = await runAutocannon({
    ...(baseOpts as autocannon.Options),
    url: `${BUN_URL}/mcp`,
    title: "Bun /mcp init",
  });

  return { name: "POST /mcp (MCP initialize)", node, bun };
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------
function renderMarkdown(results: ScenarioResult[]): string {
  const now = new Date().toISOString();
  const lines: string[] = [
    "# MCP Server Benchmark Report",
    "",
    `_Generated: ${now}_`,
    `_Duration per scenario: ${DURATION}s | Connections: ${CONNECTIONS} | Pipelining: ${PIPELINING}_`,
    `_Node URL: \`${NODE_URL}\` | Bun URL: \`${BUN_URL}\`_`,
    "",
  ];

  for (const { name, node, bun } of results) {
    lines.push(`## ${name}`, "");
    lines.push(
      "| Metric | Node.js | Bun | Speedup |",
      "| ------ | ------- | --- | ------- |",
      `| Requests/sec (avg) | ${fmt(node.requests.average)} req/s | ${fmt(bun.requests.average)} req/s | **${speedup(bun.requests.average, node.requests.average)}** |`,
      `| Requests/sec (max) | ${fmt(node.requests.max)} req/s | ${fmt(bun.requests.max)} req/s | ${speedup(bun.requests.max, node.requests.max)} |`,
      `| Throughput (avg)   | ${fmt(node.throughput?.average ? node.throughput.average / 1024 : node.throughput as unknown as number / 1024, " KB/s")} | ${fmt(bun.throughput?.average ? bun.throughput.average / 1024 : bun.throughput as unknown as number / 1024, " KB/s")} | — |`,
      `| Latency p50        | ${fmt(node.latency.p50, " ms")} | ${fmt(bun.latency.p50, " ms")} | — |`,
      `| Latency p99        | ${fmt(node.latency.p99, " ms")} | ${fmt(bun.latency.p99, " ms")} | — |`,
      `| Latency p99.9      | ${fmt(node.latency.p999, " ms")} | ${fmt(bun.latency.p999, " ms")} | — |`,
      `| 2xx responses      | ${fmt(node["2xx"])} | ${fmt(bun["2xx"])} | — |`,
      `| Non-2xx responses  | ${fmt(node.non2xx)} | ${fmt(bun.non2xx)} | — |`,
      `| Errors             | ${fmt(node.errors)} | ${fmt(bun.errors)} | — |`,
    );
    lines.push("");
  }

  lines.push("## Summary", "");
  const rows = results.map(({ name, node, bun }) => {
    const ratio = node.requests.average > 0
      ? (bun.requests.average / node.requests.average).toFixed(2)
      : "N/A";
    return `| ${name} | ${fmt(node.requests.average)} req/s | ${fmt(bun.requests.average)} req/s | **${ratio}×** |`;
  });
  lines.push(
    "| Scenario | Node.js avg req/s | Bun avg req/s | Bun Speedup |",
    "| -------- | ----------------- | ------------- | ----------- |",
    ...rows,
    "",
  );

  return lines.join("\n");
}

function renderConsoleTable(results: ScenarioResult[]): void {
  console.log("\n\n═══════════════════════════════════════════════════════════");
  console.log("  BENCHMARK RESULTS SUMMARY");
  console.log("═══════════════════════════════════════════════════════════\n");

  for (const { name, node, bun } of results) {
    const ratio =
      node.requests.average > 0
        ? (bun.requests.average / node.requests.average).toFixed(2)
        : "N/A";
    console.log(`  📊 ${name}`);
    console.log(
      `     Node.js: ${fmt(Math.round(node.requests.average))} req/s  ` +
        `(p50=${node.latency.p50}ms  p99=${node.latency.p99}ms)`,
    );
    console.log(
      `     Bun:     ${fmt(Math.round(bun.requests.average))} req/s  ` +
        `(p50=${bun.latency.p50}ms  p99=${bun.latency.p99}ms)`,
    );
    console.log(`     → Bun is ${ratio}× faster\n`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  MCP Server Benchmark: Node.js vs Bun");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Node URL : ${NODE_URL}`);
  console.log(`  Bun URL  : ${BUN_URL}`);
  console.log(`  Duration : ${DURATION}s per scenario`);
  console.log(`  Conns    : ${CONNECTIONS}  Pipelining: ${PIPELINING}`);

  // Wait for servers
  console.log("\n⏳  Waiting for servers to be ready...");
  const [nodeOk, bunOk] = await Promise.all([
    waitForServer(NODE_URL),
    waitForServer(BUN_URL),
  ]);

  if (!nodeOk) {
    console.error(`✗ Node.js server not reachable at ${NODE_URL}/ping`);
    process.exit(1);
  }
  if (!bunOk) {
    console.error(`✗ Bun server not reachable at ${BUN_URL}/ping`);
    process.exit(1);
  }
  console.log("✓ Both servers ready\n");

  const results: ScenarioResult[] = [];
  results.push(await benchPing());
  await sleep(3000);
  results.push(await benchMcpInit());

  renderConsoleTable(results);

  // Write markdown report
  const { writeFileSync } = await import("node:fs");
  const md = renderMarkdown(results);
  writeFileSync(OUTPUT_FILE, md, "utf8");
  console.log(`\n📄 Full report written to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
