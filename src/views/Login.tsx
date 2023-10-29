import React from 'react'
import {StyleSheet, View, Text, Pressable, Image} from 'react-native'

// utils
import {LOGIN_TYPE} from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

// provider
import {login as kakaoLogin} from '@react-native-seoul/kakao-login'

// apis
import {login} from '@/apis/auth'

const Login = () => {
  const signInWithKakao = async (): Promise<void> => {
    try {
      const {accessToken} = await kakaoLogin()

      const params = {
        token: accessToken,
        type: LOGIN_TYPE.KAKAO
      }

      const result = await login(params)

      await AsyncStorage.setItem('token', result.data.token)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={loginStyles.loginContainer}>
      <Pressable onPress={signInWithKakao}>
        <Image
          resizeMode="contain"
          style={{width: 'auto'}}
          source={require('@/assets/images/kakao_login_large_wide.png')}
        />
        {/* <Text>카카오 로그인</Text> */}
      </Pressable>
    </View>
  )
}

const loginStyles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20
  }
})

export default Login
