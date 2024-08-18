import type {StackScreenProps} from '@react-navigation/stack'

export type RootStackParamList = {
  Home: undefined
  Setting: undefined
  Leave: undefined
}

export type HomeNavigationProps = StackScreenProps<RootStackParamList, 'Home'>
export type SettingNavigationProps = StackScreenProps<RootStackParamList, 'Setting'>
export type LeaveNavigationProps = StackScreenProps<RootStackParamList, 'Leave'>
// export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
// export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>

export type AppStackParamList = {
  Home: undefined
  Setting: undefined
}
