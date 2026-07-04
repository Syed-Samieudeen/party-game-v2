import axios from 'axios'

const API_URL = 'https://party-game-v2.onrender.com'

export const api = axios.create({
  baseURL: API_URL,
})
