# Build from the repository root: docker build -f apps/old-site/Dockerfile .
FROM node:24-alpine AS build-stage
ENV CI=true
WORKDIR /app
RUN npm install --global pnpm@10.28.1

COPY . .
RUN --mount=type=cache,id=meichu-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --store-dir=/pnpm/store
RUN pnpm --filter old-site build && pnpm --filter site-2026 build
RUN pnpm --filter sharing-server --prod deploy --legacy /out/sharing-server

# nginx keeps serving static assets; a local Node service renders dynamic OG heads.
# Use one Alpine base for Node and native PNG dependencies, without copying a Node
# binary between different Alpine releases.
FROM node:24-alpine AS production-stage
RUN apk add --no-cache nginx && rm -f /etc/nginx/http.d/default.conf \
    && mkdir -p /run/nginx
WORKDIR /app
ENV SHARING_HOST=127.0.0.1 \
    SHARING_PORT=8787 \
    SHARING_DIST_ROOT=/usr/share/nginx/html \
    SHARING_ASSET_ROOT=/app
COPY apps/old-site/default.conf /etc/nginx/http.d/default.conf
COPY --from=build-stage /app/apps/old-site/dist /usr/share/nginx/html/
COPY --from=build-stage /app/apps/site-2026/dist /usr/share/nginx/html/2026/
COPY --from=build-stage /out/sharing-server /app/apps/sharing-server/
COPY packages/services/src /app/packages/services/src/
COPY scripts/lib /app/scripts/lib/
COPY packages/assets/fonts/KozGoPr6N-Bold.otf packages/assets/fonts/KozGoPr6N-Regular.otf /app/packages/assets/fonts/
COPY scripts/start-container.mjs /app/scripts/start-container.mjs
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
CMD ["node", "/app/scripts/start-container.mjs"]
