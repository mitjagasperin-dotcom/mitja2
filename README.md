# Flatland: Ascension of Angles

Prototype implementation of a greyscale geometric exploration game built with React and TypeScript. The client renders a simultaneous 2D top-down view alongside a 1D perception strip, supports polygonal agents with dialogue, and includes puzzle rooms inspired by analytic geometry.

## Getting started

```bash
npm install
npm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173). Keyboard controls:

- **W/A/S/D** – Translate the player.
- **Q/E** – Rotate.
- **T** – Initiate dialogue with the closest agent.
- **X** – Toggle expert mode (hides the 2D view; puzzles contribute to progression).
- **Esc** – Clear pending talk input.

## Testing

```bash
npm test
```

Vitest runs unit tests for core geometry helpers.
