import React from 'react'
import {Linking, StyleSheet, ScrollView, Pressable, View, Text} from 'react-native'
import AppBar from '@/components/AppBar'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import * as KakaoAuth from '@react-native-seoul/kakao-login'
import {LOGIN_TYPE} from '@/utils/types'

import {useSetRecoilState, useResetRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {isEditState, loginState} from '@/store/system'

import * as termsApi from '@/apis/terms'
import * as authApi from '@/apis/auth'

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {SettingNavigationProps} from '@/types/navigation'

const Setting = ({navigation}: SettingNavigationProps) => {
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

  const moveServiceTermsPage = React.useCallback(async () => {
    const url = await getTermsUrl('1')
    Linking.openURL(url)
  }, [])

  const movePrivacyPage = React.useCallback(async () => {
    const url = await getTermsUrl('2')
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

        <View style={styles.footer}>
          <View style={styles.item}>
            <Text style={styles.contentText}>버전</Text>
            <Text style={styles.contentText}>1.1.0</Text>
          </View>

          <Pressable style={styles.item} onPress={doLogout}>
            <Text style={styles.contentText}>로그아웃</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={handleLeave}>
            <Text style={styles.contentText}>탈퇴하기</Text>
          </Pressable>
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
