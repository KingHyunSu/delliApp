import type {CompositeScreenProps} from '@react-navigation/native'
import type {StackScreenProps} from '@react-navigation/stack'
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs'
import {LOGIN_TYPE} from '@/utils/types'

export type StackNavigator = {
  Splash: undefined
  Maintenance: undefined

  MainTabs: {
    screen: keyof BottomTabNavigator
    params?: BottomTabNavigator[keyof BottomTabNavigator]
  }
  HomeCustom: undefined
  EditSchedule: undefined
  EditRoutine: {
    scheduleId: number
    routineId: number | null
  }
  EditTodo: {
    scheduleId: number
    todoId: number | null
  }
  ScheduleComplete: EditScheduleCompleteForm
  ScheduleCompleteCardDetail: EditScheduleCompleteForm
  EditScheduleCompleteCard: EditScheduleCompleteForm
  EditScheduleCompletePhotoCard: undefined
  AttachScheduleCompleteCard: {
    schedule_complete_id: number
    schedule_complete_card_x: number
    schedule_complete_card_y: number
    schedule_complete_card_path: string | null
    schedule_complete_record: string | null
    schedule_id: number
  }
  StoreDetail: {type: 'background' | 'outline'; id: number}
  Leave: undefined

  Intro: undefined
  JoinTerms: {type: (typeof LOGIN_TYPE)[keyof typeof LOGIN_TYPE]; token: string}

  WidgetReload: undefined
  CategoryStats: undefined
}
export type BottomTabNavigator = {
  Home: undefined
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

// widget reload
export type WidgetReloadScreenProps = StackScreenProps<StackNavigator, 'WidgetReload'>

// auth
export type IntroScreenProps = StackScreenProps<StackNavigator, 'Intro'>
export type JoinTermsScreenProps = StackScreenProps<StackNavigator, 'JoinTerms'>

// app
export type HomeCustomProps = StackScreenProps<StackNavigator, 'HomeCustom'>
export type EditScheduleProps = StackScreenProps<StackNavigator, 'EditSchedule'>
export type EditRoutineScreenProps = StackScreenProps<StackNavigator, 'EditRoutine'>
export type EditTodoScreenProps = StackScreenProps<StackNavigator, 'EditTodo'>
export type ScheduleCompleteScreenProps = StackScreenProps<StackNavigator, 'ScheduleComplete'>
export type ScheduleCompleteCardDetailScreenProps = StackScreenProps<StackNavigator, 'ScheduleCompleteCardDetail'>
export type EditScheduleCompleteCardScreenProps = StackScreenProps<StackNavigator, 'EditScheduleCompleteCard'>
export type EditScheduleCompletePhotoCardScreenProps = StackScreenProps<StackNavigator, 'EditScheduleCompletePhotoCard'>
export type AttachScheduleCompleteCardScreenProps = StackScreenProps<StackNavigator, 'AttachScheduleCompleteCard'>
export type StoreDetailScreenProps = StackScreenProps<StackNavigator, 'StoreDetail'>
