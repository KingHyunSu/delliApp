import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'
import type {Options as SearchScheduleOptions} from '@/views/SearchSchedule'

export type StackNavigator = {
  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }
  EditSchedule: undefined
  EditRoutine: {
    scheduleId: number
    routineId: number | null
  }
  EditTodo: {
    scheduleId: number
    todoId: number | null
  }

  ThemeDetail: {id: number}
  MyThemeList: undefined

  RoutineDetail: {id: number}

  CategoryStats: undefined
  SearchSchedule: {options: SearchScheduleOptions}
}
export type BottomTabNavigator = {
  Home: {scheduleUpdated: boolean}
  Routine: undefined
  StoreList: undefined
  Setting: undefined
}

export type SettingNavigationProps = StackScreenProps<BottomTabNavigator, 'Setting'>
// export type LoginNavigationProps = StackScreenProps<RootStackParamList, 'Login'>
// export type JoinTermsNavigationProps = StackScreenProps<RootStackParamList, 'JoinTerms'>

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Home'>,
  StackScreenProps<StackNavigator>
>
export type StoreListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'StoreList'>,
  StackScreenProps<StackNavigator>
>
export type RoutineScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Routine'>,
  StackScreenProps<StackNavigator>
>

export type EditScheduleProps = StackScreenProps<StackNavigator, 'EditSchedule'>
export type MyThemeListProps = StackScreenProps<StackNavigator, 'MyThemeList'>
export type ThemeDetailScreenProps = StackScreenProps<StackNavigator, 'ThemeDetail'>

export type EditRoutineScreenProps = StackScreenProps<StackNavigator, 'EditRoutine'>
export type EditTodoScreenProps = StackScreenProps<StackNavigator, 'EditTodo'>

export type RoutineDetailScreenProps = StackScreenProps<StackNavigator, 'RoutineDetail'>

export type SearchScheduleScreenProps = StackScreenProps<StackNavigator, 'SearchSchedule'>
