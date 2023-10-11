import React from 'react'
import {SafeAreaView} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// components
import Login from '@/views/Login'
import Home from '@/views/Home'

// utils
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useSetRecoilState} from 'recoil'
import {isLoginState} from '@/store/user'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

function App(): JSX.Element {
  const setLoginState = useSetRecoilState(isLoginState)
  const Stack = createStackNavigator()

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

  React.useEffect(() => {
    const handleEnter = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        console.log('token', token)
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <SafeAreaView style={{flex: 1}}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Group>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Login" component={Login} />
                </Stack.Group>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App
