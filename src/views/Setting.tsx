import {useMemo, useCallback, useEffect} from 'react'
import {Platform, Linking, StyleSheet, ScrollView, Pressable, View, Text, Alert, Image} from 'react-native'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'
import KakaoLogoIcon from '@/assets/icons/kakaoLogo.svg'
import GoogleLogoIcon from '@/assets/icons/googleLogo.svg'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import * as KakaoAuth from '@react-native-seoul/kakao-login'

import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {
  activeThemeState,
  bottomSafeAreaColorState,
  displayModeState,
  loginState,
  statusBarColorState,
  statusBarTextStyleState,
  windowDimensionsState
} from '@/store/system'
import {showLoginBottomSheetState} from '@/store/bottomSheet'
import {loginInfoState} from '@/store/user'

import {format} from 'date-fns'
import {setTestData, deleteAllScheduleData} from '@/utils/test'
import {useUpdateDisplayMode} from '@/apis/hooks/useUser'
import {SettingScreenProps} from '@/types/navigation'
import {LOGIN_TYPE} from '@/utils/types'

const Setting = ({navigation}: SettingScreenProps) => {
  const {mutateAsync: updateDisplayMutateAsync} = useUpdateDisplayMode()

  const [displayMode, setDisplayMode] = useRecoilState(displayModeState)

  const loginInfo = useRecoilValue(loginInfoState)
  const activeTheme = useRecoilValue(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const scheduleList = useRecoilValue(scheduleListState)

  const setShowLoginBottomSheet = useSetRecoilState(showLoginBottomSheetState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)
  const setIsLogin = useSetRecoilState(loginState)

  const displayStyle = useMemo(() => {
    const aspectRatio = 1.7
    const width = windowDimensions.width / 4
    const height = width * aspectRatio
    const borderColor = activeTheme.color2

    return [displayModeStyle.display, {width, height, borderColor}]
  }, [windowDimensions.width, activeTheme.color2])

  const getPickWrapperStyle = useCallback(
    (mode: DisplayMode) => {
      return displayMode === mode ? activePickWrapper : displayModeStyle.pickWrapper
    },
    [displayMode]
  )

  const isGuest = useMemo(() => {
    return loginInfo && loginInfo.login_type === LOGIN_TYPE.GUEST
  }, [loginInfo])

  const version = useMemo(() => {
    if (Platform.OS === 'ios') {
      return '2.0.0'
    } else if (Platform.OS === 'android') {
      return '1.0.0'
    }
    return ''
  }, [])

  const changeDisplayMode = useCallback(
    (mode: DisplayMode) => async () => {
      const response = await updateDisplayMutateAsync({display_mode: mode})

      if (response.result) {
        setDisplayMode(mode)
      }
    },
    [updateDisplayMutateAsync, setDisplayMode]
  )

  const moveServiceTermsPage = useCallback(async () => {
    const url = 'https://coherent-warbler-b91.notion.site/56c16f3a2e3a40d8a81e950ccaf00269?pvs=4'
    await Linking.openURL(url)
  }, [])

  const movePrivacyPage = useCallback(async () => {
    const url = 'https://coherent-warbler-b91.notion.site/a49ff95ec433493b86124571c6677261?pvs=4'
    await Linking.openURL(url)
  }, [])

  const doLogout = useCallback(async () => {
    if (!loginInfo || loginInfo.login_type === LOGIN_TYPE.GUEST) {
      return
    }

    try {
      if (loginInfo.login_type === LOGIN_TYPE.KAKAO) {
        await KakaoAuth.logout()
      } else if (loginInfo?.login_type === LOGIN_TYPE.GOOGLE) {
        await GoogleSignin.signOut()
      }

      await AsyncStorage.removeItem('token')
      setIsLogin(false)
    } catch (e) {
      console.error(e)
    }
  }, [loginInfo, setIsLogin])

  const moveLeave = useCallback(() => {
    navigation.navigate('Leave')
  }, [navigation])

  const setTest = useCallback(async () => {
    try {
      const date = format(scheduleDate, 'yyyy-MM-dd')

      await setTestData(date, scheduleList)
      Alert.alert('추가 완료', '', [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('MainTabs', {
              screen: 'Home',
              params: {scheduleUpdated: false}
            })
          }
        }
      ])
    } catch (e) {
      console.log('eee', e)
      Alert.alert('추가 실패', String(e))
    }
  }, [navigation, scheduleDate, scheduleList])

  const deleteAllSchedule = useCallback(async () => {
    try {
      await deleteAllScheduleData()
      Alert.alert('삭제 완료')
    } catch (e) {
      Alert.alert('삭제 실패', String(e))
    }
  }, [])

  const deleteToken = useCallback(async () => {
    try {
      await AsyncStorage.setItem('token', '')
      Alert.alert('토큰 삭제 완료')
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    setStatusBarTextStyle(displayMode === 1 ? 'dark-content' : 'light-content')
    setStatusBarColor(activeTheme.color1)
    setBottomSafeAreaColor(activeTheme.color5)
  }, [
    displayMode,
    activeTheme.color1,
    activeTheme.color5,
    setStatusBarTextStyle,
    setStatusBarColor,
    setBottomSafeAreaColor
  ])

  const loginIcon = useMemo(() => {
    if (loginInfo) {
      switch (loginInfo.login_type) {
        case LOGIN_TYPE.KAKAO:
          return (
            <View style={kakaoLoginIcon}>
              <KakaoLogoIcon width={11} height={11} />
            </View>
          )
        case LOGIN_TYPE.APPLE:
          return (
            <View style={profileStyles.iconWrapper}>
              <Image source={require('@/assets/icons/appleLogo.png')} style={{width: 22, height: 22}} />
            </View>
          )
        case LOGIN_TYPE.GOOGLE:
          return (
            <View style={googleLoginIcon}>
              <GoogleLogoIcon width={11} height={11} />
            </View>
          )
        default:
          return <></>
      }
    }
  }, [loginInfo])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={profileStyles.container}>
          {loginInfo && loginInfo.login_type !== 0 ? (
            <View style={profileStyles.wrapper}>
              {loginIcon}
              <Text numberOfLines={1} style={[profileStyles.title, {color: activeTheme.color3}]}>
                {loginInfo.email}
              </Text>
            </View>
          ) : (
            <View style={profileStyles.loginWrapper}>
              <View style={profileStyles.loginTitleWrapper}>
                <Text style={[profileStyles.loginTitle, {color: activeTheme.color3}]}>간편 로그인으로</Text>
                <Text style={[profileStyles.loginTitle, {color: activeTheme.color3}]}>델리를 편리하게 사용하세요</Text>
              </View>
              <Pressable style={profileStyles.loginButton} onPress={() => setShowLoginBottomSheet(true)}>
                <Text style={profileStyles.loginButtonText}>로그인/회원가입</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={[styles.blank, {backgroundColor: activeTheme.color2}]} />

        <View style={[displayModeStyle.container, {backgroundColor: activeTheme.color1}]}>
          <View style={displayModeStyle.wrapper}>
            <Text style={[displayModeStyle.label, {color: activeTheme.color3}]}>라이트</Text>

            <Pressable style={displayModeStyle.button} onPress={changeDisplayMode(1)}>
              <View style={[displayStyle, {backgroundColor: '#ffffff'}]}>
                <View style={[displayModeStyle.displayItem, {backgroundColor: '#f9f9f9'}]} />
                <View style={[displayModeStyle.displayItem, {backgroundColor: '#f9f9f9'}]} />
              </View>

              <View style={getPickWrapperStyle(1)}>
                <View style={displayModeStyle.pick} />
              </View>
            </Pressable>
          </View>

          <View style={displayModeStyle.wrapper}>
            <Text style={[displayModeStyle.label, {color: activeTheme.color3}]}>다크</Text>

            <Pressable style={displayModeStyle.button} onPress={changeDisplayMode(2)}>
              <View style={[displayStyle, {backgroundColor: '#202023'}]}>
                <View style={[displayModeStyle.displayItem, {backgroundColor: '#35353B'}]} />
                <View style={[displayModeStyle.displayItem, {backgroundColor: '#35353B'}]} />
              </View>

              <View style={getPickWrapperStyle(2)}>
                <View style={displayModeStyle.pick} />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={[styles.blank, {backgroundColor: activeTheme.color2}]} />

        <Pressable
          style={[styles.item, {borderBottomWidth: 1, borderBottomColor: activeTheme.color2}]}
          onPress={moveServiceTermsPage}>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>서비스 이용 약관</Text>
          <ArrowRightIcon width={18} height={18} stroke={activeTheme.color3} strokeWidth={3} />
        </Pressable>

        <Pressable style={styles.item} onPress={movePrivacyPage}>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>개인정보 처리방침</Text>
          <ArrowRightIcon width={18} height={18} stroke={activeTheme.color3} strokeWidth={3} />
        </Pressable>

        <View style={[styles.blank, {backgroundColor: activeTheme.color2}]} />

        {__DEV__ && (
          <>
            <Pressable style={styles.item} onPress={setTest}>
              <Text style={[styles.contentText, {color: activeTheme.color3}]}>테스트 데이터 추가</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={deleteAllSchedule}>
              <Text style={[styles.contentText, {color: activeTheme.color3}]}>테스트 데이터 삭제</Text>
            </Pressable>

            <View style={[styles.blank, {backgroundColor: activeTheme.color2}]} />

            <Pressable style={styles.item} onPress={deleteToken}>
              <Text style={[styles.contentText, {color: activeTheme.color3}]}>토큰 삭제</Text>
            </Pressable>

            <View style={[styles.blank, {backgroundColor: activeTheme.color2}]} />
          </>
        )}

        <View style={[styles.item, {borderBottomWidth: 1, borderBottomColor: activeTheme.color2}]}>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>버전</Text>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>{version}</Text>
        </View>

        {!isGuest && (
          <Pressable
            style={[styles.item, {borderBottomWidth: 1, borderBottomColor: activeTheme.color2}]}
            onPress={doLogout}>
            <Text style={[styles.contentText, {color: activeTheme.color3}]}>로그아웃</Text>
          </Pressable>
        )}

        <Pressable style={styles.item} onPress={moveLeave}>
          <Text style={[styles.contentText, {color: '#ff4160'}]}>탈퇴하기</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    paddingBottom: 40
  },
  blank: {
    height: 10,
    backgroundColor: '#f5f6f8'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  contentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  }
})

const profileStyles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 16
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16
  },
  loginWrapper: {
    gap: 20
  },
  loginTitleWrapper: {
    gap: 3
  },
  loginTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  loginButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#ffffff'
  }
})

const displayModeStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f6f8',
    paddingVertical: 20
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 10
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  display: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    borderWidth: 1
  },
  displayItem: {
    width: '100%',
    height: '30%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  pickWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pick: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff'
  }
})

const kakaoLoginIcon = StyleSheet.compose(profileStyles.iconWrapper, {backgroundColor: '#FEE500'})
const googleLoginIcon = StyleSheet.compose(profileStyles.iconWrapper, {
  backgroundColor: '#ffffff',
  borderColor: '#efefef',
  borderWidth: 1
})
const activePickWrapper = StyleSheet.compose(displayModeStyle.pickWrapper, {backgroundColor: '#1E90FF'})

export default Setting
