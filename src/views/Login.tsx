import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

// utils
import {LOGIN_TYPE} from '@/utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useSetRecoilState} from 'recoil'
import {loginState} from '@/store/system'

// provider
import {login as kakaoLogin} from '@react-native-seoul/kakao-login'

import AppleLogoIcon from '@/assets/icons/appleLogo.svg'
import KakaoLogoIcon from '@/assets/icons/kakaoLogo.svg'

// apis
import {login} from '@/apis/auth'

const Login = () => {
  const setIsLogin = useSetRecoilState(loginState)

  const signInWithKakao = async (): Promise<void> => {
    try {
      const {accessToken} = await kakaoLogin()

      const params = {
        token: accessToken,
        type: LOGIN_TYPE.KAKAO
      }

      const result = await login(params)
      if (result.data.token) {
        await AsyncStorage.setItem('token', result.data.token)
        setIsLogin(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.loginContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.subText}>데일리</Text>
        <Text style={styles.subText}>일정 관리</Text>
        <Text style={styles.mainText}>델리</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.kakaoLoginButton} onPress={signInWithKakao}>
          <View style={styles.kakaoLogoWrapper}>
            <KakaoLogoIcon />
          </View>
          <Text style={styles.kakaoLoginButtonText}>카카오로 시작하기</Text>
        </Pressable>

        <Pressable style={styles.appleLoginButton}>
          <AppleLogoIcon />
          <Text style={styles.appleLoginButtonText}>Apple로 시작하기</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  textContainer: {
    flex: 1,
    gap: 20,
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    gap: 20,
    justifyContent: 'flex-end'
  },
  subText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 26
  },
  mainText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 30,
    color: '#1E90FF'
  },
  kakaoLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 6,
    paddingRight: 44,
    height: 56
  },
  kakaoLogoWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  kakaoLoginButtonText: {
    flex: 1,
    textAlign: 'center',
    // fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#000000d9',
    fontSize: 16
  },
  appleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 6,
    paddingRight: 44
  },
  appleLoginButtonText: {
    flex: 1,
    textAlign: 'center',
    // fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16
  }
})

export default Login
