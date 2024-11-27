import React from 'react'
import {Platform, Linking, StyleSheet, ScrollView, Pressable, View, Text, Alert} from 'react-native'
import AppBar from '@/components/AppBar'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import * as KakaoAuth from '@react-native-seoul/kakao-login'
import {LOGIN_TYPE} from '@/utils/types'

import {useSetRecoilState, useResetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {
  activeThemeState,
  bottomSafeAreaColorState,
  displayModeState,
  loginState,
  statusBarColorState,
  statusBarTextStyleState,
  windowDimensionsState
} from '@/store/system'

import * as termsApi from '@/apis/terms'
import * as authApi from '@/apis/auth'

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {SettingNavigationProps} from '@/types/navigation'

import {setTestData, deleteAllScheduleData} from '@/utils/test'
import {format} from 'date-fns'
import {useUpdateDisplayMode} from '@/apis/hooks/useUser'

const Setting = ({navigation}: SettingNavigationProps) => {
  const {mutateAsync: updateDisplayMutateAsync} = useUpdateDisplayMode()

  const activeTheme = useRecoilValue(activeThemeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const scheduleList = useRecoilValue(scheduleListState)

  const [displayMode, setDisplayMode] = useRecoilState(displayModeState)
  const setStatusBarColor = useSetRecoilState(statusBarColorState)
  const setStatusBarTextStyle = useSetRecoilState(statusBarTextStyleState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)
  const setIsLogin = useSetRecoilState(loginState)
  const resetScheduleDate = useResetRecoilState(scheduleDateState)
  const resetScheduleList = useResetRecoilState(scheduleListState)
  const resetActiveTimeTableCategoryState = useResetRecoilState(activeTimeTableCategoryState)

  const getTermsUrl = async (type: string) => {
    const response = await termsApi.getTermsUrl(type)
    return response.data.url || ''
  }

  const displayStyle = React.useMemo(() => {
    const aspectRatio = 1.77
    const width = windowDimensions.width / 4
    const height = width * aspectRatio

    return [displayModeStyle.display, {width, height}]
  }, [windowDimensions.width])

  const getPickWrapperStyle = React.useCallback(
    (mode: DisplayMode) => {
      return displayMode === mode ? activePickWrapper : displayModeStyle.pickWrapper
    },
    [displayMode]
  )

  const version = React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return '1.4.0'
    } else if (Platform.OS === 'android') {
      return '1.0.0'
    }
    return ''
  }, [Platform.OS])

  const changeDisplayMode = React.useCallback(
    (displayMode: DisplayMode) => async () => {
      await updateDisplayMutateAsync(displayMode)
      setDisplayMode(displayMode)
      // setBottomSafeAreaColor(activeTheme.color1)
    },
    [updateDisplayMutateAsync, setDisplayMode]
  )

  React.useEffect(() => {
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

  const moveServiceTermsPage = React.useCallback(async () => {
    // const url = await getTermsUrl('1')
    const url = 'https://coherent-warbler-b91.notion.site/56c16f3a2e3a40d8a81e950ccaf00269?pvs=4'
    Linking.openURL(url)
  }, [])

  const movePrivacyPage = React.useCallback(async () => {
    // const url = await getTermsUrl('2')
    const url = 'https://coherent-warbler-b91.notion.site/a49ff95ec433493b86124571c6677261?pvs=4'
    Linking.openURL(url)
  }, [])

  const getLoginType = async () => {
    const result = await authApi.getLoginType()

    return result.data.login_type
  }

  const doLogout = React.useCallback(async () => {
    try {
      const loginType = await getLoginType()

      if (loginType === LOGIN_TYPE.GOOGLE) {
        await GoogleSignin.signOut()
      } else if (loginType === LOGIN_TYPE.KAKAO) {
        await KakaoAuth.logout()
      }

      resetScheduleDate()
      resetScheduleList()
      resetActiveTimeTableCategoryState()
      await AsyncStorage.setItem('token', '')
      setIsLogin(false)
    } catch (e) {
      console.error(e)
    }
  }, [resetScheduleDate, resetScheduleList, resetActiveTimeTableCategoryState, setIsLogin])

  const handleLeave = React.useCallback(() => {
    navigation.navigate('Leave')
  }, [navigation])

  const setTest = React.useCallback(async () => {
    try {
      const date = format(scheduleDate, 'yyyy-MM-dd')

      await setTestData(date, scheduleList)
      Alert.alert('추가 완료', '', [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('Home')
          }
        }
      ])
    } catch (e) {
      Alert.alert('추가 실패', String(e))
    }
  }, [navigation, scheduleDate, scheduleList])

  const deleteAllSchedule = React.useCallback(async () => {
    try {
      await deleteAllScheduleData()
      Alert.alert('삭제 완료')
    } catch (e) {
      Alert.alert('삭제 실패', String(e))
    }
  }, [])

  const deleteToken = React.useCallback(async () => {
    try {
      await AsyncStorage.setItem('token', '')
      Alert.alert('토큰 삭제 완료')
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color1}]}>
      <AppBar backPress color={activeTheme.color1} backPressIconColor={activeTheme.color3} />

      <ScrollView style={styles.scrollContainer}>
        {/* <Pressable style={styles.item} onPress={handleMove}>
          <Text style={styles.contentText}>휴지통</Text>
        </Pressable>

        <View style={styles.blank} /> */}

        <View style={[displayModeStyle.container, {backgroundColor: activeTheme.color2}]}>
          <View style={displayModeStyle.wrapper}>
            <Text style={[displayModeStyle.label, {color: activeTheme.color3}]}>라이트</Text>

            <Pressable style={[displayStyle, {backgroundColor: '#ffffff'}]} onPress={changeDisplayMode(1)}>
              <View style={[displayModeStyle.displayItem, {backgroundColor: '#f9f9f9'}]} />
              <View style={[displayModeStyle.displayItem, {backgroundColor: '#f9f9f9'}]} />
            </Pressable>

            <View style={getPickWrapperStyle(1)}>
              <View style={displayModeStyle.pick} />
            </View>
          </View>

          <View style={displayModeStyle.wrapper}>
            <Text style={[displayModeStyle.label, {color: activeTheme.color3}]}>다크</Text>

            <Pressable style={[displayStyle, {backgroundColor: '#202023'}]} onPress={changeDisplayMode(2)}>
              <View style={[displayModeStyle.displayItem, {backgroundColor: '#35353B'}]} />
              <View style={[displayModeStyle.displayItem, {backgroundColor: '#35353B'}]} />
            </Pressable>

            <View style={getPickWrapperStyle(2)}>
              <View style={displayModeStyle.pick} />
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.item, {borderBottomWidth: 1, borderBottomColor: activeTheme.color2}]}
          onPress={moveServiceTermsPage}>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>서비스 이용 약관</Text>
          <ArrowRightIcon stroke={activeTheme.color3} />
        </Pressable>

        <Pressable style={styles.item} onPress={movePrivacyPage}>
          <Text style={[styles.contentText, {color: activeTheme.color3}]}>개인정보 처리방침</Text>
          <ArrowRightIcon stroke={activeTheme.color3} />
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

        <View style={styles.footer}>
          <View style={styles.item}>
            <Text style={[styles.contentText, {color: activeTheme.color3}]}>버전</Text>
            <Text style={[styles.contentText, {color: activeTheme.color3}]}>{version}</Text>
          </View>

          {/* 2024-05-18 서버 제거로 인해 비활성화 */}
          {/* <Pressable style={styles.item} onPress={doLogout}>
            <Text style={styles.contentText}>로그아웃</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={handleLeave}>
            <Text style={styles.contentText}>탈퇴하기</Text>
          </Pressable> */}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 20
  },
  footer: {
    marginTop: 20
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
  appBarTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  },
  contentText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  backButton: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  },

  display: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    gap: 10
  },
  displayItem: {
    width: '100%',
    height: '30%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },

  pickWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor: '#1E90FF',
    backgroundColor: '#efefef',
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

const activePickWrapper = StyleSheet.compose(displayModeStyle.pickWrapper, {backgroundColor: '#1E90FF'})

export default Setting
