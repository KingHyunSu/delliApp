import React from 'react'
import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import {Alert} from 'react-native'
import 'react-native-get-random-values'
import 'react-native-gesture-handler'
import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'

import {RecoilRoot} from 'recoil'

const RootApp = () => {
  const [isServerError, setIsServerError] = React.useState(false)

  const handleGlobalError = errorCode => {
    console.log('errorCode', errorCode)

    // if (errorCode === 500) {
    setIsServerError(true)
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

  React.useEffect(() => {
    if (isServerError) {
      Alert.alert('네트워크 연결 실패', '네트워크 연결이 지연되고 있습니다.\n잠시 후 다시 시도해주세요.', [
        {
          text: '확인',
          onPress: () => {
            setIsServerError(false)
          },
          style: 'cancel'
        }
      ])
    }
  }, [isServerError])

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  )
}

AppRegistry.registerComponent(appName, () => RootApp)
