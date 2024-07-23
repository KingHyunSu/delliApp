import {openDatabase} from '@/repository/utils/helper'
import {setSchedule} from '@/repository/modules/schedule'
import {setTodo} from '@/repository/modules/todo'

const testScheduleList: Schedule[] = [
  {
    alarm: null,
    background_color: '#FFF0B3',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 480,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 7,
    start_date: '2024-07-23',
    start_time: 420,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '아침준비',
    title_rotate: 26.86081502837884,
    title_x: 46,
    title_y: -22,
    todo_list: [
      {
        complete_date: null,
        complete_id: null,
        end_date: null,
        schedule_id: 7,
        start_date: '2024-07-23',
        title: '비타민 먹기',
        todo_id: 2
      },
      {
        complete_date: null,
        complete_id: null,
        end_date: null,
        schedule_id: 7,
        start_date: '2024-07-23',
        title: '사과 1개 먹기',
        todo_id: 1
      }
    ],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#FFE0CC',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 540,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 9,
    start_date: '2024-07-23',
    start_time: 480,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '출근',
    title_rotate: 35.48587991973799,
    title_x: 44,
    title_y: -34,
    todo_list: [
      {
        complete_date: null,
        complete_id: null,
        end_date: null,
        schedule_id: 9,
        start_date: '2024-07-23',
        title: '지하철에서 책 읽기',
        todo_id: 3
      }
    ],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#FFD1B3',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 1080,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 8,
    start_date: '2024-07-23',
    start_time: 540,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '일하기 🔥',
    title_rotate: 0,
    title_x: -39,
    title_y: -40,
    todo_list: [],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#FFE0CC',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 1140,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 10,
    start_date: '2024-07-23',
    start_time: 1080,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '퇴근',
    title_rotate: 0,
    title_x: -79,
    title_y: 14,
    todo_list: [],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#FFF0B3',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 1200,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 11,
    start_date: '2024-07-23',
    start_time: 1140,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '저녁준비',
    title_rotate: 18.36184268435118,
    title_x: -82,
    title_y: 32,
    todo_list: [],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#B4F99E',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 1380,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 12,
    start_date: '2024-07-23',
    start_time: 1200,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '✨ 여가시간 ✨',
    title_rotate: 46.18656199082391,
    title_x: -68,
    title_y: 53,
    todo_list: [],
    tue: '1',
    wed: '1'
  },
  {
    alarm: null,
    background_color: '#C6A8ED',
    disable: '0',
    end_date: '9999-12-31',
    end_time: 420,
    fri: '1',
    mon: '1',
    sat: '1',
    schedule_id: 6,
    start_date: '2024-07-23',
    start_time: 1380,
    sun: '1',
    text_color: '#000000',
    thu: '1',
    title: '잠자기 💤',
    title_rotate: 0,
    title_x: 20,
    title_y: 43,
    todo_list: [],
    tue: '1',
    wed: '1'
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
    const insertId = await setSchedule({
      schedule: {
        ...schedule,
        start_date: date
      }
    })

    if (schedule.todo_list?.length > 0) {
      for await (const todo of schedule.todo_list) {
        if (todo.schedule_id) {
          await setTodo({
            ...todo,
            schedule_id: insertId,
            date
          })
        }
      }
    }
  }
}

export const deleteAllScheduleData = async () => {
  const db = await openDatabase()
  await db.executeSql('DELETE FROM SCHEDULE')
  await db.executeSql('DELETE FROM TODO')
}
