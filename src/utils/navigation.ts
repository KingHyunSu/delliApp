import {createNavigationContainerRef} from '@react-navigation/native'
import {CommonActions} from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(name, params))
  }
}
