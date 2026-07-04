import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://party-game-v2.onrender.com',
})
