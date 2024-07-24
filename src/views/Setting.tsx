import React from 'react'
import {Platform, Linking, StyleSheet, ScrollView, Pressable, View, Text, Alert} from 'react-native'
import AppBar from '@/components/AppBar'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import * as KakaoAuth from '@react-native-seoul/kakao-login'
import {LOGIN_TYPE} from '@/utils/types'

import {useSetRecoilState, useResetRecoilState, useRecoilValue} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {isEditState, loginState} from '@/store/system'

import * as termsApi from '@/apis/terms'
import * as authApi from '@/apis/auth'

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {SettingNavigationProps} from '@/types/navigation'

import {setTestData, deleteAllScheduleData} from '@/utils/test'
import {format} from 'date-fns'

const Setting = ({navigation}: SettingNavigationProps) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const scheduleList = useRecoilValue(scheduleListState)

  const setIsEdit = useSetRecoilState(isEditState)
  const setIsLogin = useSetRecoilState(loginState)
  const resetScheduleDate = useResetRecoilState(scheduleDateState)
  const resetScheduleList = useResetRecoilState(scheduleListState)
  const resetActiveTimeTableCategoryState = useResetRecoilState(activeTimeTableCategoryState)

  const handleMove = React.useCallback(() => {
    // navigation.navigate('Home')
    // setIsEdit(true)
  }, [])

  const getTermsUrl = async (type: string) => {
    const response = await termsApi.getTermsUrl(type)
    return response.data.url || ''
  }

  const version = React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return '1.3.0'
    } else if (Platform.OS === 'android') {
      return '1.0.0'
    }
    return ''
  }, [Platform.OS])

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

  return (
    <View style={styles.container}>
      <AppBar>
        <View style={headerStyles.section}>
          <Pressable style={styles.backButton} onPress={navigation.goBack}>
            <ArrowLeftIcon stroke="#242933" />
          </Pressable>
        </View>

        <View style={headerStyles.titleSection}>
          <Text style={styles.appBarTitle}>설정</Text>
        </View>

        <View style={headerStyles.section} />
      </AppBar>

      <ScrollView style={styles.scrollContainer}>
        {/* <Pressable style={styles.item} onPress={handleMove}>
          <Text style={styles.contentText}>휴지통</Text>
        </Pressable>

        <View style={styles.blank} /> */}

        <Pressable style={styles.item} onPress={moveServiceTermsPage}>
          <Text style={styles.contentText}>서비스 이용 약관</Text>
          <ArrowRightIcon stroke="#242933" />
        </Pressable>

        <Pressable style={styles.item} onPress={movePrivacyPage}>
          <Text style={styles.contentText}>개인정보 처리방침</Text>
          <ArrowRightIcon stroke="#242933" />
        </Pressable>

        <View style={styles.blank} />

        {__DEV__ && (
          <>
            <Pressable style={styles.item} onPress={setTest}>
              <Text style={styles.contentText}>테스트 데이터 삽입</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={deleteAllSchedule}>
              <Text style={styles.contentText}>테스트 데이터 삭제</Text>
            </Pressable>

            <View style={styles.blank} />
          </>
        )}

        <View style={styles.footer}>
          <View style={styles.item}>
            <Text style={styles.contentText}>버전</Text>
            <Text style={styles.contentText}>{version}</Text>
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
    flex: 1,
    backgroundColor: '#fff'
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

const headerStyles = StyleSheet.create({
  section: {
    flex: 1
  },
  titleSection: {
    flex: 1,
    alignItems: 'center'
  }
})

export default Setting
