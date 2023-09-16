import React from 'react'
import {SafeAreaView} from 'react-native'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// components
import Login from '@/views/Login'
import Home from '@/views/Home'

// utils
import {RecoilRoot} from 'recoil'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useSetRecoilState} from 'recoil'
import {isLoginState} from '@/store/user'

import * as authApi from '@/apis/auth'
function App(): JSX.Element {
  const setLoginState = useSetRecoilState(isLoginState)
  const Stack = createStackNavigator()

  React.useEffect(() => {
    // const handleEnter = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem('token')
    //     console.log('token', token)
    //     if (token) {
    //       await authApi.login()
    //     } else {
    //       const result = await authApi.join()
    //       const newToken = result.data.token
    //       await AsyncStorage.setItem('token', newToken)
    //     }
    //   } catch (e) {
    //     console.log('e', e)
    //   }
    // }
    // handleEnter()
  }, [])

  React.useEffect(() => {
    const handleEnter = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          setLoginState(true)
        }
      } catch (e) {
        console.error(e)
      }
    }

    handleEnter()
  }, [setLoginState])

  return (
    <RecoilRoot>
      <SafeAreaView style={{flex: 1}}>
        {/* <GestureHandlerRootView style={{flex: 1}}> */}
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Group>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Login" component={Login} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
        {/* </GestureHandlerRootView> */}
      </SafeAreaView>
    </RecoilRoot>
  )
}

export default App
