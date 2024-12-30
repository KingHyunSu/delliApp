import React from 'react'
import {useWindowDimensions, Platform, AppState, StatusBar, StyleSheet, SafeAreaView} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SystemSplashScreen from 'react-native-splash-screen'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads'
// import crashlytics from '@react-native-firebase/crashlytics'

// navigations
import {NavigationContainer, LinkingOptions} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {navigationRef} from '@/utils/navigation'

// views
import SplashScreen from '@/views/Splash'
import {IntroScreen, JoinTermsScreen} from '@/views/join'
import HomeScreen from '@/views/Home'
import HomeCustomScreen from '@/views/HomeCustom'
import EditScheduleScreen from '@/views/EditSchedule'
import EditRoutineScreen from '@/views/EditRoutine'
import EditTodoScreen from '@/views/EditTodo'
import {StoreListScreen, StoreDetailScreen} from '@/views/store'
import SettingScreen from '@/views/Setting'
import LeaveScreen from '@/views/Leave'
import CategoryStats from '@/views/CategoryStats'
import StatsScreen from '@/views/Stats'

// components
import Toast from '@/components/Toast'
import {Alert} from '@/components/messageBox'
import Loading from '@/components/Loading'
import LoginBottomSheet from '@/components/bottomSheet/LoginBottomSheet'

import {AlertProvider} from '@/components/Alert'

// icons
import HomeIcon from '@/assets/icons/home.svg'
import MyIcon from '@/assets/icons/my.svg'
import ChartIcon from '@/assets/icons/chart.svg'
import StoreIcon from '@/assets/icons/store.svg'

// stores
import {useRecoilState, useRecoilValue, useSetRecoilState, useRecoilSnapshot} from 'recoil'
import {
  loginState,
  isLunchState,
  windowDimensionsState,
  bottomSafeAreaColorState,
  activeThemeState,
  displayModeState,
  activeBackgroundState,
  statusBarColorState,
  statusBarTextStyleState,
  setLoginStateSetter
} from '@/store/system'

import {StackNavigator, BottomTabNavigator} from '@/types/navigation'

import initDatabase from '@/apis/local/utils/init'
import {focusModeInfoState} from '@/store/schedule'

import {useAccess} from '@/apis/hooks/useAuth'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3765315237132279/9003768148'

const Tab = createBottomTabNavigator<BottomTabNavigator>()
const Stack = createNativeStackNavigator<StackNavigator>()

interface BottomTabsProps {
  activeTheme: ActiveTheme
}
const BottomTabs = React.memo(({activeTheme}: BottomTabsProps) => {
  const borderTopColor = activeTheme.color6

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopColor,
          borderTopWidth: 1,
          backgroundColor: activeTheme.color5,
          height: 56
        },
        tabBarItemStyle: {
          height: 56
        }
      }} // 탭의 상단 바 제거
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <HomeIcon width={30} height={30} fill={focused ? activeTheme.color7 : activeTheme.color8} />
          }
        }}
      />
      {/*<Tab.Screen*/}
      {/*  name="Routine"*/}
      {/*  component={RoutineListScreen}*/}
      {/*  options={{*/}
      {/*    tabBarIcon: ({focused}) => {*/}
      {/*      return <RoutineIcon width={30} height={30} fill={focused ? '#424242' : '#babfc5'} />*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      <Tab.Screen
        name="StoreList"
        component={StoreListScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <StoreIcon width={30} height={30} fill={focused ? activeTheme.color7 : activeTheme.color8} />
          }
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <MyIcon width={30} height={30} fill={focused ? activeTheme.color7 : activeTheme.color8} />
          }
        }}
      />
    </Tab.Navigator>
  )
})

const linking: LinkingOptions<BottomTabNavigator> = {
  prefixes: ['delli://'],
  config: {
    screens: {
      Home: 'widget/reload'
    }
  }
}

function App(): JSX.Element {
  const {mutateAsync: accessMutateAsync} = useAccess()
  const windowDimensions = useWindowDimensions()

  const {isLoaded, load, show} = useAppOpenAd(adUnitId)

  const appState = React.useRef(AppState.currentState)
  const focusModeIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const [isActiveApp, setIsActiveApp] = React.useState(false)
  const [isInit, setIsInit] = React.useState(false)

  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)
  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)

  const displayMode = useRecoilValue(displayModeState)
  const activeBackground = useRecoilValue(activeBackgroundState)
  const activeTheme = useRecoilValue(activeThemeState)

  const setWindowDimensions = useSetRecoilState(windowDimensionsState)

  const [statusBarColor, setStatusBarColor] = useRecoilState(statusBarColorState)
  const [statusBarTextStyle, setStatusBarTextStyle] = useRecoilState(statusBarTextStyleState)
  const [bottomSafeAreaColor, setBottomSafeAreaColor] = useRecoilState(bottomSafeAreaColorState)

  const screenOptions = React.useMemo(() => {
    return {headerShown: false}
  }, [])

  const statusBarStyle = React.useMemo(() => {
    return {
      flex: 0,
      backgroundColor: statusBarColor,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }, [statusBarColor])

  const containerStyle = React.useMemo(() => {
    return {flex: 1, backgroundColor: bottomSafeAreaColor}
  }, [bottomSafeAreaColor])

  const changeRoute = React.useCallback(() => {
    const route = navigationRef.current?.getCurrentRoute()

    let _statusBarTextStyle: 'dark-content' | 'light-content' = displayMode === 1 ? 'dark-content' : 'light-content'
    let _statusBarColor: string | null = activeTheme.color1
    let _bottomSafeAreaColor: string | null = activeTheme.color5

    switch (route?.name) {
      case 'Intro':
      case 'JoinTerms':
        _statusBarTextStyle = 'dark-content'
        _statusBarColor = '#ffffff'
        _bottomSafeAreaColor = '#ffffff'
        break
      case 'Home':
      case 'HomeCustom':
      case 'EditSchedule':
        _statusBarTextStyle = activeBackground.display_mode === 1 ? 'dark-content' : 'light-content'
        _statusBarColor = null
        break
      case 'StoreList':
        _statusBarTextStyle = 'dark-content'
        _statusBarColor = '#f5f6f8'
        break
      case 'EditRoutine':
      case 'EditTodo':
      case 'Leave':
        _bottomSafeAreaColor = activeTheme.color1
        break
      // case 'EditSchedule':
      // case 'EditGoal':
      // case 'EditRoutine':
      //   // 화면의 useEffect 보다 늦게 실행됨...
      //   _bottomSafeAreaColor = null
      //   break
    }

    if (_statusBarTextStyle) {
      setStatusBarTextStyle(_statusBarTextStyle)
    }

    if (_statusBarColor) {
      setStatusBarColor(_statusBarColor)
    }

    if (_bottomSafeAreaColor) {
      setBottomSafeAreaColor(_bottomSafeAreaColor)
    }
  }, [
    activeBackground.display_mode,
    displayMode,
    activeTheme,
    setStatusBarTextStyle,
    setStatusBarColor,
    setBottomSafeAreaColor
  ])

  // 2024-05-18 서버 제거로인해 비활성화
  // React.useEffect(() => {
  //   if (isLogin) {
  //     load()
  //   }
  // }, [isLogin, load])

  // React.useEffect(() => {
  //   const setToken = async () => {
  //     const token = await AsyncStorage.getItem('token')

  //     if (token) {
  //       setIsLogin(true)
  //       setIsActiveApp(true)
  //     } else {
  //       setIsLunch(true)
  //     }
  //   }

  //   setToken()
  //   if (isLogin && isLoaded) {
  //     show()
  //   }
  // }, [isLogin, isLoaded, show, setIsLunch, setIsLogin])

  // React.useEffect(() => {
  //   if (isLunch) {
  //     SystemSplashScreen.hide()
  //     // crashlytics().crash()
  //   }
  // }, [isLunch])

  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.email'],
      webClientId: '284062642616-eanl2f71mnfah7lth13uneipuuc10l9t.apps.googleusercontent.com',
      offlineAccess: false
    })
  }, [])

  React.useEffect(() => {
    setWindowDimensions(windowDimensions)
  }, [setWindowDimensions, windowDimensions])

  React.useEffect(() => {
    const init = async () => {
      const isInitDatabase = await initDatabase()

      try {
        const token = await AsyncStorage.getItem('token')

        if (token) {
          await accessMutateAsync()
          setIsLogin(true)
        }
      } catch (e) {
      } finally {
        setIsInit(isInitDatabase)
      }
    }

    init()
  }, [setIsLogin, accessMutateAsync])

  /**
   * 테스트용 광고 start
   */
  // TODO android v1.0.0 배포에서 제외 2024-07-21
  // React.useEffect(() => {
  //   // 광고 load
  //   load()
  // }, [load])
  //
  // // TODO android v1.0.0 배포에서 제외 2024-07-21
  // React.useEffect(() => {
  //   if (isLoaded) {
  //     // 광고 show
  //     show()
  //   }
  // }, [isLoaded])
  /**
   * 테스트용 광고 end
   */

  React.useEffect(() => {
    if (isInit) {
      SystemSplashScreen.hide()
    }
  }, [isInit])

  React.useEffect(() => {
    setLoginStateSetter(setIsLogin)
  }, [setLoginStateSetter])

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

  // handle focus timer
  React.useEffect(() => {
    if (focusModeInfo) {
      focusModeIntervalRef.current = setInterval(() => {
        setFocusModeInfo(prevState => {
          if (prevState) {
            return {
              schedule_activity_log_id: prevState.schedule_activity_log_id,
              schedule_id: prevState.schedule_id,
              seconds: prevState.seconds + 1
            }
          }
          return prevState
        })
      }, 1000)
    } else {
      if (focusModeIntervalRef.current) {
        setFocusModeInfo(null)
        clearInterval(focusModeIntervalRef.current)
      }
    }

    return () => {
      if (focusModeIntervalRef.current) {
        clearInterval(focusModeIntervalRef.current)
      }
    }
  }, [focusModeInfo])

  React.useEffect(() => {
    if (isActiveApp) {
      const handleFocusMode = async () => {
        const jsonValue = await AsyncStorage.getItem('focusModeInfo')

        if (jsonValue) {
          const value = JSON.parse(jsonValue)
          const now = Date.now()
          const timePassed = Math.floor((now - value.saveDate) / 1000)

          setFocusModeInfo({
            schedule_activity_log_id: value.schedule_activity_log_id,
            schedule_id: value.schedule_id,
            seconds: value.seconds + timePassed
          })

          await AsyncStorage.removeItem('focusModeInfo')
        }
      }

      handleFocusMode()
    } else {
      if (focusModeInfo) {
        const saveFocusMode = async () => {
          const value = {
            schedule_id: focusModeInfo.schedule_id,
            seconds: focusModeInfo.seconds,
            saveDate: Date.now()
          }
          const jsonValue = JSON.stringify(value)

          await AsyncStorage.setItem('focusModeInfo', jsonValue)
        }

        saveFocusMode()
      }
    }
  }, [isActiveApp])

  // recoil debug
  // function RecoilDebugObserver(): React.ReactNode {
  //   const recoilSnapshot = useRecoilSnapshot()
  //   React.useEffect(() => {
  //     for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
  //       // console.debug(node.key, recoilSnapshot.getLoadable(node))
  //       console.debug('recoil update : ', node.key)
  //     }
  //   }, [recoilSnapshot])
  //
  //   return null
  // }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        {/* <RecoilDebugObserver /> */}
        <BottomSheetModalProvider>
          <AlertProvider>
            <StatusBar translucent backgroundColor="transparent" barStyle={statusBarTextStyle} />

            <SafeAreaView style={statusBarStyle} />

            <Toast />
            <Alert />
            <Loading />
            <LoginBottomSheet />

            <SafeAreaView style={containerStyle}>
              <NavigationContainer ref={navigationRef} linking={linking} onStateChange={changeRoute}>
                <Stack.Navigator screenOptions={screenOptions}>
                  {!isInit ? (
                    <Stack.Screen name="Splash" component={SplashScreen} />
                  ) : isLogin ? (
                    <>
                      <Stack.Screen name="MainTabs">{() => <BottomTabs activeTheme={activeTheme} />}</Stack.Screen>
                      <Stack.Screen
                        name="HomeCustom"
                        component={HomeCustomScreen}
                        options={{animation: 'fade', animationDuration: 300}}
                      />
                      <Stack.Screen name="EditSchedule" component={EditScheduleScreen} options={{animation: 'none'}} />
                      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />

                      <Stack.Screen name="EditRoutine" component={EditRoutineScreen} />
                      <Stack.Screen name="EditTodo" component={EditTodoScreen} />

                      <Stack.Screen name="CategoryStats" component={CategoryStats} />

                      <Stack.Screen name="Leave" component={LeaveScreen} />
                    </>
                  ) : (
                    <>
                      <Stack.Screen name="Intro" component={IntroScreen} />
                      <Stack.Screen name="JoinTerms" component={JoinTermsScreen} />
                    </>
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </AlertProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App
