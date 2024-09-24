import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'

export type StackNavigator = {
  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }
  EditSchedule: undefined
  CategoryStats: undefined
  EditGoal: {id: number | null}
  SearchEditGoalSchedule: undefined
}
export type BottomTabNavigator = {
  Home: {scheduleUpdated: boolean}
  Sprout: undefined
  Setting: undefined
}

export type SettingNavigationProps = StackScreenProps<BottomTabNavigator, 'Setting'>
// export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
// export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Home'>,
  StackScreenProps<StackNavigator>
>
export type SproutNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Sprout'>,
  StackScreenProps<StackNavigator>
>

export type EditScheduleProps = StackScreenProps<StackNavigator, 'EditSchedule'>
export type EditGoalScreenProps = StackScreenProps<StackNavigator, 'EditGoal'>
export type SearchEditGoalScheduleScreenProps = StackScreenProps<StackNavigator, 'SearchEditGoalSchedule'>

export type StatsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Stats'>,
  StackScreenProps<StackNavigator>
>
// export type HomeTabProps = BottomTabScreenProps<BottomTabNavigator, 'Home'>
