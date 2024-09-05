import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'

export type StackNavigator = {
  MainTabs: undefined
}
export type BottomTabNavigator = {
  Home: undefined
  Setting: undefined
  Leave: undefined
}

export type HomeNavigationProps = BottomTabScreenProps<BottomTabNavigator, 'Home'>
export type SettingNavigationProps = StackScreenProps<BottomTabNavigator, 'Setting'>
export type LeaveNavigationProps = StackScreenProps<BottomTabNavigator, 'Leave'>
// export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
// export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>
