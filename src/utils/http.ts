import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'

import {API_URL} from '@env'
import * as navigation from '@/utils/navigation'

import {getToken, getNewToken} from '@/apis/auth'
import {userRepository} from '@/repository'

const instance = Axios.create({
  baseURL: 'http://localhost:80', // ios local
  // baseURL: 'http://localhost:8080', // ios local
  // baseURL: 'http://10.0.2.2:8080', // android local
  // baseURL: API_URL,
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
    console.log('config url', config.url)
    console.log('config params', config.params)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async response => {
    console.log('response', response.data)
    const code = response.data.code

    switch (code) {
      case '4001': {
        // TODO sns login 추가 전 임시
        const [user] = await userRepository.getUser()
        const result = await getToken({id: user.user_id})
        const token = result.data.token

        await AsyncStorage.setItem('token', token)

        return instance(response.config)
      }
      case '4003': {
        const token = await AsyncStorage.getItem('token')

        if (token) {
          const result = await getNewToken({token})
          const newToken = result.data.token

          await AsyncStorage.setItem('token', newToken)

          return instance(response.config)
        }

        break
      }
    }
    return response.data
  },
  async error => {
    const statusCode = error.response?.status || 500

    return Promise.reject(statusCode)
  }
)

export default instance
