import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'
import {LOGIN_TYPE} from '@/utils/types'

export type StackNavigator = {
  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }

  Intro: undefined
  JoinTerms: {type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE]; token: string}

  EditSchedule: undefined
  EditRoutine: {
    scheduleId: number
    routineId: number | null
  }
  EditTodo: {
    scheduleId: number
    todoId: number | null
  }
  StoreDetail: {type: 'background' | 'outline'; id: number}

  HomeCustom: undefined

  CategoryStats: undefined

  Leave: undefined
}
export type BottomTabNavigator = {
  Home: {scheduleUpdated: boolean}
  StoreList: undefined
  Setting: undefined
}

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Home'>,
  StackScreenProps<StackNavigator>
>
export type StoreListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'StoreList'>,
  StackScreenProps<StackNavigator>
>
export type SettingScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigator, 'Setting'>,
  StackScreenProps<StackNavigator>
>

// auth
export type IntroScreenProps = StackScreenProps<StackNavigator, 'Intro'>
export type JoinTermsScreenProps = StackScreenProps<StackNavigator, 'JoinTerms'>

export type HomeCustomProps = StackScreenProps<StackNavigator, 'HomeCustom'>
export type StoreDetailScreenProps = StackScreenProps<StackNavigator, 'StoreDetail'>

export type EditScheduleProps = StackScreenProps<StackNavigator, 'EditSchedule'>
export type EditRoutineScreenProps = StackScreenProps<StackNavigator, 'EditRoutine'>
export type EditTodoScreenProps = StackScreenProps<StackNavigator, 'EditTodo'>
