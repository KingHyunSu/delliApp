import React from 'react'
import {Alert, NativeModules} from 'react-native'
import RNFS from 'react-native-fs'
import {userRepository} from '@/repository'
import * as widgetApi from '@/apis/widget'
import {getScheduleList} from '@/utils/schedule'
import type {TimetableRefs} from '@/components/TimeTable'

type WidgetSchedule = {
  schedule_id: number | null
  title: string
  start_time: number
  end_time: number
  todo_list: Todo[]
}
const {AppGroupModule, WidgetUpdaterModule} = NativeModules

const isWidgetReloadable = async () => {
  const [user] = await userRepository.getUser()
  const params = {id: user.user_id}

  const response = await widgetApi.getWidgetReloadable(params)

  return response.data.widget_reloadable
}

const getWidgetScheduleList = (schedules: Schedule[]) => {
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

const handleWidgetUpdate = async () => {
  const newScheduleList = await getScheduleList(new Date())
  const widgetScheduleList = getWidgetScheduleList(newScheduleList)

  WidgetUpdaterModule.updateWidget(widgetScheduleList)
}

export const updateWidget = async () => {
  const widgetReloadable = await isWidgetReloadable()

  if (!widgetReloadable) {
    return
  }

  await handleWidgetUpdate()
}

export const updateWidgetWithImage = async (timetableRefs: React.RefObject<TimetableRefs>) => {
  if (!timetableRefs.current) {
    Alert.alert('에러', '잠시 후 다시 시도해 주세요.', [
      {
        text: '확인'
      }
    ])

    return
  }

  const widgetReloadable = await isWidgetReloadable()

  if (!widgetReloadable) {
    return
  }

  // 이미지 생성 및 이동
  const imageUri = await timetableRefs.current.getImage()
  const fileName = 'timetable.png'
  const appGroupPath = await AppGroupModule.getAppGroupPath()
  const path = appGroupPath + '/' + fileName
  const existImage = await RNFS.exists(path)

  if (existImage) {
    await RNFS.unlink(path)
  }
  await RNFS.moveFile(imageUri, path)

  await handleWidgetUpdate()
}
