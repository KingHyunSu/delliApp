import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'

import {useSetRecoilState} from 'recoil'
import {loginState} from '@/store/system'

const instance = Axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: 'https://api.delli.info',
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
    return response
  },
  async error => {
    const statusCode = error.response.status

    switch (statusCode) {
      case 401: {
        return Promise.reject(error)
      }
      case 403: {
        await AsyncStorage.setItem('token', '')

        const setIsLogin = useSetRecoilState(loginState)
        setIsLogin(false)

        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
