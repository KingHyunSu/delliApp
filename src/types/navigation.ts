import type {StackScreenProps} from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Setting: undefined
  Logout: undefined
}

export type HomeNavigationProps = StackScreenProps<RootStackParamList, 'Home'>
export type SettingNavigationProps = StackScreenProps<RootStackParamList, 'Setting'>

export type AppStackParamList = {
  Home: undefined
  Setting: undefined
}
