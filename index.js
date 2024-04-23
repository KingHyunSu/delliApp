import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import 'react-native-gesture-handler'

import {RecoilRoot} from 'recoil'

const RootApp = () => {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
}

AppRegistry.registerComponent(appName, () => RootApp)
