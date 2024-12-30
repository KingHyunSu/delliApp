import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'
import {getNewToken} from '@/apis/server/auth'
import {LOGIN_TYPE} from '@/utils/types'
import * as KakaoAuth from '@react-native-seoul/kakao-login'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {useLoginStateSetter} from '@/store/system'

const instance = Axios.create({
  baseURL: 'http://192.168.35.27:80', // ios local
  // baseURL: 'http://10.0.2.2:8080', // android local
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

    console.group()
    console.log('token', token)
    console.log('config url', config.url)
    console.log('config params', config.params)
    console.log('config data', config.data)
    console.groupEnd()

    return config
  },
  error => {
    console.error('request error: ', error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async response => {
    console.log('response', response.data)

    if (response.data && typeof response.data.result === 'boolean' && response.data.result === false) {
      return Promise.reject('5000')
    }

    if (response.data.code === '4001') {
      // 토큰 만료
      const loginType = await AsyncStorage.getItem('loginType')

      if (Number(loginType) === LOGIN_TYPE.KAKAO) {
        await KakaoAuth.logout()
      } else if (Number(loginType) === LOGIN_TYPE.GOOGLE) {
        await GoogleSignin.signOut()
      }

      await AsyncStorage.removeItem('token')

      const setLoginState = useLoginStateSetter()
      if (setLoginState) {
        setLoginState(false)
      }

      return Promise.reject('4001')
    } else if (response.data.code === '4003') {
      // 토큰 재발급
      const token = await AsyncStorage.getItem('token')

      if (token) {
        const result = await getNewToken({token})
        const newToken = result.data.token

        await AsyncStorage.setItem('token', newToken)

        return instance(response.config)
      }

      return Promise.reject()
    }

    return response.data
  },
  async error => {
    console.error('api response error', error)
    const statusCode = error.response?.status || 500

    return Promise.reject(statusCode)
  }
)

export default instance
