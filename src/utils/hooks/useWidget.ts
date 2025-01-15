import {Alert, NativeModules} from 'react-native'
import RNFS from 'react-native-fs'
import {format} from 'date-fns'
import {GetCurrentScheduleListResponse} from '@/apis/types/schedule'
import {useRecoilValue} from 'recoil'
import {activeBackgroundState, activeOutlineState, widgetReloadableState} from '@/store/system'
import {scheduleListState} from '@/store/schedule'

interface WidgetSchedule {
  schedule_id: number | null
  title: string
  start_time: number
  end_time: number
  todo_list: ScheduleTodo[]
  widget_update_date: string
}
interface WidgetStyle {
  outline_background_color: string
  outline_progress_color: string
  background_color: string
  text_color: string
}
const {AppGroupModule, WidgetUpdaterModule} = NativeModules

const getWidgetUpdateDate = (startTime: number) => {
  const now = new Date()
  const hours = Math.floor(startTime / 60)
  const minutes = startTime % 60

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

  return format(date, "yyyy-MM-dd'T'HH:mm:ssX")
}

const getWidgetScheduleList = (schedules: GetCurrentScheduleListResponse[]) => {
  const scheduleList = [...schedules].sort((a, b) => {
    if (a.start_time === b.start_time) {
      return a.end_time - b.end_time
    }
    return a.start_time - b.start_time
  })
  const widgetScheduleList: WidgetSchedule[] = []

  if (scheduleList?.length > 0) {
    let prevWidgetSchedule: WidgetSchedule | null = null

    for (let i = 0; i < scheduleList.length; i++) {
      const currentSchedule = scheduleList[i]
      let blankWidgetSchedule: WidgetSchedule | null = null
      let overlaySchedule: WidgetSchedule | null = null
      const widgetSchedule = {
        schedule_id: currentSchedule.schedule_id,
        title: currentSchedule.title,
        start_time: currentSchedule.start_time,
        end_time: currentSchedule.end_time,
        todo_list: [],
        widget_update_date: getWidgetUpdateDate(currentSchedule.start_time)
      }

      if (prevWidgetSchedule && prevWidgetSchedule.end_time < currentSchedule.start_time) {
        blankWidgetSchedule = {
          schedule_id: null,
          title: '',
          start_time: prevWidgetSchedule.end_time,
          end_time: currentSchedule.start_time,
          todo_list: [],
          widget_update_date: getWidgetUpdateDate(prevWidgetSchedule.end_time)
        }
      }

      if (
        prevWidgetSchedule &&
        prevWidgetSchedule.start_time <= currentSchedule.start_time &&
        prevWidgetSchedule.end_time >= currentSchedule.end_time &&
        currentSchedule.start_time < currentSchedule.end_time
      ) {
        overlaySchedule = {
          schedule_id: prevWidgetSchedule.schedule_id,
          title: prevWidgetSchedule.title,
          start_time: prevWidgetSchedule.start_time,
          end_time: prevWidgetSchedule.end_time,
          todo_list: [],
          widget_update_date: getWidgetUpdateDate(currentSchedule.end_time)
        }
      }

      // 공백 일정 추가
      if (blankWidgetSchedule) {
        widgetScheduleList.push(blankWidgetSchedule)
      }
      // 현재 일정 추가
      widgetScheduleList.push(widgetSchedule)
      // 겹치는 일정 추가
      if (overlaySchedule) {
        widgetScheduleList.push(overlaySchedule)
        prevWidgetSchedule = overlaySchedule
      } else {
        prevWidgetSchedule = widgetSchedule
      }
    }

    const firstSchedule = scheduleList[0]
    const lastSchedule = scheduleList[scheduleList.length - 1]

    // 일정 시작 시간이 0시 이전이고 종료 시간이 0시 이후일때 첫번째 일정으로 추가
    if (firstSchedule.schedule_id !== lastSchedule.schedule_id && lastSchedule.start_time > lastSchedule.end_time) {
      widgetScheduleList.unshift({
        schedule_id: lastSchedule.schedule_id,
        title: lastSchedule.title,
        start_time: lastSchedule.start_time,
        end_time: lastSchedule.end_time,
        todo_list: [],
        widget_update_date: getWidgetUpdateDate(0)
      })
    }

    // 마지막 공백 일정 추가
    if (firstSchedule.schedule_id !== lastSchedule.schedule_id && firstSchedule.start_time !== lastSchedule.end_time) {
      const sortedScheduleList = [...schedules].sort((a, b) => a.end_time - b.end_time)
      const endSchedule = sortedScheduleList.pop()

      if (endSchedule) {
        widgetScheduleList.push({
          schedule_id: null,
          title: '',
          start_time: endSchedule.end_time,
          end_time: 1440, // 0시
          todo_list: [],
          widget_update_date: getWidgetUpdateDate(endSchedule.end_time)
        })
      }
    }
  }

  return JSON.stringify(widgetScheduleList)
}

const handleWidgetUpdate = async (scheduleList: Schedule[], style: WidgetStyle) => {
  const date = new Date()
  const widgetScheduleList = getWidgetScheduleList(scheduleList)
  const styleJsonString = JSON.stringify(style)
  const dateString = format(date, "yyyy-MM-dd'T'HH:mm:ssX")

  WidgetUpdaterModule.updateWidget(widgetScheduleList, styleJsonString, dateString)
}

export const useUpdateWidgetStyle = () => {
  const widgetReloadable = useRecoilValue(widgetReloadableState)
  const scheduleList = useRecoilValue(scheduleListState)

  return async (style: WidgetStyle) => {
    if (!widgetReloadable) {
      return
    }

    if (!AppGroupModule) {
      Alert.alert('위젯 업데이트 실패', '잠시 후 다시 시도해 주세요.', [
        {
          text: '확인'
        }
      ])

      return
    }

    await handleWidgetUpdate(scheduleList, style)
  }
}

export const useUpdateWidgetWithImage = () => {
  const activeBackground = useRecoilValue(activeBackgroundState)
  const activeOutline = useRecoilValue(activeOutlineState)
  const widgetStyle = {
    outline_background_color: activeOutline.background_color,
    outline_progress_color: activeOutline.progress_color,
    background_color: activeBackground.background_color,
    text_color: activeBackground.accent_color
  }

  return async (scheduleList: Schedule[], imageUri: string) => {
    if (!imageUri || !AppGroupModule) {
      Alert.alert('위젯 업데이트 실패', '잠시 후 다시 시도해 주세요.', [
        {
          text: '확인'
        }
      ])

      return
    }

    // 이미지 이동
    const fileName = 'timetable.png'
    const appGroupPath = await AppGroupModule.getAppGroupPath()
    const filePath = appGroupPath + '/' + fileName
    const existImage = await RNFS.exists(filePath)

    if (existImage) {
      await RNFS.unlink(filePath)
    }
    await RNFS.moveFile(imageUri, filePath)

    await handleWidgetUpdate(scheduleList, widgetStyle)
  }
}
