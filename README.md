# Flatland: Ascension of Angles Prototype

A React + TypeScript prototype of **Flatland: Ascension of Angles**, featuring a simultaneous top-down view and perception strip, dialogue-driven progression, and safe polygonal movement.

## Getting Started

```bash
npm install
npm run dev
```

The development server runs with Vite. Open the provided URL in a modern desktop browser.

## Controls

- **W/A/S/D** – Translate in the plane
- **Q/E** – Rotate heading
- **T** – Initiate dialogue with nearby agents
- **X** – Toggle Expert Mode (hides the top-down view)
- **1–4** – Choose dialogue responses
- **Esc** – Exit the current conversation

## Project Highlights

- Deterministic fixed-timestep simulation with simple collision resolution.
- Canvas-based rendering for the fogged top-down map and the 1D perception strip.
- JSON-driven content for levels, dialogues, rooms, and puzzles.
- Zustand store orchestrating simulation state, dialogues, and progression.

> Note: This is an early prototype with simplified AI and puzzle handling. It focuses on the architectural scaffolding described in the specification.
