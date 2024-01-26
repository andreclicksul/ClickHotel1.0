import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 
    'Content-Type': 'application/json; charset=utf-8',
  }
})

const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
})

/*
api.interceptors.request.use(async config => {
    const user = getUserLocalStorage('u')
    if (user) {
      const token = `Bearer ${user.token}`
      config.headers.Authorization = token
    }
    return config
  }
)
*/

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