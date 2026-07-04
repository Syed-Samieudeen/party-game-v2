import { io } from 'socket.io-client'

const SOCKET_URL = 'https://party-game-v2.onrender.com'

export const socket = io(SOCKET_URL)
