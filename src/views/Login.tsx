import React from 'react'
import {Platform, StyleSheet, SafeAreaView, View, Text, Pressable} from 'react-native'
import Loading from '@/components/Loading'

import {GOOGLE_WEB_CLIENT_ID} from '@env'

// utils
import AsyncStorage from '@react-native-async-storage/async-storage'

import {LOGIN_TYPE} from '@/utils/types'
import {useSetRecoilState} from 'recoil'
import {loginState, isLoadingState} from '@/store/system'
import {joinInfoState} from '@/store/auth'

// provider
import {login as kakaoLogin} from '@react-native-seoul/kakao-login'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

import KakaoLogoIcon from '@/assets/icons/kakaoLogo.svg'
import AppleLogoIcon from '@/assets/icons/appleLogo.svg'
import GoogleLogoIcon from '@/assets/icons/googleLogo.svg'

// apis
import {login} from '@/apis/auth'
import {LoginNavigationProps} from '@/types/navigation'

const Login = ({navigation}: LoginNavigationProps) => {
  const setIsLoading = useSetRecoilState(isLoadingState)
  const setIsLogin = useSetRecoilState(loginState)
  const setJoinInfo = useSetRecoilState(joinInfoState)

  const doLogin = React.useCallback(
    async (params: LoginRequest) => {
      try {
        setIsLoading(true)

        const result = await login(params)

        if (result.code === '4001') {
          setJoinInfo({...params, terms_agree_list: []})
          navigation.navigate('JoinTerms', {token: result.data.token})
        } else {
          if (result.data.token) {
            await AsyncStorage.setItem('token', result.data.token)
            setIsLogin(true)
          }
        }
      } catch (e) {
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLogin, setIsLoading, setJoinInfo, navigation]
  )

  const signInWithKakao = React.useCallback(async (): Promise<void> => {
    try {
      const {accessToken} = await kakaoLogin()

      const params: LoginRequest = {
        token: accessToken,
        type: LOGIN_TYPE.KAKAO
      }

      await doLogin(params)
    } catch (e) {
      // console.error(e)
    }
  }, [doLogin])

  const singInWithApple = React.useCallback(async () => {
    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL]
      })

      const credentialState = await appleAuth.getCredentialStateForUser(response.user)

      if (credentialState === appleAuth.State.AUTHORIZED && response.identityToken) {
        const params: LoginRequest = {
          token: response.identityToken,
          type: LOGIN_TYPE.APPLE
        }

        await doLogin(params)
      }
    } catch (e: any) {
      if (e.code !== appleAuth.Error.CANCELED) {
        // console.error(e)
      }
    }
  }, [doLogin])

  const signInWithGoogle = React.useCallback(async () => {
    try {
      const response = await GoogleSignin.signIn()

      if (response.idToken) {
        const params: LoginRequest = {
          token: response.idToken,
          type: LOGIN_TYPE.GOOGLE
        }

        await doLogin(params)
      }
    } catch (e) {}
  }, [doLogin])

  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.email'],
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
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

          {Platform.OS === 'ios' && (
            <Pressable style={styles.appleLoginButton} onPress={singInWithApple}>
              <AppleLogoIcon />
              <Text style={styles.appleLoginButtonText}>Apple로 시작하기</Text>
            </Pressable>
          )}

          <Pressable style={styles.googleLoginButton} onPress={signInWithGoogle}>
            <View style={styles.googleIconWrapper}>
              <GoogleLogoIcon />
            </View>
            <Text style={styles.goolgeLoginButtonText}>Google로 시작하기</Text>
          </Pressable>
        </View>

        <Loading />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  textContainer: {
    marginTop: 120,
    gap: 20,
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'flex-end'
  },
  subText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 26,
    color: '#000'
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
    paddingRight: 56,
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
    fontFamily: 'Roboto',
    color: '#000000d9',
    fontSize: 16
  },
  appleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 6,
    paddingRight: 56
  },
  appleLoginButtonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 16
  },
  googleLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingRight: 56,
    borderColor: '#F2F2F2',
    borderWidth: 1
  },
  googleIconWrapper: {
    width: 55,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goolgeLoginButtonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: '#1F1F1F',
    fontSize: 16
  }
})

export default Login
