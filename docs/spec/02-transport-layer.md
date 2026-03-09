# Transport Layer Specification

**Version:** 1.0  
**Status:** Approved  
**Scope:** `src/protocols/http.ts` and `src/entrypoints/`

---

## Overview

The MCP Streamable HTTP transport layer handles all HTTP-based communication between MCP clients and the server. This document specifies the transport implementation using `WebStandardStreamableHTTPServerTransport` and Hono.

---

## Session Management

The server supports two session modes, controlled by `config.stateless`:

```mermaid
flowchart TD
    REQ["Incoming Request<br/>POST /mcp"]
    SESSID{"mcp-session-id<br/>header present?"}
    MAPHAS{"transports.has<br/>(sessionId)?"}
    STATELESS{"config.stateless?"}
    REUSE["Reuse existing transport"]
    NEWSTATELESS["New stateless transport<br/>sessionIdGenerator: undefined"]
    NEWSTATEFUL["New stateful transport<br/>sessionIdGenerator: randomUUID()"]
    CONNECT["mcpServer.connect(transport)"]
    HANDLE["transport.handleRequest(req)"]
    RESP["Web Standard Response"]

    REQ --> SESSID
    SESSID -- Yes --> MAPHAS
    SESSID -- No --> STATELESS
    MAPHAS -- Yes --> REUSE
    MAPHAS -- No --> STATELESS
    STATELESS -- Yes --> NEWSTATELESS
    STATELESS -- No --> NEWSTATEFUL
    NEWSTATELESS --> CONNECT
    NEWSTATEFUL --> CONNECT
    REUSE --> HANDLE
    CONNECT --> HANDLE
    HANDLE --> RESP
```

### Session lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant H as Hono /mcp
    participant T as Transport Map
    participant TR as WebStdTransport
    participant M as McpServer

    Note over C,M: Session initialization (first request)
    C->>H: POST /mcp { jsonrpc initialize }
    H->>TR: new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator })
    H->>M: mcpServer.connect(transport)
    TR-->>T: onsessioninitialized(id) → transports.set(id, transport)
    H->>TR: transport.handleRequest(req)
    TR-->>C: Response (mcp-session-id: abc123)

    Note over C,M: Subsequent requests (same session)
    C->>H: POST /mcp (mcp-session-id: abc123)
    H->>T: transports.get('abc123')
    T-->>H: existing transport
    H->>TR: transport.handleRequest(req)
    TR-->>C: Response (SSE stream or JSON)

    Note over C,M: Session teardown
    C->>H: DELETE /mcp (mcp-session-id: abc123)
    TR-->>T: onsessionclosed(id) → transports.delete(id)
    TR-->>C: 200 OK
```

---

## CORS Configuration

All HTTP responses include CORS headers via `hono/cors`:

| Header | Value |
|--------|-------|
| `Access-Control-Allow-Origin` | `*` |
| `Access-Control-Allow-Methods` | `GET, POST, DELETE, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type, mcp-session-id, Last-Event-ID, mcp-protocol-version` |
| `Access-Control-Expose-Headers` | `mcp-session-id, mcp-protocol-version` |

---

## Endpoints

| Path | Methods | Purpose |
|------|---------|---------|
| `/mcp` | `GET, POST, DELETE` | MCP Streamable HTTP transport |
| `/ping` | `GET` | Health check / benchmarking |

### `/mcp` — MCP Streamable HTTP

- `POST` — Send JSON-RPC message(s); may return SSE stream or JSON response
- `GET` — Establish standalone SSE stream for server-initiated notifications  
- `DELETE` — Terminate session (stateful mode only)

### `/ping` — Health check

Returns `{ "message": "pong" }` with status `200`. Used for benchmarking and liveness probes.

---

## Error Handling

| Condition | Response |
|-----------|----------|
| Invalid session ID | `404 Not Found` (handled by transport) |
| Missing session ID (non-init) | `400 Bad Request` (handled by transport) |
| Unsupported method (PUT, PATCH) | `405 Method Not Allowed` (handled by transport) |
| Internal error | `500 Internal Server Error` (JSON-RPC error envelope) |

---

## Stateless Mode

In stateless mode (`--stateless` or `BRAVE_MCP_STATELESS=true`), every request creates a fresh transport and MCP server instance with no session ID. This is suitable for serverless environments and load-balanced deployments where sticky sessions are not available.

```
POST /mcp → new transport (no session ID) → new McpServer → handle → response
POST /mcp → new transport (no session ID) → new McpServer → handle → response
```

---

## Runtime Behaviour Differences

| Concern | Node.js (`@hono/node-server`) | Bun (native) |
|---------|-------------------------------|--------------|
| HTTP server | `node:http` wrapped by `@hono/node-server` | `Bun.serve()` internally |
| SSE delivery | Via `TransformStream` / `ReadableStream` | Via `ReadableStream` (faster) |
| `crypto.randomUUID()` | Node.js `crypto` module | Bun `crypto` compat layer |
| JSON parsing | `JSON.parse()` | `JSON.parse()` (3.5× faster in Bun) |
| Connection handling | Node.js event emitter | Bun native I/O |

The Hono app and transport code is **identical** on both runtimes. Only the server bootstrap differs (5-line entrypoints).
