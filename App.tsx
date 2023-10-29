import React from 'react'
import {StyleSheet, SafeAreaView, View, Text} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

// navigations
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

// components
import Login from '@/views/Login'
import Home from '@/views/Home'
import Setting from '@/views/Setting'

// utils
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useMutation} from '@tanstack/react-query'

import {RootStackParamList} from '@/types/navigation'

function App(): JSX.Element {
  const Stack = createStackNavigator<RootStackParamList>()

  const {
    isPending,
    data: token,
    mutate
  } = useMutation({
    mutationFn: async () => {
      return await AsyncStorage.getItem('token')
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

  React.useEffect(() => {
    mutate()
  }, [mutate])

  if (isPending) {
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
              {token ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Setting" component={Setting} />
                </>
              ) : (
                <Stack.Screen name="Login" component={Login} />
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
