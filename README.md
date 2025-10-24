# Flatland: Ascension of Angles

A greyscale React + TypeScript prototype for *Flatland: Ascension of Angles*. Explore a 2D campus filled with regular polygons while simultaneously reading a 1D perception strip, converse with geometric scholars, and enter Strange Spaces to solve analytic puzzles that change your number of sides.

## Features

- Dual-canvas rendering: responsive top-down world view and a perception strip sampling a 110° FOV.
- Keyboard controls for translation (WASD), rotation (Q/E), conversation (T), and room interaction (F). Expert mode (X) hides the top view.
- Deterministic fixed-step simulation with polygon collision checks that keep agents from intersecting.
- Dialogue pane with branching JSON-driven conversations, numeric shortcuts (1–4), and progression effects (+1/−3 sides).
- Strange Spaces puzzles surfaced from JSON definitions that only grant side changes while in expert mode.
- Line agents create dynamic occlusion while wandering houses populate the world with enterable doors.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to explore the prototype. Use the dialogue pane on the left, canvases in the center, and HUD on the right to monitor sides, compass orientation, and expert status.

## Deployment to GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys the static Vite output to GitHub Pages.

1. Push the project to GitHub with `main` as the default branch (adjust the workflow if your default branch differs).
2. In the repository settings, open **Pages** and choose **GitHub Actions** as the source. GitHub will guide you through enabling deployments if this is the first run.
3. Each push to `main` will trigger the workflow, compile the site with an automatic base path, and publish it to the Pages environment.

After a run completes, the workflow summary and the Pages settings screen will show the live URL (e.g., `https://<username>.github.io/<repo>/`).

## Testing & Linting

```bash
npm run lint
npm run test
```

(Tests are scaffolding only; extend with Vitest and Testing Library as the prototype evolves.)
