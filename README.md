# Shikaku — Daily Puzzle

A playable **Shikaku** (四角に切れ) logic puzzle built with React and Tailwind CSS v4.

## Rules

Divide the grid into non-overlapping rectangles. Each rectangle must contain **exactly one** numbered clue, and the rectangle's area must **equal** that number.

## Features (MVP)

- Grid sizes: 5×5, 7×7, 9×9, 10×10
- Click + drag to place rectangles with live valid/invalid feedback
- Click a placed rectangle to remove it
- Solve timer starts when you click **Start puzzle** (grid is blurred until then)
- **Leaderboard** — save your solve time with your name (stored in browser for now)
- Progress counter, reset, and new puzzle
- Light / dark theme using the project color tokens
- All puzzles are **solver-verified** (every layout has at least one valid solution)

## Run locally

**If `npm` is not recognized** or PowerShell blocks scripts, use **Command Prompt** or PowerShell from the project folder:

```cmd
install.cmd    :: first time only
dev.cmd        :: starts the game
```

PowerShell scripts (`dev.ps1`) may be blocked by execution policy. Use `dev.cmd` instead, or run once:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or add Node to PATH for this session, then use npm normally:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

**Permanent fix:** close all terminals, open a new PowerShell window, and try `npm -v` again. If it still fails, restart Windows or reinstall Node.js and check "Add to PATH".

## Build

```bash
npm run build
npm run preview
```

## Regenerate puzzles

```bash
node scripts/generate-puzzles.mjs > scripts/generated.json
node scripts/emit-puzzles-ts.mjs
node scripts/verify-all.mjs
```
