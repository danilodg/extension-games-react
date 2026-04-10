# AGENTS.md - Extension Games React

This is a Chrome extension built with React, TypeScript, and Vite for comparing game prices across different stores.

## Project Structure

```
extension-games-react/
├── src/
│   ├── App.tsx           # Main popup UI component
│   ├── popup.tsx         # Popup entry point
│   ├── main.tsx          # Main entry point (for dev)
│   ├── background/
│   │   └── background.ts # Service worker for extension
│   └── assets/           # Static assets
├── public/                # Public assets
├── popup.html             # Popup HTML template
├── index.html             # Main HTML template
├── vite.config.ts         # Vite configuration with multi-entry build
└── eslint.config.js       # ESLint configuration
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run lint` | Run ESLint on all `.ts` and `.tsx` files |
| `npm run preview` | Preview production build locally |

## TypeScript Configuration

- **Strict mode enabled** (`strict: true`)
- Target: ES2020
- Module: ESNext with bundler resolution
- `verbatimModuleSyntax: true` - All imports/exports must be explicit
- `noUnusedLocals: true` and `noUnusedParameters: true` - No unused code allowed

## Code Style Guidelines

### Imports

- Use double quotes for imports: `import { Box } from "@mui/material";`
- Group imports in this order:
  1. React/core imports
  2. Third-party library imports (MUI, etc.)
  3. Internal imports (components, utils)
  4. CSS/style imports
- Always use named exports for MUI components

```typescript
// Correct
import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";

// Incorrect
import { Box } from '@mui/material';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `App`, `GameCard` |
| Hooks | camelCase with `use` prefix | `useGameData` |
| Functions | camelCase | `fetchGameFromStorage` |
| Types/Interfaces | PascalCase | `GameInfo`, `StorageData` |
| Variables | camelCase | `gameList`, `currentPrice` |
| Constants | camelCase or UPPER_SNAKE | `MAX_RETRIES` or `maxRetries` |

### TypeScript Types

- Use `type` keyword for simple type aliases
- Use `interface` for object shapes that may be extended
- Always annotate function parameters and return types

```typescript
// Good
type GameInfo = {
  gameName: string;
  price: string;
};

interface StorageData {
  games: GameInfo[];
  lastUpdated: Date;
}

// Function annotations
function fetchGame(id: string): Promise<GameInfo | null>
```

### React Components

- Use functional components with hooks
- Always export default for page/entry components
- Use named exports for reusable components
- Destructure props when possible

```typescript
// Page/entry component
const App = () => { ... };
export default App;

// Reusable component
export const GameCard = ({ game }: GameCardProps) => { ... };
```

### MUI Usage

- Use `sx` prop for inline styles instead of separate CSS files when appropriate
- Prefer MUI components over raw HTML elements
- Use MUI theme colors: `color: "primary.main"`, `bgcolor: "background.paper"`

```typescript
<Box sx={{ p: 2, display: "flex", gap: 1 }}>
  <Typography variant="h6" fontWeight="bold">
    Title
  </Typography>
</Box>
```

### Error Handling

- Always handle Chrome API errors (check `chrome.runtime.lastError`)
- Use optional chaining when accessing potentially undefined values
- Provide fallback values for null/undefined cases

```typescript
// Chrome API error handling
chrome.tabs.sendMessage(tabId, { type: "CHECK_STEAM" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }
  // Handle response
});

// Optional chaining
const gameName = game?.gameName ?? "Unknown";
```

### Chrome Extension Patterns

- Use `chrome.storage.local` for persistent storage
- Use `chrome.storage.onChanged` for reactive updates
- Use `chrome.tabs.onUpdated` and `chrome.tabs.onActivated` for tab events
- Service worker runs in `src/background/background.ts`

```typescript
// Storage
chrome.storage.local.get("key", (result) => { ... });
chrome.storage.local.set({ key: value });

// Message passing
chrome.runtime.onMessage.addListener((message) => { ... });
chrome.tabs.sendMessage(tabId, { type: "ACTION" }, callback);
```

## ESLint Rules

The project uses:
- `@typescript-eslint/recommended` - TypeScript ESLint rules
- `react-hooks/recommended` - React hooks best practices
- `react-refresh/only-export-components` - Only export components with react-refresh

Key rules enforced:
- No unused variables (`noUnusedLocals`, `noUnusedParameters`)
- Strict TypeScript type checking
- React hooks rules (exhaustive-deps, etc.)

## Build Output

Vite builds to `dist/` with multiple entry points:
- `popup.js` - Popup script
- `background.js` - Service worker
- Assets in root of dist/

## Notes

- This is a Chrome extension project - code must comply with Manifest V3
- The popup renders `App.tsx` into `#root` element
- Background script handles cross-tab communication and storage
