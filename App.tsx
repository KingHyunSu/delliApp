import React from 'react'
import {StyleSheet, SafeAreaView, Text} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// components
import LoginScreen from '@/views/Login'
import HomeScreen from '@/views/Home'
import SettingScreen from '@/views/Setting'

// utils
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useRecoilState} from 'recoil'
import {loginState} from '@/store/system'

import {useQuery} from '@tanstack/react-query'

import {RootStackParamList} from '@/types/navigation'

function App(): JSX.Element {
  const [isLogin, setIsLogin] = useRecoilState(loginState)
  const Stack = createStackNavigator<RootStackParamList>()

  const {isLoading} = useQuery({
    queryKey: ['token'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token')

      if (token) {
        setIsLogin(true)
      }

      return token
    }
  })

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

  if (isLoading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>test</Text>
      </SafeAreaView>
    )
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
              {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
              {isLogin ? (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Setting" component={SettingScreen} />
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
