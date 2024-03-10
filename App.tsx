import React from 'react'
import {Platform, AppState, StyleSheet, SafeAreaView} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SplashScreen from 'react-native-splash-screen'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {navigationRef} from '@/utils/navigation'

// components
import LoginScreen from '@/views/Login'
import JoinTerms from '@/views/JoinTerms'

import HomeScreen from '@/views/Home'
import SettingScreen from '@/views/Setting'
import LogoutScreen from '@/views/Logout'

// utils
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useRecoilState, useRecoilSnapshot} from 'recoil'
import {loginState, isLunchState} from '@/store/system'

import {RootStackParamList} from '@/types/navigation'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
// [20240310] 광고 스토어 배포 후 오픈 예정
// import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads'

import * as authApi from '@/apis/auth'
// import crashlytics from '@react-native-firebase/crashlytics'

function App(): JSX.Element {
  // [20240310] 광고 스토어 배포 후 오픈 예정
  // const {isLoaded, load, show} = useAppOpenAd(
  //   Platform.select({
  //     ios: 'ca-app-pub-3765315237132279/9003768148',
  //     android: 'ca-app-pub-3765315237132279/4177449893'
  //   }) || ''
  // )
  const appState = React.useRef(AppState.currentState)
  const [isActiveApp, setIsActiveApp] = React.useState(false)

  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)
  const Stack = createStackNavigator<RootStackParamList>()

  const screenOptions = React.useMemo(() => {
    return {headerShown: false}
  }, [])

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (appState.current.match(/inactive|background/) && state === 'active') {
        setIsActiveApp(true)
      } else {
        setIsActiveApp(false)
      }

      appState.current = state
    })

    return () => {
      subscription.remove()
    }
  }, [])

  React.useEffect(() => {
    const updateAccess = async () => {
      await authApi.updateAccess()
    }

    if (isActiveApp && isLogin) {
      updateAccess()
    }
  }, [isActiveApp, isLogin])

  // [20240310] 광고 스토어 배포 후 오픈 예정
  // React.useEffect(() => {
  //   load()
  // }, [load])

  React.useEffect(() => {
    const setToken = async () => {
      const token = await AsyncStorage.getItem('token')

      if (token) {
        setIsLogin(true)
        setIsActiveApp(true)
      } else {
        setIsLunch(true)
      }
    }

    setToken()

    // [20240310] 광고 스토어 배포 후 오픈 예정
    // if (isLoaded) {
    //   show()
    //   setToken()
    // }
    // }, [isLoaded, show, setIsLunch, setIsLogin])
  }, [setIsLunch, setIsLogin])

  React.useEffect(() => {
    if (isLunch) {
      SplashScreen.hide()
      // crashlytics().crash()
    }
  }, [isLunch])

  // recoil debug
  function RecoilDebugObserver(): React.ReactNode {
    const recoilSnapshot = useRecoilSnapshot()
    React.useEffect(() => {
      for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
        // console.debug(node.key, recoilSnapshot.getLoadable(node))
        console.debug('recoil update : ', node.key)
      }
    }, [recoilSnapshot])

    return null
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* <RecoilDebugObserver /> */}
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.statusBar} />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            {isLogin ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Setting" component={SettingScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="JoinTerms" component={JoinTerms} />
              </>
            )}
            <Stack.Screen name="Logout" component={LogoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  statusBar: {
    flex: 0,
    backgroundColor: '#fff'
  }
})
export default App
