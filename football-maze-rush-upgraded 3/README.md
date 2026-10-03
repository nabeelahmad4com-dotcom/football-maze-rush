# Football Maze Rush

A two-player browser maze race using Node.js, Express, Socket.IO, HTML Canvas, CSS and vanilla JavaScript.

## Run on macOS
1. Install Node.js LTS from https://nodejs.org/ if needed.
2. Open this folder in VS Code.
3. In Terminal, run:
   ```bash
   npm install
   npm start
   ```
4. Open http://localhost:3000.
5. Create a room, then share the room code with your friend. Both devices must reach the same server; for play over the internet, deploy this Node app to a host that supports WebSockets.

## Controls
- WASD or arrow keys on desktop.
- On-screen directional buttons on touch screens.
- Get a clue opens a logic question and reveals the next route direction.
- Sound can be muted.

## Current implementation
- Two-player Socket.IO rooms, shared maze state, server-validated wall collision and goal scoring.
- Both players spawn at the same start tile; goal resets both to that tile.
- Easy 39×39, Medium 49×49, Hard 59×59, Extreme 69×69 tile boards. Room creator's selection applies to both players.
- 1, 3, 5 and 10 minute match durations; final score decides the result.
- Canvas footballer sprites, team colors, shirt numbers, moving legs and ball, responsive layout, keyboard and touch controls.
- IQ clue questions and simple sound effects.

## Scope note
This version does not yet implement persistent accounts, XP/levels, daily challenges, unlockable cosmetics, achievements, ranked leaderboards, reconnect-to-existing-player identity, or separate Sudden Death/Time Attack modes. The existing Classic race and IQ clue flow are retained rather than presenting unfinished features as complete.
