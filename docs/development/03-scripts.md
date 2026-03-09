# Scripts Reference

All scripts are available both via `npm run <script>` and `task <name>`.

## Build

| npm | Task | Description |
|---|---|---|
| `npm run build` | `task build` | Compile TypeScript → `dist/` |
| `npm run watch` | `task dev:http` | Watch + rebuild on changes |

## Run

| npm | Task | Description |
|---|---|---|
| `npm start` | — | Default entrypoint (STDIO mode, auto-detects runtime) |
| `npm run start:node` | — | HTTP mode, Node.js entrypoint |
| `npm run start:bun` | — | HTTP mode, Bun entrypoint (no compile step) |
| `npm run dev:node` | `task dev:http` | Dev: ts-node, Node.js |
| `npm run dev:bun` | `task dev:http:bun` | Dev: Bun hot reload |

## Format & lint

| npm | Task | Description |
|---|---|---|
| `npm run format` | `task format` | Auto-format with Prettier |
| `npm run format:check` | `task lint` | Check formatting (CI) |
| `npm run prepare` | — | Format + build (auto on `npm install`) |

## Test

| npm | Task | Description |
|---|---|---|
| `npm test` | `task test` | Unit tests |
| `npm run test:watch` | `task test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | `task test:coverage` | Unit tests + coverage report |
| `npm run test:e2e` | `task test:e2e` | E2e tests (all transports) |
| `npm run test:e2e:http` | `task test:e2e:http` | E2e HTTP transport only |
| `npm run test:e2e:stdio` | `task test:e2e:stdio` | E2e stdio transport only |
| `npm run test:all` | `task test:all` | Unit + e2e |

## Docker

| Task | Description |
|---|---|
| `task docker:build` | Build Node.js image (`brave-search-mcp-server:node`) |
| `task docker:build:bun` | Build Bun image (`brave-search-mcp-server:bun`) |
| `task docker:build:nc` | Build Node.js image, no cache |
| `task docker:build:bun:nc` | Build Bun image, no cache |
| `task docker:lint` | Lint both Dockerfiles with hadolint |
| `task docker:up` | Start via docker-compose |
| `task docker:down` | Stop docker-compose |
| `task docker:logs` | Tail docker-compose logs |
| `task docker:compose:validate` | Validate compose files |

## Benchmark

| Task | Description |
|---|---|
| `task bench:start` | Start Node.js + Bun via Docker Compose (ports 3001/3002) |
| `task bench:stop` | Stop benchmark compose stack |
| `task bench:report` | Run full benchmark → `bench-results.md` |
| `task bench:docker:full` | Build images + start + benchmark + stop |
| `task bench:local:full` | Build + start local servers + benchmark + stop |
| `task bench:ping:node` | Quick autocannon ping against Node.js |
| `task bench:ping:bun` | Quick autocannon ping against Bun |
| `task bench:ping` | Both ping benchmarks sequentially |

## Tools

| npm | Description |
|---|---|
| `npm run inspector` | Launch MCP Inspector (STDIO mode) |
| `npm run inspector:http` | Launch MCP Inspector (HTTP mode) |
| `npm run smithery:build` | Build for Smithery.ai |
| `npm run smithery:dev` | Dev mode for Smithery.ai |

## Release

| Task | Description |
|---|---|
| `task release:check` | Lint + build + test + both Docker builds |
| `task release:full` | Full check including e2e tests |
