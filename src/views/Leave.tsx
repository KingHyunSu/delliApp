import {useState, useCallback, useMemo} from 'react'
import {StyleSheet, ActivityIndicator, Pressable, View, Text} from 'react-native'
import AppBar from '@/components/AppBar'
import Loading from '@/components/Loading'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {loginState, activeThemeState, displayModeState} from '@/store/system'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {LOGIN_TYPE} from '@/utils/types'

import * as authApi from '@/apis/server/auth'
import * as kakaoAuth from '@react-native-seoul/kakao-login'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {loginInfoState} from '@/store/user'

const Leave = () => {
  const [isLoading, setIsLoading] = useState(false)

  const loginInfo = useRecoilValue(loginInfoState)
  const displayMode = useRecoilValue(displayModeState)
  const activeTheme = useRecoilValue(activeThemeState)
  const setIsLogin = useSetRecoilState(loginState)

  const titleStyle = useMemo(() => {
    const color = displayMode === 1 ? '#000000' : '#ffffff'
    return [styles.title, {color}]
  }, [displayMode])

  const handleLeave = useCallback(async () => {
    if (!loginInfo) {
      return
    }

    try {
      setIsLoading(true)

      const loginType = loginInfo.login_type
      let code = null

      if (loginType === LOGIN_TYPE.KAKAO) {
        await kakaoAuth.unlink()
      } else if (loginType === LOGIN_TYPE.APPLE) {
        const response = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL]
        })

        const credentialState = await appleAuth.getCredentialStateForUser(response.user)

        const appleAuthorizationCode = response.authorizationCode

        if (credentialState === appleAuth.State.AUTHORIZED) {
          code = appleAuthorizationCode
        }
      } else if (loginType === LOGIN_TYPE.GOOGLE) {
        await GoogleSignin.revokeAccess()
      }

      const response = await authApi.leave({loginType, code})
      const isSuccess = response.data.result

      if (isSuccess) {
        await AsyncStorage.removeItem('loginType')
        await AsyncStorage.removeItem('token')
        setIsLogin(false)
      }
    } catch (e) {
      console.error('leave error', e)
    } finally {
      setIsLoading(false)
    }
  }, [loginInfo, setIsLoading, setIsLogin])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <AppBar backPress color="transparent" backPressIconColor={activeTheme.color3} />

      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator animating={isLoading} size="large" />
        </View>
      )}

      <View style={styles.wrapper}>
        <Text style={titleStyle}>탈퇴하기</Text>
        <Text style={styles.contentsText}>탈퇴하시면 작성하신 일정, 할 일 등</Text>
        <Text style={styles.contentsText}>모든 데이터는 복구 불가능합니다</Text>

        <Pressable style={styles.button} onPress={handleLeave}>
          <Text style={styles.buttonText}>탈퇴하기</Text>
        </Pressable>
      </View>
      <Loading />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  wrapper: {
    paddingTop: 20,
    paddingHorizontal: 16
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#000',
    marginBottom: 20
  },
  contentsText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#777777',
    marginBottom: 5
  },
  button: {
    marginTop: 50,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#404247'
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#e7e7e7'
  }
})

export default Leave
