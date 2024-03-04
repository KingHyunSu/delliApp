import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'

import * as navigation from '@/utils/navigation'

import {getNewToken} from '@/apis/auth'

const instance = Axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'https://api.delli.info',
  headers: {
    // 'Content-Type:': 'application/json;charset=UTF-8'
    // 'content-type:': 'application/json;charset=UTF-8'
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
    return response.data
  },
  async error => {
    console.error('http error', error)
    const statusCode = error.response.status

    switch (statusCode) {
      case 401: {
        const token = await AsyncStorage.getItem('token')

        if (token) {
          const result = await getNewToken({token})
          const newToken = result.data.token
          await AsyncStorage.setItem('token', newToken)
        }

        return instance(error.config)
      }
      case 403: {
        await AsyncStorage.setItem('token', '')

        navigation.navigate('Logout')
        break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
