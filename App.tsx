import React from 'react'
import {useWindowDimensions, Linking, Platform, AppState, StatusBar, StyleSheet, SafeAreaView} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
// import crashlytics from '@react-native-firebase/crashlytics'

// navigations
import {NavigationContainer, LinkingOptions} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {navigationRef} from '@/utils/navigation'

// views
import SplashScreen from '@/views/Splash'
import MaintenanceScreen from '@/views/Maintenance'

import {IntroScreen, JoinTermsScreen} from '@/views/join'
import HomeScreen from '@/views/Home'
import HomeCustomScreen from '@/views/HomeCustom'
import EditScheduleScreen from '@/views/EditSchedule'
import EditRoutineScreen from '@/views/EditRoutine'
import EditTodoScreen from '@/views/EditTodo'
import {StoreListScreen, StoreDetailScreen} from '@/views/store'
import SettingScreen from '@/views/Setting'
import LeaveScreen from '@/views/Leave'
import WidgetReloadScreen from '@/views/WidgetReload'
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
  isInitState,
  isLoadingState,
  loginState,
  windowDimensionsState,
  bottomSafeAreaColorState,
  activeThemeState,
  displayModeState,
  activeBackgroundState,
  statusBarColorState,
  statusBarTextStyleState,
  setLoginStateSetter,
  systemInfoState
} from '@/store/system'

import {StackNavigator, BottomTabNavigator} from '@/types/navigation'

import initDatabase from '@/apis/local/utils/init'
import {focusModeInfoState, scheduleListState} from '@/store/schedule'

import {useAccess} from '@/apis/hooks/useAuth'
import {useGetCurrentScheduleList} from '@/apis/hooks/useSchedule'
import * as systemApi from '@/apis/server/system'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {GoogleSignin} from '@react-native-google-signin/google-signin'

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

function App(): JSX.Element {
  const {mutateAsync: accessMutateAsync} = useAccess()
  const {data: _scheduleList, isError: isGetScheduleListError} = useGetCurrentScheduleList()
  const windowDimensions = useWindowDimensions()

  const appState = React.useRef(AppState.currentState)
  const focusModeIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isActiveApp, setIsActiveApp] = React.useState(false)
  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)

  const isInit = useRecoilValue(isInitState)
  const displayMode = useRecoilValue(displayModeState)
  const activeBackground = useRecoilValue(activeBackgroundState)
  const activeTheme = useRecoilValue(activeThemeState)

  const setSystemInfo = useSetRecoilState(systemInfoState)
  const setWindowDimensions = useSetRecoilState(windowDimensionsState)
  const setScheduleList = useSetRecoilState(scheduleListState)
  const setIsLoading = useSetRecoilState(isLoadingState)
  const setIsInit = useSetRecoilState(isInitState)

  const [isLogin, setIsLogin] = useRecoilState(loginState)
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

  React.useEffect(() => {
    setScheduleList(_scheduleList)
  }, [_scheduleList, setScheduleList])

  React.useEffect(() => {
    if (isGetScheduleListError) {
      setIsLoading(false)
    }
  }, [isGetScheduleListError, setIsLoading])

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
    setLoginStateSetter(setIsLogin)
  }, [setLoginStateSetter])

  // TODO - 타이머 코드 임시 비활성화
  // React.useEffect(() => {
  //   const subscription = AppState.addEventListener('change', state => {
  //     if (appState.current.match(/inactive|background/) && state === 'active') {
  //       setIsActiveApp(true)
  //     } else {
  //       setIsActiveApp(false)
  //     }
  //
  //     appState.current = state
  //   })
  //
  //   return () => {
  //     subscription.remove()
  //   }
  // }, [])

  // TODO - 타이머 코드 임시 비활성화
  // handle focus timer
  // React.useEffect(() => {
  //   if (focusModeInfo) {
  //     focusModeIntervalRef.current = setInterval(() => {
  //       setFocusModeInfo(prevState => {
  //         if (prevState) {
  //           return {
  //             schedule_activity_log_id: prevState.schedule_activity_log_id,
  //             schedule_id: prevState.schedule_id,
  //             seconds: prevState.seconds + 1
  //           }
  //         }
  //         return prevState
  //       })
  //     }, 1000)
  //   } else {
  //     if (focusModeIntervalRef.current) {
  //       setFocusModeInfo(null)
  //       clearInterval(focusModeIntervalRef.current)
  //     }
  //   }
  //
  //   return () => {
  //     if (focusModeIntervalRef.current) {
  //       clearInterval(focusModeIntervalRef.current)
  //     }
  //   }
  // }, [focusModeInfo])

  // TODO - 타이머 코드 임시 비활성화
  // React.useEffect(() => {
  //   if (isActiveApp) {
  //     const handleFocusMode = async () => {
  //       const jsonValue = await AsyncStorage.getItem('focusModeInfo')
  //
  //       if (jsonValue) {
  //         const value = JSON.parse(jsonValue)
  //         const now = Date.now()
  //         const timePassed = Math.floor((now - value.saveDate) / 1000)
  //
  //         setFocusModeInfo({
  //           schedule_activity_log_id: value.schedule_activity_log_id,
  //           schedule_id: value.schedule_id,
  //           seconds: value.seconds + timePassed
  //         })
  //
  //         await AsyncStorage.removeItem('focusModeInfo')
  //       }
  //     }
  //
  //     handleFocusMode()
  //   } else {
  //     if (focusModeInfo) {
  //       const saveFocusMode = async () => {
  //         const value = {
  //           schedule_id: focusModeInfo.schedule_id,
  //           seconds: focusModeInfo.seconds,
  //           saveDate: Date.now()
  //         }
  //         const jsonValue = JSON.stringify(value)
  //
  //         await AsyncStorage.setItem('focusModeInfo', jsonValue)
  //       }
  //
  //       saveFocusMode()
  //     }
  //   }
  // }, [isActiveApp])

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
              <NavigationContainer
                ref={navigationRef}
                linking={{
                  prefixes: ['delli://'],
                  config: {
                    screens: {
                      WidgetReload: 'widget/reload/:id',
                      Maintenance: 'maintenance',
                      Splash: 'splash',
                      MainTabs: {
                        screens: {
                          Home: 'home'
                        }
                      },
                      Intro: 'intro'
                    }
                  },
                  async getInitialURL() {
                    const url = await Linking.getInitialURL()

                    const systemInfoResponse = await systemApi.getSystemInfo()
                    const systemInfo = systemInfoResponse.data

                    if (systemInfo.server_maintenance) {
                      return 'delli://maintenance'
                    }

                    setSystemInfo({
                      ios_update_required: systemInfo.ios_update_required,
                      android_update_required: systemInfo.android_update_required
                    })

                    // TODO - 강제 업데이트 후 제거하기
                    const isInitDatabase = await initDatabase()

                    try {
                      const token = await AsyncStorage.getItem('token')

                      if (token) {
                        await accessMutateAsync()
                        setIsLogin(true)

                        if (url === 'delli://widget') {
                          return isInit ? 'delli://home' : 'delli://splash'
                        } else if (url?.includes('widget/reload')) {
                          return url
                        }

                        return 'delli://splash'
                      }

                      setIsInit(true)
                      return 'delli://intro'
                    } catch (e) {
                      // return error page
                    }

                    return url
                  }
                }}
                onStateChange={changeRoute}>
                <Stack.Navigator screenOptions={screenOptions}>
                  {!isInit ? (
                    <>
                      <Stack.Screen name="Splash" component={SplashScreen} />
                      <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
                    </>
                  ) : isLogin ? (
                    <>
                      <Stack.Screen name="MainTabs" options={{animation: 'fade'}}>
                        {() => <BottomTabs activeTheme={activeTheme} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="HomeCustom"
                        component={HomeCustomScreen}
                        options={{animation: 'fade', animationDuration: 300}}
                      />
                      <Stack.Screen
                        name="EditSchedule"
                        component={EditScheduleScreen}
                        options={{animation: 'none', gestureEnabled: false}}
                      />
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
                  <Stack.Screen name="WidgetReload" component={WidgetReloadScreen} />
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
