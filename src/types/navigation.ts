import type {StackScreenProps} from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  JoinTerms: {token: string}
  Home: undefined
  Setting: undefined
  Logout: undefined
}

export type HomeNavigationProps = StackScreenProps<RootStackParamList, 'Home'>
export type SettingNavigationProps = StackScreenProps<RootStackParamList, 'Setting'>
export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>

export type AppStackParamList = {
  Home: undefined
  Setting: undefined
}
