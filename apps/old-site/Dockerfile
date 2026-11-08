# Build from the repository root: docker build -f apps/old-site/Dockerfile .
FROM node:24-alpine AS build-stage
ENV CI=true
WORKDIR /app
RUN npm install --global pnpm@10.28.1

COPY . .
RUN --mount=type=cache,id=meichu-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --store-dir=/pnpm/store
RUN pnpm --filter old-site build && pnpm --filter site-2026 build

# Both SPAs share one origin. The 2026 app owns its /2026/ asset namespace.
FROM nginx:stable-alpine AS production-stage
RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY apps/old-site/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/apps/old-site/dist /usr/share/nginx/html/
COPY --from=build-stage /app/apps/site-2026/dist /usr/share/nginx/html/2026/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
