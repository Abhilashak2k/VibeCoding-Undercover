# Classy Multiplayer Game

A web-hosted multiplayer game with a classy dark/gold UI. created using Node.js, Express, and Socket.io.

## Prerequisites

- Node.js installed on your machine.

## Setup & Running

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /Users/abhilasha/.gemini/antigravity/scratch/multiplayer-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open your browser and navigate to:
   `http://localhost:3000`

## Features

- **Create Room**: Host a game room with a custom player limit (default 4).
- **Join Room**: Join an existing room using a 6-digit code.
- **Real-time Lobby**: See players join and leave in real-time.
- **Classy UI**: Dark mode with gold accents and glassmorphism effects.

## Troubleshooting

- If `npm install` fails, ensure Node.js is installed (`node -v`).
- If port 3000 is in use, modify the port in `server.js` or clean up the process using that port.
