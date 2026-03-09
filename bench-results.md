# MCP Server Benchmark Report

_Generated: 2026-03-09T10:06:26.346Z_
_Duration per scenario: 15s | Connections: 100 | Pipelining: 10_
_Node URL: `http://localhost:3001` | Bun URL: `http://localhost:3002`_

## GET /ping (raw throughput)

| Metric | Node.js | Bun | Speedup |
| ------ | ------- | --- | ------- |
| Requests/sec (avg) | 24,343 req/s | 11,206 req/s | **0.46×** |
| Requests/sec (max) | 26,080 req/s | 11,483 req/s | 0.44× |
| Throughput (avg)   | 6,490 KB/s | 2,473 KB/s | — |
| Latency p50        | 38 ms | 88 ms | — |
| Latency p99        | 81 ms | 110 ms | — |
| Latency p99.9      | N/A ms | N/A ms | — |
| 2xx responses      | 365,130 | 168,076 | — |
| Non-2xx responses  | 0 | 0 | — |
| Errors             | 0 | 0 | — |

## POST /mcp (MCP initialize)

| Metric | Node.js | Bun | Speedup |
| ------ | ------- | --- | ------- |
| Requests/sec (avg) | 1,342 req/s | 3,131 req/s | **2.33×** |
| Requests/sec (max) | 2,189 req/s | 4,128 req/s | 1.89× |
| Throughput (avg)   | 870 KB/s | 2,088 KB/s | — |
| Latency p50        | 2 ms | 1 ms | — |
| Latency p99        | 152 ms | 15 ms | — |
| Latency p99.9      | N/A ms | N/A ms | — |
| 2xx responses      | 20,133 | 46,962 | — |
| Non-2xx responses  | 0 | 0 | — |
| Errors             | 0 | 0 | — |

## Summary

| Scenario | Node.js avg req/s | Bun avg req/s | Bun Speedup |
| -------- | ----------------- | ------------- | ----------- |
| GET /ping (raw throughput) | 24,343 req/s | 11,206 req/s | **0.46×** |
| POST /mcp (MCP initialize) | 1,342 req/s | 3,131 req/s | **2.33×** |
