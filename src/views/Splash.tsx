import {useEffect} from 'react'
import {StyleSheet, Platform, StatusBar, View} from 'react-native'
import {TestIds, useAppOpenAd} from 'react-native-google-mobile-ads'
import SystemSplashScreen from 'react-native-splash-screen'
import {useSetRecoilState} from 'recoil'
import {isInitState} from '@/store/system'

const appOpenAdUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3765315237132279/9003768148'

const Splash = () => {
  const {
    isLoaded: isAppOpenAdLoaded,
    isClosed: isAppOpenAdClosed,
    load: appOpenAdLoad,
    show: appOpenAdShow
  } = useAppOpenAd(appOpenAdUnitId)

  const setIsInit = useSetRecoilState(isInitState)

  useEffect(() => {
    appOpenAdLoad()
  }, [appOpenAdLoad])

  useEffect(() => {
    if (isAppOpenAdLoaded) {
      SystemSplashScreen.hide()

      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true)
      }

      appOpenAdShow()
    }
  }, [isAppOpenAdLoaded, appOpenAdShow])

  useEffect(() => {
    if (isAppOpenAdClosed) {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false)
      }
      setIsInit(true)
    }
  }, [isAppOpenAdClosed, setIsInit])

  return <View style={styles.container} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

export default Splash
