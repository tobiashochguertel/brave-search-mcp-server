FROM node:lts-alpine@sha256:7fddd9ddeae8196abf4a3ef2de34e11f7b1a722119f91f28ddf1e99dcafdf114 AS builder

RUN apk add --no-cache openssl=3.5.8-r0

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci --ignore-scripts

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN npm run build

FROM node:lts-alpine@sha256:7fddd9ddeae8196abf4a3ef2de34e11f7b1a722119f91f28ddf1e99dcafdf114 AS release

RUN apk add --no-cache openssl=3.5.8-r0

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

# The server defaults to binding 127.0.0.1 for safe local execution. Inside a
# container the port must be reachable through the published mapping, so bind to
# all interfaces here. Deployments can still override BRAVE_MCP_HOST.
ENV BRAVE_MCP_HOST=0.0.0.0

RUN npm ci --ignore-scripts --omit-dev

USER node

ENTRYPOINT ["node", "dist/index.js"]
