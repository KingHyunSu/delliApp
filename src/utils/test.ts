import {openDatabase} from '@/apis/local/utils/helper'
import * as scheduleApi from '@/apis/server/schedule'

const testScheduleList: EditScheduleForm[] = [
  {
    title: '아침준비',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 420,
    end_time: 480,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    title_x: 45,
    title_y: -34,
    title_rotate: 26.86081502837884,
    font_size: 16,
    background_color: '#FFF0B3',
    text_color: '#000000'
  },
  {
    title: '출근',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 480,
    end_time: 540,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#FFE0CC',
    text_color: '#000000',
    title_x: 39,
    title_y: -58,
    title_rotate: 35.48587991973799,
    font_size: 16
  },
  {
    title: '일하기 🔥',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 540,
    end_time: 1080,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#FFD1B3',
    text_color: '#000000',
    title_x: -39,
    title_y: -40,
    title_rotate: 0,
    font_size: 16
  },
  {
    title: '퇴근',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 1080,
    end_time: 1140,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#FFE0CC',
    text_color: '#000000',
    title_x: -79,
    title_y: 14,
    title_rotate: 0,
    font_size: 16
  },
  {
    title: '저녁준비',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 1140,
    end_time: 1200,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#FFF0B3',
    text_color: '#000000',
    title_x: -82,
    title_y: 23,
    title_rotate: 18.36184268435118,
    font_size: 16
  },
  {
    title: '✨ 여가시간 ✨',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 1200,
    end_time: 1380,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#B4F99E',
    text_color: '#000000',
    title_x: -76,
    title_y: 42,
    title_rotate: 46.18656199082391,
    font_size: 16
  },
  {
    title: '잠자기 💤',
    start_date: '2024-07-22',
    end_date: '9999-12-31',
    start_time: 1380,
    end_time: 420,
    mon: '1',
    thu: '1',
    wed: '1',
    tue: '1',
    fri: '1',
    sat: '1',
    sun: '1',
    background_color: '#C6A8ED',
    text_color: '#000000',
    title_x: 20,
    title_y: 43,
    title_rotate: 0,
    font_size: 16
  }
]

export const setTestData = async (date: string, scheduleList: Schedule[]) => {
  const existTestData = scheduleList.some(schedule => {
    return testScheduleList.some(testSchedule => {
      return JSON.stringify(schedule) === JSON.stringify(testSchedule)
    })
  })

  if (existTestData) {
    return
  }

  for await (const schedule of testScheduleList) {
    const params = {
      form: {...schedule, start_date: date},
      disabled_list: []
    }
    const insertId = await scheduleApi.setSchedule(params)

    // if (schedule.todo_list?.length > 0) {
    //   for await (const todo of schedule.todo_list) {
    //     if (todo.schedule_id) {
    //       await setScheduleTodo({
    //         ...todo,
    //         schedule_id: insertId
    //       })
    //     }
    //   }
    // }
  }
}

export const deleteAllScheduleData = async () => {
  const db = await openDatabase()
  await db.executeSql('DELETE FROM SCHEDULE')
  await db.executeSql('DELETE FROM TODO')
}
