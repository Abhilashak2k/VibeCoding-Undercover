const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

// Helper to generate 6-digit room code
function generateRoomCode() {
    let code = '';
    do {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (rooms[code]); // Ensure uniqueness
    return code;
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Create Room
    socket.on('create_room', ({ username, maxPlayers }) => {
        const roomCode = generateRoomCode();
        rooms[roomCode] = {
            players: [{ id: socket.id, username }],
            maxPlayers: parseInt(maxPlayers) || 4
        };

        socket.join(roomCode);

        // Acknowledge creation and send room details
        socket.emit('room_created', {
            roomCode,
            players: rooms[roomCode].players,
            maxPlayers: rooms[roomCode].maxPlayers
        });

        console.log(`Room ${roomCode} created by ${username}`);
    });

    // Join Room
    socket.on('join_room', ({ username, roomCode }) => {
        const room = rooms[roomCode];

        if (!room) {
            socket.emit('error_message', 'Room not found.');
            return;
        }

        if (room.players.length >= room.maxPlayers) {
            socket.emit('error_message', 'Room is full.');
            return;
        }

        // Add player
        room.players.push({ id: socket.id, username });
        socket.join(roomCode);

        // Notify everyone in the room (including sender)
        io.to(roomCode).emit('room_updated', {
            roomCode,
            players: room.players,
            maxPlayers: room.maxPlayers
        });

        console.log(`${username} joined room ${roomCode}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which room the user was in and remove them
        for (const code in rooms) {
            const room = rooms[code];
            const playerIndex = room.players.findIndex(p => p.id === socket.id);

            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);

                // If room is empty, delete it
                if (room.players.length === 0) {
                    delete rooms[code];
                } else {
                    // Notify remaining players
                    io.to(code).emit('room_updated', {
                        roomCode: code,
                        players: room.players,
                        maxPlayers: room.maxPlayers
                    });
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
