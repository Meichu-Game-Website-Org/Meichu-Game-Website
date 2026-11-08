# @meichu/services

Shared services and API logic for Meichu Game websites.

## Usage

```javascript
import { Game as GameApi } from '@meichu/services'

GameApi.fetchAllGames().then(games => {
  // ...
})
```

## Structure

- `src/api/`: Individual service modules
- `src/config.js`: Shared configuration (API paths, etc)

## Request handling

All API modules use an isolated Axios client with a 10-second timeout and `withCredentials: true`. Existing endpoint paths and parameter serialization are unchanged.

`createResource` / `loadResource` provide `loading`, `success`, `empty`, and `error` states. Each load clears previous data; only the latest request may update the state. Rejections become a user-facing error message rather than an unhandled promise. `invalidateResource` prevents pending work from updating a component after it leaves the page. The optional `resourceMixin` supplies state and teardown hooks for the Vue 2 and Vue 3 Options API.

The 2026 core pages and the 2025/2026 announcement readers use these states with an explicit retry action. Older pages retain their existing presentation. `readGame`, `readGames`, `readNews`, `readArchives`, and `readOptions` check the data needed by these views, so incomplete responses enter the same recovery flow.
