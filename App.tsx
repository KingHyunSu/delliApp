import React from 'react'
import {useWindowDimensions, Platform, AppState, StatusBar, StyleSheet, SafeAreaView} from 'react-native'
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
import MyThemeListScreen from '@/views/MyThemeList'
import ThemeDetailScreen from '@/views/theme/ThemeDetail'
import EditRoutineScreen from '@/views/EditRoutine'
import EditTodoScreen from '@/views/EditTodo'
import StoreListScreen from '@/views/StoreList'

import {
  RoutineList as RoutineListScreen,
  // EditRoutine as EditRoutineScreen,
  RoutineDetail as RoutineDetailScreen
} from '@/views/Routine'

import StatsScreen from '@/views/Stats'
import SearchScheduleScreen from '@/views/SearchSchedule'
import SettingScreen from '@/views/Setting'
import LeaveScreen from '@/views/Leave'
import EditScheduleScreen from '@/views/EditSchedule'
import CategoryStats from '@/views/CategoryStats'

// components
import Toast from '@/components/Toast'
import {Alert} from '@/components/messageBox'

// icons
import HomeIcon from '@/assets/icons/home.svg'
import MyIcon from '@/assets/icons/my.svg'
import ChartIcon from '@/assets/icons/chart.svg'
import RoutineIcon from '@/assets/icons/routine.svg'
import StoreIcon from '@/assets/icons/store.svg'

// stores
import {useRecoilState, useSetRecoilState, useRecoilSnapshot} from 'recoil'
import {
  loginState,
  isLunchState,
  windowDimensionsState,
  bottomSafeAreaColorState,
  activeThemeState
} from '@/store/system'

import {StackNavigator, BottomTabNavigator} from '@/types/navigation'

import initDatabase from '@/apis/local/utils/init'
import {focusModeInfoState} from '@/store/schedule'

import {useGetUser} from '@/apis/hooks/useUser'
import {useGetActiveTheme} from '@/apis/hooks/useProduct'

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3765315237132279/9003768148'

const Tab = createBottomTabNavigator<BottomTabNavigator>()
const Stack = createStackNavigator<StackNavigator>()

interface BottomTabsProps {
  activeTheme: ActiveTheme
}
const BottomTabs = React.memo(({activeTheme}: BottomTabsProps) => {
  const borderTopColor = activeTheme.theme_id === 1 ? '#D8D8D8' : activeTheme.color1

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {borderTopColor, backgroundColor: activeTheme.color5, height: 56}
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
  const {mutateAsync: getUserMutateAsync} = useGetUser()
  const {mutateAsync: getActiveThemeMutateAsync} = useGetActiveTheme()

  const windowDimensions = useWindowDimensions()

  const {isLoaded, load, show} = useAppOpenAd(adUnitId)

  const appState = React.useRef(AppState.currentState)
  const focusModeIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const [isActiveApp, setIsActiveApp] = React.useState(false)
  const [isInit, setIsInit] = React.useState(false)

  const [activeTheme, setActiveTheme] = useRecoilState(activeThemeState)
  const [focusModeInfo, setFocusModeInfo] = useRecoilState(focusModeInfoState)
  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)
  const setWindowDimensions = useSetRecoilState(windowDimensionsState)

  const [bottomSafeAreaColor, setBottomSafeAreaColor] = useRecoilState(bottomSafeAreaColorState)
  const [statusBarColor, setStatusBarColor] = React.useState('#ffffff')

  const screenOptions = React.useMemo(() => {
    return {headerShown: false}
  }, [])

  const editScheduleScreenOptions = React.useMemo(() => {
    return {animationEnabled: false}
  }, [])

  const statusBarStyle = React.useMemo(() => {
    return {
      flex: 0,
      backgroundColor: statusBarColor,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }, [statusBarColor])

  const statusBarContentStyle = React.useMemo(() => {
    return activeTheme.display_mode === 0 ? 'dark-content' : 'light-content'
  }, [activeTheme.display_mode])

  const containerStyle = React.useMemo(() => {
    return {flex: 1, backgroundColor: bottomSafeAreaColor}
  }, [bottomSafeAreaColor])

  const changeRoute = React.useCallback(() => {
    const route = navigationRef.current?.getCurrentRoute()

    let _statusBarColor = activeTheme.color1
    let _bottomSafeAreaColor: string | null = activeTheme.color5

    switch (route?.name) {
      case 'Stats':
      case 'StoreList':
        _statusBarColor = '#f5f6f8'
        break
      case 'ThemeDetail':
        _statusBarColor = '#f5f6f8'
        _bottomSafeAreaColor = '#f5f6f8'
        break
      // case 'EditSchedule':
      case 'EditGoal':
      case 'EditRoutine':
        // 화면의 useEffect 보다 늦게 실행됨...
        _bottomSafeAreaColor = null
        break
    }

    setStatusBarColor(_statusBarColor)
    if (_bottomSafeAreaColor) {
      setBottomSafeAreaColor(_bottomSafeAreaColor)
    }
  }, [activeTheme, setStatusBarColor, setBottomSafeAreaColor])

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

      const user = await getUserMutateAsync()

      const activeThemeId = user.active_theme_id || 1
      const themeDetail = await getActiveThemeMutateAsync(activeThemeId)

      setStatusBarColor(themeDetail.color1)
      setBottomSafeAreaColor(themeDetail.color5)
      setActiveTheme(themeDetail)

      setIsInit(isInitDatabase)
    }

    init()
  }, [getActiveThemeMutateAsync, getUserMutateAsync, setActiveTheme])

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
    <GestureHandlerRootView style={styles.container}>
      {/* <RecoilDebugObserver /> */}
      <BottomSheetModalProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle={statusBarContentStyle} />

        <SafeAreaView style={statusBarStyle} />

        <Toast />
        <Alert />

        <SafeAreaView style={containerStyle}>
          <NavigationContainer ref={navigationRef} linking={linking} onStateChange={changeRoute}>
            <Stack.Navigator initialRouteName="MainTabs" screenOptions={screenOptions}>
              {/*<Stack.Screen name="MainTabs" component={BottomTabs} />*/}
              <Stack.Screen name="MainTabs">{() => <BottomTabs activeTheme={activeTheme} />}</Stack.Screen>
              <Stack.Screen name="EditSchedule" component={EditScheduleScreen} options={editScheduleScreenOptions} />
              <Stack.Screen name="ThemeDetail" component={ThemeDetailScreen} />
              <Stack.Screen name="MyThemeList" component={MyThemeListScreen} />
              <Stack.Screen name="EditRoutine" component={EditRoutineScreen} />
              <Stack.Screen name="EditTodo" component={EditTodoScreen} />

              <Stack.Screen name="CategoryStats" component={CategoryStats} />
              <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
              <Stack.Screen name="SearchSchedule" component={SearchScheduleScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App
