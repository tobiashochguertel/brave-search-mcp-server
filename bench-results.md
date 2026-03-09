# MCP Server Benchmark Report

_Generated: 2026-03-09T10:40:16.944Z_
_Duration per scenario: 20s | Connections: 100 | Pipelining: 10_
_Node URL: `http://localhost:3001` | Bun URL: `http://localhost:3002`_

## GET /ping (raw throughput)

| Metric | Node.js | Bun | Speedup |
| ------ | ------- | --- | ------- |
| Requests/sec (avg) | 45,058 req/s | 17,918 req/s | **0.40×** |
| Requests/sec (max) | 82,530 req/s | 18,473 req/s | 0.22× |
| Throughput (avg)   | 7,612 KB/s | 2,205 KB/s | — |
| Latency p50        | 12 ms | 54 ms | — |
| Latency p99        | 134 ms | 75 ms | — |
| Latency p99.9      | N/A ms | N/A ms | — |
| 2xx responses      | 901,099 | 358,358 | — |
| Non-2xx responses  | 0 | 0 | — |
| Errors             | 0 | 0 | — |

## POST /mcp (MCP initialize)

| Metric | Node.js | Bun | Speedup |
| ------ | ------- | --- | ------- |
| Requests/sec (avg) | 2,104 req/s | 3,694 req/s | **1.76×** |
| Requests/sec (max) | 3,030 req/s | 5,230 req/s | 1.73× |
| Throughput (avg)   | 1,364 KB/s | 2,464 KB/s | — |
| Latency p50        | 2 ms | 1 ms | — |
| Latency p99        | 27 ms | 15 ms | — |
| Latency p99.9      | N/A ms | N/A ms | — |
| 2xx responses      | 42,066 | 73,872 | — |
| Non-2xx responses  | 0 | 0 | — |
| Errors             | 0 | 0 | — |

## Summary

| Scenario | Node.js avg req/s | Bun avg req/s | Bun Speedup |
| -------- | ----------------- | ------------- | ----------- |
| GET /ping (raw throughput) | 45,058 req/s | 17,918 req/s | **0.40×** |
| POST /mcp (MCP initialize) | 2,104 req/s | 3,694 req/s | **1.76×** |
