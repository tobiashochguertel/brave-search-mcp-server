# Benchmarking Specification

**Version:** 1.0  
**Status:** Approved  
**Scope:** Node.js vs Bun runtime performance comparison

---

## Objective

Measure real-world performance differences between the Node.js and Bun runtimes running the same MCP server codebase. Provide reproducible benchmark data to validate (or refute) expected Bun performance gains.

---

## Benchmark Scenarios

### 1. HTTP Throughput — `/ping` endpoint

Measures raw HTTP stack overhead (routing, response serialization, connection handling). No business logic, no external API calls.

**Why:** Isolates the pure framework + runtime overhead.

### 2. MCP Initialize Latency

Measures time to complete an MCP `initialize` handshake. Includes session creation, McpServer instantiation, tool registration.

**Why:** This is the critical path for every new MCP client connection (e.g., Claude Desktop launching the server).

### 3. Process Startup Time

Measures time from process spawn to first HTTP response. Critical for stdio-mode deployments where the client spawns the server per session.

**Why:** Bun's JIT-free approach means dramatically faster cold starts.

### 4. SSE Streaming Throughput

Measures bytes/second for sustained SSE streaming (simulates a long-running Answers API response).

**Why:** Validates Bun's native async-generator SSE advantage.

---

## Test Environment Setup

```bash
# Terminal 1: Node.js server on port 3001
npm run start:node -- --port 3001

# Terminal 2: Bun server on port 3002
bun run start:bun -- --port 3002
```

Or via Docker Compose (isolated, reproducible):

```bash
docker compose -f docker-compose.benchmark.yml up -d
```

---

## Benchmark Commands

### Scenario 1: HTTP Throughput

```bash
# Install autocannon once: npm i -g autocannon
npx autocannon -c 100 -d 30 -p 10 http://localhost:3001/ping
npx autocannon -c 100 -d 30 -p 10 http://localhost:3002/ping
```

Parameters:
- `-c 100` — 100 concurrent connections
- `-d 30` — 30 second duration
- `-p 10` — 10 pipelined requests per connection

### Scenario 2: MCP Initialize Latency

```bash
# Uses the k6 script in scripts/bench-mcp-init.js
# Install k6: brew install k6
k6 run --vus 10 --duration 30s scripts/bench-mcp-init.js -e MCP_PORT=3001
k6 run --vus 10 --duration 30s scripts/bench-mcp-init.js -e MCP_PORT=3002
```

### Scenario 3: Process Startup Time

```bash
# Node.js
hyperfine --runs 50 'node dist/index.js --transport http --port 9001 &; sleep 0.5; curl -s http://localhost:9001/ping; kill %1'

# Bun
hyperfine --runs 50 'bun src/entrypoints/bun.ts --port 9002 &; sleep 0.1; curl -s http://localhost:9002/ping; kill %1'
```

---

## Expected Results

Based on published Bun benchmarks (Bun 1.3.x):

| Metric | Node.js v24 LTS | Bun 1.3.x | Expected gain |
|--------|-----------------|------------|---------------|
| HTTP req/s (hello world) | ~64k | ~160k | **2.5×** |
| HTTP req/s (JSON response) | ~45k | ~120k | **2.7×** |
| Process startup | ~250ms | ~50ms | **4.8×** |
| `Response.json()` latency | baseline | **3.5×** | faster |
| SSE first byte | ~5ms | ~2ms | ~2.5× |

---

## Reporting

Record results in `docs/benchmarks/YYYY-MM-DD.md` with:
- Date and environment (CPU, RAM, OS, Node version, Bun version)
- Raw autocannon output for both runtimes
- Calculated speedup ratios
- Any anomalies or notes

---

## docker-compose.benchmark.yml

```yaml
services:
  mcp-node:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:8080"
    environment:
      - BRAVE_API_KEY=${BRAVE_API_KEY}
      - BRAVE_MCP_TRANSPORT=http
      - BRAVE_MCP_PORT=8080
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 512M

  mcp-bun:
    build:
      context: .
      dockerfile: Dockerfile.bun
    ports:
      - "3002:8080"
    environment:
      - BRAVE_API_KEY=${BRAVE_API_KEY}
      - BRAVE_MCP_TRANSPORT=http
      - BRAVE_MCP_PORT=8080
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 512M
```

Resource limits ensure fair comparison between runtimes.
