import React from 'react'
import {useWindowDimensions, Platform, AppState, StatusBar, SafeAreaView, Alert} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SplashScreen from 'react-native-splash-screen'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions'
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads'
import {QueryClient, QueryCache, QueryClientProvider} from '@tanstack/react-query'
// import crashlytics from '@react-native-firebase/crashlytics'

// navigations
import {NavigationContainer, LinkingOptions} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {navigationRef} from '@/utils/navigation'

// views
import HomeScreen from '@/views/Home'
import SettingScreen from '@/views/Setting'
import LeaveScreen from '@/views/Leave'

// components
import Toast from '@/components/Toast'

// icons
import HomeIcon from '@/assets/icons/home.svg'
import MyIcon from '@/assets/icons/my.svg'
import ChartIcon from '@/assets/icons/chart.svg'

// stores
import {useRecoilState, useSetRecoilState, useRecoilSnapshot} from 'recoil'
import {loginState, isLunchState, windowDimensionsState} from '@/store/system'

import {StackNavigator, BottomTabNavigator} from '@/types/navigation'

import initDatabase from '@/repository/utils/init'

const adUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3765315237132279/9003768148'

const Tab = createBottomTabNavigator<BottomTabNavigator>()
const Stack = createStackNavigator<StackNavigator>()

const BottomTabs = React.memo(() => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {height: 48}}} // 탭의 상단 바 제거
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <HomeIcon fill={focused ? '#424242' : '#babfc5'} />
          }
        }}
      />
      <Tab.Screen
        name="Leave"
        component={LeaveScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <ChartIcon fill={focused ? '#424242' : '#babfc5'} />
          }
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <MyIcon fill={focused ? '#424242' : '#babfc5'} />
          }
        }}
      />
    </Tab.Navigator>
  )
})

function App(): JSX.Element {
  const windowDimensions = useWindowDimensions()

  const {isLoaded, load, show} = useAppOpenAd(adUnitId)

  const appState = React.useRef(AppState.currentState)

  const [isActiveApp, setIsActiveApp] = React.useState(false)
  const [isInit, setIsInit] = React.useState(false)
  const [isServerError, setIsServerError] = React.useState(false)

  const setWindowDimensions = useSetRecoilState(windowDimensionsState)
  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)

  const linking: LinkingOptions<BottomTabNavigator> = {
    prefixes: ['delli://'],
    config: {
      screens: {
        Home: 'widget/reload'
      }
    }
  }

  const screenOptions = React.useMemo(() => {
    return {headerShown: false}
  }, [])

  const statusBarStyle = React.useMemo(() => {
    return {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }, [])

  const handleGlobalError = errorCode => {
    setIsLunch(true)

    // 2024-05-18 서버 제거로인해 비활성화
    // if (errorCode === 500) {
    //   setIsServerError(true)
    // }
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: handleGlobalError
      },
      queries: {
        retry: false
      }
    },
    queryCache: new QueryCache({
      onError: handleGlobalError
    })
  })

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

  // React.useEffect(() => {
  //   if (isServerError) {
  //     Alert.alert('네트워크 연결 실패', '네트워크 연결이 지연되고 있습니다.\n잠시 후 다시 시도해주세요.', [
  //       {
  //         text: '확인',
  //         onPress: () => {
  //           setIsServerError(false)
  //         },
  //         style: 'cancel'
  //       }
  //     ])
  //   }
  // }, [isServerError])

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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        {/* <RecoilDebugObserver /> */}
        <BottomSheetModalProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

          <SafeAreaView style={statusBarStyle}>
            <Toast />

            <NavigationContainer ref={navigationRef} linking={linking}>
              <Stack.Navigator initialRouteName="MainTabs" screenOptions={{headerShown: false}}>
                <Stack.Screen name="MainTabs" component={BottomTabs} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App
