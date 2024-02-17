import React, {useEffect} from 'react'
import {StyleSheet, SafeAreaView} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import SplashScreen from 'react-native-splash-screen'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {navigationRef} from '@/utils/navigation'

// components
import LoginScreen from '@/views/Login'
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
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads'

function App(): JSX.Element {
  const {isLoaded, isClosed, load, show} = useAppOpenAd(TestIds.APP_OPEN)

  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const [isLunch, setIsLunch] = useRecoilState(isLunchState)
  const Stack = createStackNavigator<RootStackParamList>()

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const setToken = async () => {
      const token = await AsyncStorage.getItem('token')

      if (token) {
        setIsLogin(true)
      } else {
        setIsLunch(true)
      }
    }

    if (isLoaded) {
      show()

      setToken()
    }
  }, [isLoaded, show])

  // React.useEffect(() => {
  //   const setToken = async () => {
  //     const token = await AsyncStorage.getItem('token')

  //     if (token) {
  //       setIsLogin(true)
  //     } else {
  //       setIsLunch(true)
  //     }
  //   }

  //   setToken()
  // }, [])

  React.useEffect(() => {
    if (isLunch) {
      SplashScreen.hide()
    }
  }, [isLunch])

  React.useEffect(() => {
    const reset = async () => {
      try {
        await AsyncStorage.setItem('token', '')
      } catch (e) {
        console.error('e', e)
      }
    }

    // reset()
  }, [])

  // recoil debug
  function RecoilDebugObserver(): React.ReactNode {
    const recoilSnapshot = useRecoilSnapshot()
    useEffect(() => {
      for (const node of recoilSnapshot.getNodes_UNSTABLE({isModified: true})) {
        // console.debug(node.key, recoilSnapshot.getLoadable(node))
        console.debug('recoil update : ', node.key)
      }
    }, [recoilSnapshot])

    return null
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RecoilDebugObserver />
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
              {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
              {isLogin ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Setting" component={SettingScreen} />
                  <Stack.Screen name="Logout" component={LogoutScreen} />
                </>
              ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
export default App
