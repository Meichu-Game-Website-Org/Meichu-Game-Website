# Meichu Game Web (New)

This repository contains the source code for the Meichu Game websites, structured as a monorepo.

## Project Structure

*   **apps/**
    *   **old-site/**: The legacy website serving years 2019-2025. Built with Vue 2 + Webpack.
    *   **site-2026/**: The new website for 2026. Built with Vue 3 + Vite + Node 24.
*   **packages/**
    *   **services/**: Shared API services and utilities.
*   **dev-proxy.js**: A local development proxy server that routes traffic between different apps based on the URL year.

## Getting Started

### Prerequisites

*   **Node.js**: The project is configured to support newer Node versions (e.g., Node 24) for new apps, while maintaining compatibility for legacy apps via pnpm settings.
*   **pnpm**: Package manager (v10+).

### Installation

```bash
pnpm install
```

### Development

To start the development environment, simply run:

```bash
pnpm start
```

This command simultaneously starts:
1.  `old-site` (Port 3030)
2.  `site-2026` (and any other `site-*` apps)
3.  `dev-proxy` (Port 8080)

**Open your browser at:** [http://localhost:8080](http://localhost:8080)

## How Routing Works

The **Proxy Server** (`dev-proxy.js`) listens on port `8080` and routes requests as follows:

*   **/2026/** -> Routes to **site-2026** (Port 22026)
*   **/2027/** -> Routes to **site-2027** (Port 22027) [Future]
*   **Everything else** -> Routes to **old-site** (Port 3030)

## How to Add a New Year (e.g., 2027)

We follow a **Convention over Configuration** approach. To add a new year site, you do **not** need to modify the proxy server or startup scripts if you follow these rules.

1.  **Create the App**:
    Create a new directory in `apps/`, e.g., `apps/site-2027`.

2.  **Configure Vite Port**:
    In your new app's `vite.config.js`, set the server port to **20000 + Year**.
    
    *Example for 2027:*
    ```javascript
    // apps/site-2027/vite.config.js
    export default defineConfig({
      base: '/2027/', // Important: Must match the year
      server: {
        port: 22027,      // Rule: 20000 + 2027
        hmr: {
            port: 22027   // Keep HMR port consistent
        }
      },
      // ...
    })
    ```

3.  **Run**:
    Just run `pnpm start` again.
    
    *   The command `pnpm --filter "site-*" --parallel dev` will automatically detect and start `site-2027`.
    *   The `dev-proxy.js` will automatically route `/2027` requests to `http://localhost:22027`.

## Technology Stack

*   **Old Site**: Vue 2, Vue CLI, Webpack, BootstrapVue
*   **New Sites (2026+)**: Vue 3, Vite, Tailwind/Custom CSS
*   **Package Manager**: pnpm (configured with `shamefully-hoist=true` for legacy compatibility)
