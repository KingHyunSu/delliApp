import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'

export type StackNavigator = {
  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }
  EditSchedule: undefined
}
export type BottomTabNavigator = {
  Home: {scheduleUpdated: boolean}
  Stats: undefined
  Setting: undefined
}

export type SettingNavigationProps = StackScreenProps<BottomTabNavigator, 'Setting'>
export type StatsNavigationProps = StackScreenProps<BottomTabNavigator, 'Stats'>
// export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
// export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Home'>,
  StackScreenProps<StackNavigator>
>
export type EditScheduleProps = StackScreenProps<StackNavigator, 'EditSchedule'>

// export type HomeTabProps = BottomTabScreenProps<BottomTabNavigator, 'Home'>
