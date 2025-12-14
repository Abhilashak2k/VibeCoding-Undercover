const socket = io();

// UI Elements
const landingScreen = document.getElementById('landing-screen');
const createScreen = document.getElementById('create-room-screen');
const joinScreen = document.getElementById('join-room-screen');
const lobbyScreen = document.getElementById('lobby-screen');

const btnShowCreate = document.getElementById('btn-show-create');
const btnShowJoin = document.getElementById('btn-show-join');
const btnCreateSubmit = document.getElementById('btn-create-submit');
const btnJoinSubmit = document.getElementById('btn-join-submit');
const btnsBack = document.querySelectorAll('.btn-back');

const inputCreateUser = document.getElementById('create-username');
const inputMaxPlayers = document.getElementById('max-players');
const inputJoinUser = document.getElementById('join-username');
const inputJoinCode = document.getElementById('join-room-code');

const roomCodeDisplay = document.getElementById('room-code-display');
const playersList = document.getElementById('players-list');
const playerCountSpan = document.getElementById('player-count');
const maxCountSpan = document.getElementById('max-count');
const notificationArea = document.getElementById('notification-area');

// Navigation
function showScreen(screen) {
    [landingScreen, createScreen, joinScreen, lobbyScreen].forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    screen.classList.remove('hidden');
    screen.classList.add('active');
}

btnShowCreate.addEventListener('click', () => showScreen(createScreen));
btnShowJoin.addEventListener('click', () => showScreen(joinScreen));
btnsBack.forEach(btn => btn.addEventListener('click', () => showScreen(landingScreen)));

// Notifications
function showNotification(msg) {
    notificationArea.textContent = msg;
    notificationArea.classList.remove('hidden');
    setTimeout(() => {
        notificationArea.classList.add('hidden');
    }, 3000);
}

// Socket Events

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('room_created', (data) => {
    enterLobby(data);
});

socket.on('room_updated', (data) => {
    updateLobby(data);
});

socket.on('error_message', (msg) => {
    showNotification(msg);
});

// Actions

btnCreateSubmit.addEventListener('click', () => {
    const username = inputCreateUser.value.trim();
    const maxPlayers = inputMaxPlayers.value;

    if (!username) {
        showNotification('Please enter a username.');
        return;
    }

    socket.emit('create_room', { username, maxPlayers });
});

btnJoinSubmit.addEventListener('click', () => {
    const username = inputJoinUser.value.trim();
    const roomCode = inputJoinCode.value.trim();

    if (!username || !roomCode) {
        showNotification('Please enter username and room code.');
        return;
    }

    if (roomCode.length !== 6) {
        showNotification('Room code must be 6 digits.');
        return;
    }

    socket.emit('join_room', { username, roomCode });
});

// Lobby Logic

function enterLobby(data) {
    showScreen(lobbyScreen);
    updateLobby(data);
}

function updateLobby(data) {
    roomCodeDisplay.textContent = data.roomCode;
    maxCountSpan.textContent = data.maxPlayers;
    playerCountSpan.textContent = data.players.length;

    playersList.innerHTML = '';
    data.players.forEach(player => {
        const li = document.createElement('li');
        li.className = 'player-item';
        li.innerHTML = `
            <span class="player-name">${player.username}</span>
            <span class="player-status">Ready</span>
        `;
        playersList.appendChild(li);
    });
}
