import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import 'react-native-gesture-handler'

import {RecoilRoot} from 'recoil'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const RootApp = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
        {/*  */}
      </QueryClientProvider>
    </RecoilRoot>
  )
}

AppRegistry.registerComponent(appName, () => RootApp)
