import axios from 'axios'
import { useContext } from "react"
import { AuthContext } from '../contexts/context'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
})

api.interceptors.request.use(async config => {
    const { user } = useContext(AuthContext)
    if (user) {
      const token = `Bearer ${user.token}`
      config.headers.Authorization = token
    }
    return config
  }
)

export const post = async (url, Data) => {
  const request = await api.post(url, Data)
  return request.data
}

export const get = async (url) => {
  const response = await api.get(url)
  return response.data
}

export const getCep = async (cep) => {
  const response = await apiCep.get(`${cep}/json/`)
  return response
}

export function setUserLocalStorage(item, user) {
  localStorage.setItem(item, JSON.stringify(user))
}

export function getUserLocalStorage(item) {
  const json = localStorage.getItem(item)

  if (!json) {
    return null
  }

  const user = JSON.parse(json)

  return user ?? null
}