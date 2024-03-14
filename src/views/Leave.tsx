import React from 'react'
import {StyleSheet, SafeAreaView, Pressable, View, Text} from 'react-native'
import AppBar from '@/components/AppBar'
import Loading from '@/components/Loading'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {useSetRecoilState, useResetRecoilState} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'
import {activeTimeTableCategoryState} from '@/store/timetable'
import {loginState, isLoadingState} from '@/store/system'

import * as authApi from '@/apis/auth'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {LOGIN_TYPE} from '@/utils/types'

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

import {LeaveNavigationProps} from '@/types/navigation'

const Leave = ({navigation}: LeaveNavigationProps) => {
  const setIsLoading = useSetRecoilState(isLoadingState)
  const setIsLogin = useSetRecoilState(loginState)
  const resetScheduleDate = useResetRecoilState(scheduleDateState)
  const resetScheduleList = useResetRecoilState(scheduleListState)
  const resetActiveTimeTableCategoryState = useResetRecoilState(activeTimeTableCategoryState)

  const doLeave = React.useCallback(
    async (params: LeaveRequest) => {
      setIsLoading(true)

      await authApi.leave(params)

      resetScheduleDate()
      resetScheduleList()
      resetActiveTimeTableCategoryState()
      await AsyncStorage.setItem('token', '')
      setIsLogin(false)
    },
    [setIsLoading, resetActiveTimeTableCategoryState, resetScheduleDate, resetScheduleList, setIsLogin]
  )

  const handleLeave = React.useCallback(async () => {
    try {
      const result = await authApi.getLoginType()
      const loginType = result.data.login_type

      if (loginType === LOGIN_TYPE.APPLE) {
        const response = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL]
        })

        const credentialState = await appleAuth.getCredentialStateForUser(response.user)

        const appleAuthorizationCode = response.authorizationCode

        if (credentialState === appleAuth.State.AUTHORIZED) {
          const params = {loginType, code: appleAuthorizationCode}

          await doLeave(params)
        }
      } else {
        const params = {loginType, code: null}

        await doLeave(params)
      }

      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
    }
  }, [doLeave, setIsLoading])

  return (
    <SafeAreaView style={styles.container}>
      <AppBar>
        <View style={headerStyles.section}>
          <Pressable style={headerStyles.backButton} onPress={navigation.goBack}>
            <ArrowLeftIcon stroke="#242933" />
          </Pressable>
        </View>

        <View style={headerStyles.titleSection}>
          <Text style={headerStyles.title}>탈퇴하기</Text>
        </View>

        <View style={headerStyles.section} />
      </AppBar>

      <View style={styles.contents}>
        <Text style={styles.contentsText}>탈퇴하시면 작성하신 일정, 할 일 등</Text>
        <Text style={styles.contentsText}>모든 데이터는 복구 불가능합니다</Text>

        <Pressable style={styles.button} onPress={handleLeave}>
          <Text style={styles.buttonText}>탈퇴하기</Text>
        </Pressable>
      </View>
      <Loading />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  contents: {
    paddingTop: 40,
    paddingHorizontal: 16
  },
  contentsText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242',
    marginBottom: 5
  },
  button: {
    marginTop: 80,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#404247'
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#e7e7e7'
  }
})

const headerStyles = StyleSheet.create({
  section: {
    flex: 1
  },
  titleSection: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  },
  backButton: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Leave
