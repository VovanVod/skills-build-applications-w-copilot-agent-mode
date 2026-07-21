# OctoFit Frontend (React 19 + Vite)

This presentation tier uses `react-router-dom` for navigation and reads backend URLs from Vite environment variables.

## Environment Variable

Define `VITE_CODESPACE_NAME` so the app can call backend endpoints using:

`https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/`

Example `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

If `VITE_CODESPACE_NAME` is not set, the UI safely falls back to:

`http://localhost:8000/api/[component]/`

This prevents invalid URLs such as `https://undefined-8000.app.github.dev/...`.

## Available Routes

- `/users`
- `/activities`
- `/teams`
- `/leaderboard`
- `/workouts`

## API Response Compatibility

The frontend accepts multiple response shapes, including:

- Plain arrays
- Object responses with `items`, `data`, `results`, or `docs`
- Paginated metadata under `pagination` or `meta`
