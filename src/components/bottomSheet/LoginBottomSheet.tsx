import {useRef, useCallback, useEffect, useMemo, useState} from 'react'
import {StyleSheet, Platform, ActivityIndicator, Pressable, Text, View} from 'react-native'
import {BottomSheetModal, BottomSheetBackdropProps, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import KakaoLogoIcon from '@/assets/icons/kakaoLogo.svg'
import AppleLogoIcon from '@/assets/icons/appleLogo.svg'
import GoogleLogoIcon from '@/assets/icons/googleLogo.svg'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, displayModeState} from '@/store/system'
import {showLoginBottomSheetState} from '@/store/bottomSheet'

import {login as kakaoLogin} from '@react-native-seoul/kakao-login'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {getSyncData, updateSyncData} from '@/apis/local/modules/sync'
import {loginLinkSNS, loginSyncData} from '@/apis/server/auth'
import {useAccess} from '@/apis/hooks/useAuth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {navigate} from '@/utils/navigation'
import {LOGIN_TYPE} from '@/utils/types'
import {useQueryClient} from '@tanstack/react-query'
import {scheduleDateState} from '@/store/schedule'
import {useAlert} from '@/components/Alert'
import {LoginSyncDataRequest} from '@/apis/types/auth'
import {format} from 'date-fns'

const LoginBottomSheet = () => {
  const alert = useAlert()
  const queryClient = useQueryClient()
  const {mutateAsync: accessMutateAsync} = useAccess()

  const loginBottomSheetRef = useRef<BottomSheetModal>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [showLoginBottomSheet, setShowLoginBottomSheet] = useRecoilState(showLoginBottomSheetState)
  const displayMode = useRecoilValue(displayModeState)
  const activeTheme = useRecoilValue(activeThemeState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const titleStyle = useMemo(() => {
    const color = displayMode === 1 ? '#bfbfbf' : '#777777'

    return [styles.title, {backgroundColor: activeTheme.color5, color}]
  }, [activeTheme.color5, displayMode])

  const titleLabelStyle = useMemo(() => {
    const backgroundColor = displayMode === 1 ? '#efefef' : '#666666'

    return [styles.titleLine, {backgroundColor}]
  }, [displayMode])

  const snapPoints = useMemo(() => {
    return [350]
  }, [])

  const closeBottomSheet = useCallback(() => {
    setShowLoginBottomSheet(false)
  }, [setShowLoginBottomSheet])

  const handleSuccess = useCallback(
    async (token: string) => {
      closeBottomSheet()

      await AsyncStorage.setItem('token', token)
      await accessMutateAsync()

      const formatDate = format(scheduleDate, 'yyyy-MM-dd')
      await queryClient.invalidateQueries({queryKey: ['scheduleList', formatDate]})

      navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: false}
      })
    },
    [closeBottomSheet, scheduleDate, queryClient, accessMutateAsync]
  )

  const handleLoginSyncData = useCallback(
    async (params: LoginSyncDataRequest) => {
      const response = await loginSyncData(params)
      await handleSuccess(response.data.token)
    },
    [handleSuccess]
  )

  const handleLogin = useCallback(
    async (type: 1 | 2 | 3, token: string) => {
      setIsLoading(true)

      const syncData = await getSyncData()

      const params = {
        login_type: type,
        token,
        schedule_list: syncData?.scheduleList || [],
        schedule_todo_list: syncData?.scheduleTodoList || [],
        schedule_routine_list: syncData?.scheduleRoutineList || [],
        schedule_routine_complete_list: syncData?.scheduleRoutineCompleteList || []
      }

      const response = await loginLinkSNS(params)

      if (response.code === '4002') {
        // 사용자 존재
        alert.show({
          title: '델리 서비스를 이용한 기록이 있어요',
          message: '일정을 어떻게 처리할지 선택해 주세요.\n일정을 제외한 모든 데이터는 저장된 데이터로 변경됩니다.',
          direction: 'column',
          buttons: [
            {
              text: '현재 일정으로 사용하기',
              textColor: '#1E90FF',
              onPress: async () => {
                await handleLoginSyncData({
                  login_type: type,
                  token,
                  sync_type: 1
                })
                setIsLoading(false)
              }
            },
            {
              text: '저장된 일정으로 사용하기',
              textColor: '#1E90FF',
              onPress: async () => {
                await handleLoginSyncData({
                  login_type: type,
                  token,
                  sync_type: 2
                })
                setIsLoading(false)
              }
            },
            {
              text: '모든 일정 합치기',
              textColor: '#1E90FF',
              onPress: async () => {
                await handleLoginSyncData({
                  login_type: type,
                  token,
                  sync_type: 3
                })
                setIsLoading(false)
              }
            },
            {
              text: '닫기',
              onPress: () => {
                setIsLoading(false)
              }
            }
          ]
        })
      } else if (response.code === '2000') {
        let isUpdateSyncSuccess = true

        if (syncData) {
          isUpdateSyncSuccess = await updateSyncData()
        }

        if (isUpdateSyncSuccess) {
          await handleSuccess(response.data.token)
        }

        setIsLoading(false)
      }
    },
    [alert, handleLoginSyncData, handleSuccess]
  )

  const handleError = useCallback(() => {
    alert.show({
      title: '로그인 실패',
      message: '잠시 후 다시 시도해 주세요',
      buttons: [
        {
          text: '확인',
          onPress: () => {}
        }
      ]
    })
  }, [alert])

  const signInWithKakao = useCallback(async (): Promise<void> => {
    try {
      const {accessToken} = await kakaoLogin()

      await handleLogin(LOGIN_TYPE.KAKAO, accessToken)
    } catch (e) {
      handleError()
    }
  }, [handleLogin, handleError])

  const singInWithApple = useCallback(async () => {
    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL]
      })

      const credentialState = await appleAuth.getCredentialStateForUser(response.user)

      if (credentialState === appleAuth.State.AUTHORIZED && response.identityToken) {
        await handleLogin(LOGIN_TYPE.APPLE, response.identityToken)
      }
    } catch (e: any) {
      if (e.code !== appleAuth.Error.CANCELED) {
        handleError()
      }
    }
  }, [handleLogin, handleError])

  const signInWithGoogle = useCallback(async () => {
    // [TODO] hasPlayServices 추가하기 (2024-03-14)
    try {
      const response = await GoogleSignin.signIn()

      if (response.idToken) {
        await handleLogin(LOGIN_TYPE.GOOGLE, response.idToken)
      }
    } catch (e) {
      handleError()
    }
  }, [handleLogin, handleError])

  useEffect(() => {
    if (showLoginBottomSheet) {
      loginBottomSheetRef.current?.present()
    } else {
      loginBottomSheetRef.current?.dismiss()
    }
  }, [showLoginBottomSheet])

  const getBottomSheetBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      const pressBehavior = isLoading ? 'none' : 'close'

      return <BottomSheetBackdrop props={props} pressBehavior={pressBehavior} />
    },
    [isLoading]
  )

  const getBottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheetModal
      name="login"
      ref={loginBottomSheetRef}
      backdropComponent={getBottomSheetBackdrop}
      handleComponent={getBottomSheetHandler}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableContentPanningGesture={!isLoading}
      enableHandlePanningGesture={!isLoading}
      onDismiss={closeBottomSheet}>
      <View style={styles.container}>
        {isLoading && <ActivityIndicator animating={isLoading} style={styles.loading} size="large" />}

        <View style={styles.titleWrapper}>
          <View style={titleLabelStyle} />
          <Text style={titleStyle}>로그인 / 회원가입</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Pressable style={kakaoLoginButton} onPress={signInWithKakao}>
            <View style={styles.kakaoLogoWrapper}>
              <KakaoLogoIcon />
            </View>

            <Text style={kakaoLoginButtonText}>카카오 로그인</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable style={appleLoginButton} onPress={singInWithApple}>
              <AppleLogoIcon />

              <Text style={appleLoginButtonText}>Apple 로그인</Text>
            </Pressable>
          )}

          <Pressable style={googleLoginButton} onPress={signInWithGoogle}>
            <View style={styles.googleLogoWrapper}>
              <GoogleLogoIcon width={22} height={22} />
            </View>

            <Text style={googleLoginButtonText}>Google 로그인</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  },
  titleWrapper: {
    marginTop: 15,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    paddingHorizontal: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14
  },
  titleLine: {
    position: 'absolute',
    width: '100%',
    height: 1
  },

  buttonWrapper: {
    gap: 10
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingRight: 56,
    height: 56
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  },

  kakaoLogoWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  googleLogoWrapper: {
    width: 55,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const kakaoLoginButton = StyleSheet.compose(styles.button, {backgroundColor: '#FEE500'})
const kakaoLoginButtonText = StyleSheet.compose(styles.buttonText, {color: '#000000d9'})
const appleLoginButton = StyleSheet.compose(styles.button, {backgroundColor: '#000000'})
const appleLoginButtonText = StyleSheet.compose(styles.buttonText, {color: '#ffffff'})
const googleLoginButton = StyleSheet.compose(styles.button, {
  backgroundColor: '#ffffff',
  borderColor: '#F2F2F2',
  borderWidth: 1
})
const googleLoginButtonText = StyleSheet.compose(styles.buttonText, {color: '#1F1F1F'})

export default LoginBottomSheet
