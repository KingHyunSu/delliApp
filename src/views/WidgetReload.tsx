import {useEffect} from 'react'
import {StyleSheet, ActivityIndicator, Alert, Text, View} from 'react-native'
import {TestIds, useRewardedAd} from 'react-native-google-mobile-ads'
import SystemSplashScreen from 'react-native-splash-screen'

import * as widgetApi from '@/apis/widget'
import {useSetRecoilState} from 'recoil'
import {isInitState, toastState, widgetReloadableState} from '@/store/system'
import {scheduleDateState} from '@/store/schedule'
import {WidgetReloadScreenProps} from '@/types/navigation'

const rewardAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3765315237132279/5689289144'

const WidgetReload = ({navigation, route}: WidgetReloadScreenProps) => {
  const {
    isLoaded: isRewardAdLoaded,
    isEarnedReward,
    load: rewardAdLoad,
    show: rewardAdShow
  } = useRewardedAd(rewardAdUnitId)

  const setWidgetReloadable = useSetRecoilState(widgetReloadableState)
  const setIsInit = useSetRecoilState(isInitState)
  const setScheduleDate = useSetRecoilState(scheduleDateState)
  const setToast = useSetRecoilState(toastState)

  useEffect(() => {
    SystemSplashScreen.hide()
    setIsInit(true)
  }, [setIsInit])

  useEffect(() => {
    if (!isRewardAdLoaded) {
      rewardAdLoad()
    }
  }, [isRewardAdLoaded, rewardAdLoad])

  useEffect(() => {
    if (isRewardAdLoaded) {
      setScheduleDate(new Date())

      const timer = setTimeout(() => {
        Alert.alert('위젯 생성 완료', '광고 시청하고 위젯 새로고침', [
          {
            text: '취소',
            style: 'cancel',
            onPress: () => {
              navigation.navigate('MainTabs', {
                screen: 'Home',
                params: {scheduleUpdated: false}
              })
            }
          },
          {
            text: '새로고침',
            onPress: async () => {
              rewardAdShow()
            }
          }
        ])
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isRewardAdLoaded, navigation, route.params, setScheduleDate, rewardAdShow])

  useEffect(() => {
    if (isEarnedReward) {
      const run = async () => {
        // 상태 업데이트
        await widgetApi.updateWidgetReloadable()
        setWidgetReloadable(true)

        setToast({visible: true, message: '위젯 새로고침 완료'})
        // 위젯 업데이트
        navigation.replace('MainTabs', {
          screen: 'Home',
          params: {scheduleUpdated: true}
        })
      }

      run()
    }
  }, [isEarnedReward, setWidgetReloadable, setToast, navigation])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.title}>새로운 위젯 생성중</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  wrapper: {
    gap: 20,
    paddingBottom: 40
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  }
})

export default WidgetReload
