import React from 'react'
import {useWindowDimensions, Platform, AppState, StatusBar, SafeAreaView, Alert} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SplashScreen from 'react-native-splash-screen'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads'
// import crashlytics from '@react-native-firebase/crashlytics'

// navigations
import {NavigationContainer, LinkingOptions} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {navigationRef} from '@/utils/navigation'

// views
import HomeScreen from '@/views/Home'
import StatsScreen from '@/views/Stats'
import SettingScreen from '@/views/Setting'
import LeaveScreen from '@/views/Leave'
import EditScheduleScreen from '@/views/EditSchedule'
import CategoryStats from '@/views/CategoryStats'

// components
import Toast from '@/components/Toast'

// icons
import HomeIcon from '@/assets/icons/home.svg'
import MyIcon from '@/assets/icons/my.svg'
import ChartIcon from '@/assets/icons/chart.svg'

// stores
import {useRecoilState, useSetRecoilState, useRecoilSnapshot, useRecoilValue} from 'recoil'
import {loginState, isLunchState, windowDimensionsState, isEditState} from '@/store/system'

import {StackNavigator, BottomTabNavigator} from '@/types/navigation'

import initDatabase from '@/repository/utils/init'
import {activeScheduleSubmitState, focusModeInfoState} from '@/store/schedule'

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3765315237132279/9003768148'

const Tab = createBottomTabNavigator<BottomTabNavigator>()
const Stack = createStackNavigator<StackNavigator>()

const BottomTabs = React.memo(() => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {height: 56}}} // 탭의 상단 바 제거
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <HomeIcon width={30} height={30} fill={focused ? '#424242' : '#babfc5'} />
          }
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <ChartIcon width={30} height={30} fill={focused ? '#424242' : '#babfc5'} />
          }
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <MyIcon width={30} height={30} fill={focused ? '#424242' : '#babfc5'} />
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
  const windowDimensions = useWindowDimensions()

  const {isLoaded, load, show} = useAppOpenAd(adUnitId)

  const appState = React.useRef(AppState.currentState)
  const focusModeIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const [isActiveApp, setIsActiveApp] = React.useState(false)
  const [isInit, setIsInit] = React.useState(false)

  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)
  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)
  const isScheduleEdit = useRecoilValue(isEditState)
  const activeScheduleSubmit = useRecoilValue(activeScheduleSubmitState)
  const setWindowDimensions = useSetRecoilState(windowDimensionsState)

  const screenOptions = React.useMemo(() => {
    return {headerShown: false}
  }, [])

  const statusBarStyle = React.useMemo(() => {
    return {
      flex: 0,
      backgroundColor: '#ffffff',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }, [])

  const bottomSafeAreaColor = React.useMemo(() => {
    if (isScheduleEdit) {
      return activeScheduleSubmit ? '#1E90FF' : '#f5f6f8'
    }
    return '#ffffff'
  }, [isScheduleEdit, activeScheduleSubmit])

  const containerStyle = React.useMemo(() => {
    return {flex: 1, backgroundColor: bottomSafeAreaColor}
  }, [bottomSafeAreaColor])

  // 2024-05-18 서버 제거로인해 비활성화
  // React.useEffect(() => {
  //   const updateAccess = async () => {
  //     await authApi.updateAccess()
  //   }

  //   if (isActiveApp && isLogin) {
  //     updateAccess()
  //   }
  // }, [isActiveApp, isLogin])

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
  //     SplashScreen.hide()
  //     // crashlytics().crash()
  //   }
  // }, [isLunch])

  React.useEffect(() => {
    setWindowDimensions(windowDimensions)
  }, [setWindowDimensions, windowDimensions])

  React.useEffect(() => {
    const init = async () => {
      const isInitDatabase = await initDatabase()
      setIsInit(isInitDatabase)
    }

    init()
  }, [])

  /**
   * 테스트용 광고 비활성화 start
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
   * 테스트용 광고 비활성화 end
   */

  React.useEffect(() => {
    if (isInit) {
      SplashScreen.hide()
    }
  }, [isInit])

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
    <GestureHandlerRootView style={{flex: 1}}>
      {/* <RecoilDebugObserver /> */}
      <BottomSheetModalProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        <SafeAreaView style={statusBarStyle} />

        <Toast />

        <SafeAreaView style={containerStyle}>
          <NavigationContainer ref={navigationRef} linking={linking}>
            <Stack.Navigator initialRouteName="MainTabs" screenOptions={{headerShown: false}}>
              <Stack.Screen name="MainTabs" component={BottomTabs} />
              <Stack.Screen name="EditSchedule" component={EditScheduleScreen} options={{animationEnabled: false}} />
              <Stack.Screen name="CategoryStats" component={CategoryStats} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App
