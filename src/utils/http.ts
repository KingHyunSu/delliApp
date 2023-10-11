import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'

const instance = Axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-type:': 'application/json;charset=UTF-8'
  }
})
instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const statusCode = error.response.status
    console.error('e', statusCode)
    switch (statusCode) {
      case 401:
        console.log('401 Error!!', error)
        return Promise.reject(error)
      case 403:
        console.log('403 Error!!')
        await AsyncStorage.setItem('token', '')
        return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default instance
