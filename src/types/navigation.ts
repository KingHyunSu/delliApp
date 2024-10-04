import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'
import {Goal} from '@/@types/goal'
import type {Options as SearchScheduleOptions} from '@/views/SearchSchedule'

export type StackNavigator = {
  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }
  EditSchedule: undefined
  CategoryStats: undefined
  GoalDetail: {id: number | null}
  EditGoal: {data: Goal | null}
  EditRoutine: {data: TodoDetail | null}
  RoutineDetail: {id: number}
  SearchSchedule: {options: SearchScheduleOptions}
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
export type GoalDetailScreenProps = StackScreenProps<StackNavigator, 'GoalDetail'>
export type EditGoalScreenProps = StackScreenProps<StackNavigator, 'EditGoal'>
export type EditRoutineScreenProps = StackScreenProps<StackNavigator, 'EditRoutine'>
export type RoutineDetailScreenProps = StackScreenProps<StackNavigator, 'RoutineDetail'>
export type SearchScheduleScreenProps = StackScreenProps<StackNavigator, 'SearchSchedule'>

export type StatsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Stats'>,
  StackScreenProps<StackNavigator>
>
// export type HomeTabProps = BottomTabScreenProps<BottomTabNavigator, 'Home'>
