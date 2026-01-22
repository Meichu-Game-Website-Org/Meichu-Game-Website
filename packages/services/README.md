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
