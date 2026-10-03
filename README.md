# Football Maze Rush

## Run
1. Open this folder in VS Code.
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:3000

Create a room and choose a timer (1, 3, 5, or 10 minutes) and maze difficulty (Easy, Medium, Hard, Extreme). The room creator's settings apply to both players. Share the room code with your friend. Both players need to connect to the same server/network address to play together.

Controls: WASD or arrow keys; mobile directional buttons. Use Get a clue to answer a logic question and reveal the next route direction.


Update: Easy difficulty now starts with a 39×39 tile maze. Player sprites have clearer kits, numbered shirts, running legs, and a ball positioned by the feet.


Both players now spawn at the same start tile and race through the same maze to the shared goal. After a goal, both reset to that same start tile.


## Update notes
- Both players spawn at the same start tile.
- The selected base difficulty is shared by the room; maze size increases by one logical cell after each two combined goals, capped at 69×69.
- Server validates moves against maze walls and applies a short input throttle.
- If both players disconnect, the empty room is removed.
- Note: reconnection identity, persistent progression, daily challenges, and full separate game modes are not included yet.
