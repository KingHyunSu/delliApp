import {Alert, NativeModules} from 'react-native'
import RNFS from 'react-native-fs'
import {format} from 'date-fns'
import * as scheduleApi from '@/apis/server/schedule'
import * as widgetApi from '@/apis/widget'
import {getDayOfWeekKey} from '@/utils/helper'
import {GetCurrentScheduleListResponse} from '@/apis/types/schedule'

type WidgetSchedule = {
  schedule_id: number | null
  title: string
  start_time: number
  end_time: number
  todo_list: ScheduleTodo[]
}
const {AppGroupModule, WidgetUpdaterModule} = NativeModules

const isWidgetReloadable = async () => {
  const response = await widgetApi.getWidgetReloadable()

  return response.data.widget_reloadable
}

const getWidgetScheduleList = (schedules: GetCurrentScheduleListResponse[]) => {
  const scheduleList = [...schedules].sort((a, b) => a.end_time - b.end_time)
  const widgetScheduleList: WidgetSchedule[] = []

  if (scheduleList?.length > 0) {
    for (let i = 0; i < scheduleList.length - 1; i++) {
      const currentSchedule = scheduleList[i]
      const nextSchedule = scheduleList[i + 1]

      // 일정 추가
      widgetScheduleList.push({
        schedule_id: currentSchedule.schedule_id,
        title: currentSchedule.title,
        start_time: currentSchedule.start_time,
        end_time: currentSchedule.end_time,
        todo_list: currentSchedule.todo_list
      })

      if (currentSchedule.end_time !== nextSchedule.start_time) {
        // 공백 일정 추가
        widgetScheduleList.push({
          schedule_id: null,
          title: '',
          start_time: currentSchedule.end_time,
          end_time: nextSchedule.start_time,
          todo_list: []
        })
      }
    }

    const firstSchedule = scheduleList[0]
    const lastSchedule = scheduleList[scheduleList.length - 1]

    // 마지막 일정 추가
    widgetScheduleList.push(lastSchedule)

    if (firstSchedule.start_time !== lastSchedule.end_time) {
      // 마지막 공백 일정 추가
      widgetScheduleList.push({
        schedule_id: null,
        title: '',
        start_time: lastSchedule.end_time,
        end_time: firstSchedule.start_time,
        todo_list: []
      })
    }
  }

  return JSON.stringify(widgetScheduleList)
}

const getScheduleList = async (date: Date) => {
  const targetDate = format(date, 'yyyy-MM-dd')
  const dayOfWeek = getDayOfWeekKey(date.getDay())

  const params = {
    date: targetDate,
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
    disable: '0'
  }

  if (dayOfWeek) {
    params[dayOfWeek] = '1'
  }

  const response = await scheduleApi.getCurrentScheduleList(params)

  return response.data
}

const handleWidgetUpdate = async () => {
  const date = new Date()
  const newScheduleList = await getScheduleList(date)
  const widgetScheduleList = getWidgetScheduleList(newScheduleList)

  const dateString = format(date, "yyyy-MM-dd'T'HH:mm:ssX")

  WidgetUpdaterModule.updateWidget(widgetScheduleList, dateString)
}

export const updateWidget = async () => {
  const widgetReloadable = await isWidgetReloadable()

  if (widgetReloadable) {
    await handleWidgetUpdate()
  }
}

export const updateWidgetWithImage = async (imageUri: string) => {
  if (!imageUri || !AppGroupModule) {
    Alert.alert('위젯 업데이트 실패', '잠시 후 다시 시도해 주세요.', [
      {
        text: '확인'
      }
    ])

    return
  }

  // const widgetReloadable = await isWidgetReloadable()
  //
  // if (!widgetReloadable) {
  //   return
  // }

  // 이미지 이동
  const fileName = 'timetable.png'
  const appGroupPath = await AppGroupModule.getAppGroupPath()
  const filePath = appGroupPath + '/' + fileName
  const existImage = await RNFS.exists(filePath)

  if (existImage) {
    await RNFS.unlink(filePath)
  }
  await RNFS.moveFile(imageUri, filePath)

  await handleWidgetUpdate()
}
