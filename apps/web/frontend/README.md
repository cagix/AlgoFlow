# AlgoPad Frontend

React + TypeScript frontend for AlgoPad — a Java algorithm visualizer.

> 🤖 This entire frontend was vibe-coded using [Amazon Q Developer](https://aws.amazon.com/q/developer/) — zero manual code changes.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Monaco Editor** — code editor with Java IntelliSense
- **Canvas API** — custom visualization renderer

## Project Structure

```
src/
├── api/backend.ts              # Backend API calls
├── constants/
│   ├── algorithms.ts           # Default code, examples, templates
│   └── javaCompletions.ts      # Monaco Java completions
├── visualizer/
│   ├── engine/
│   │   ├── SimpleEngine.ts     # Command processing & state
│   │   └── SimpleRenderer.ts   # Canvas rendering
│   ├── AlgorithmVisualizerPane.tsx
│   ├── Controls.tsx            # Playback controls
│   ├── VisualizerCanvas.tsx    # Canvas container + panels
│   └── visualizerEngine.ts    # Shared engine instance
├── App.tsx                     # Root layout
├── JavaEditor.tsx              # Editor + toolbar
└── main.tsx                    # Entry point
```

## Supported Visualizations

- **Arrays** — 1D and 2D with selection/patch highlighting
- **Graphs** — Undirected, directed, weighted (adjacency matrix)
- **Trees** — Binary trees via `@Tree` annotation
- **Recursion** — Call stack tracking
- **Variables** — Local variable display
- **Logs** — Console output

## Backend Integration

The frontend sends Java code to the backend, which returns a list of visualization commands. See the backend README for the command protocol.
