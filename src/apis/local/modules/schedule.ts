import {openDatabase} from '../utils/helper'
import * as scheduleQueries from '../queries/schedule'
import * as routineQueries from '../queries/routine'
import * as todoQueries from '../queries/todo'
import {
  GetScheduleList,
  GetExistScheduleList,
  UpdateScheduleDisable,
  UpdateScheduleDeleted,
  SetScheduleCompleteParams,
  SetScheduleFocusTimeParams,
  UpdateScheduleCompleteParams,
  UpdateScheduleFocusTimeParams
} from '../types/schedule'
import type {SearchSchedule} from '@/views/SearchSchedule'
import {GetRoutineListByScheduleResponse} from '@/apis/types/routine'
import {GetTodoListByScheduleIdResponse} from '@/apis/types/todo'

export const getScheduleList = async (params: GetScheduleList) => {
  const getScheduleListQuery = scheduleQueries.getScheduleListQuery(params)
  const getScheduleTodoByScheduleIdQuery = todoQueries.getScheduleTodoByScheduleIdQuery()
  const getRoutineListBySchedule = routineQueries.getRoutineListBySchedule()
  const db = await openDatabase()

  const result: Schedule[] = []

  await new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        getScheduleListQuery,
        [],
        (tx1, result1) => {
          const scheduleList: Schedule[] = result1.rows.raw()

          const promises = scheduleList.map(item => {
            return new Promise<Schedule>((resolve2, reject2) => {
              let todoList: GetTodoListByScheduleIdResponse[] | null = null
              let routineList: GetRoutineListByScheduleResponse[] | null = null

              tx1.executeSql(
                getScheduleTodoByScheduleIdQuery,
                [item.schedule_id],
                (tx2, result2) => {
                  todoList = result2.rows.raw()

                  handleResolve()
                },
                reject2
              )

              tx1.executeSql(
                getRoutineListBySchedule,
                [params.date, item.schedule_id],
                (tx2, result2) => {
                  routineList = result2.rows.raw().map(sItem => {
                    let completeDateList: string[] = []

                    if (sItem.complete_date_list) {
                      completeDateList = sItem.complete_date_list.split(',')
                    }

                    return {
                      ...sItem,
                      complete_date_list: completeDateList
                    }
                  })

                  handleResolve()
                },
                reject2
              )

              function handleResolve() {
                if (todoList && routineList) {
                  resolve2({
                    ...item,
                    todo_list: todoList,
                    routine_list: routineList
                  })
                }
              }
            })
          })

          Promise.all(promises)
            .then(values => {
              result.push(...values)

              resolve()
            })
            .catch(reject)
        },
        reject
      )
    })
  })

  return result
}

export const getExistScheduleList = async (params: GetExistScheduleList) => {
  const query = scheduleQueries.getExistScheduleListQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const getSearchScheduleList = async () => {
  const query = scheduleQueries.getSearchScheduleListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as SearchSchedule[]
}

export const setSchedule = async (params: Schedule) => {
  const query = scheduleQueries.setScheduleQuery(params)
  const db = await openDatabase()
  let insertId = 0

  await db.transaction(tx => {
    tx.executeSql(query, undefined, (tx2, response) => {
      insertId = response.insertId
    })
  })

  return insertId
}

export const updateSchedule = async (params: Schedule) => {
  const query = scheduleQueries.updateScheduleQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const updateScheduleDisable = async (params: UpdateScheduleDisable) => {
  const query = scheduleQueries.updateScheduleDisableQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const updateScheduleDeleted = async (params: UpdateScheduleDeleted) => {
  const query = scheduleQueries.updateScheduleDeletedQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const getBackgroundColorList = async () => {
  const query = scheduleQueries.getBackgroundColorListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const getTextColorList = async () => {
  const query = scheduleQueries.getTextColorListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const setScheduleComplete = async (params: SetScheduleCompleteParams) => {
  const query = scheduleQueries.setScheduleCompleteQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const updateScheduleComplete = async (params: UpdateScheduleCompleteParams) => {
  const query = scheduleQueries.updateScheduleCompleteQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const setScheduleFocusTime = async (params: SetScheduleFocusTimeParams) => {
  const query = scheduleQueries.setScheduleFocusTimeQuery(params)
  const db = await openDatabase()

  const [result] = await db.executeSql(query)

  return result.insertId
}

export const updateScheduleFocusTime = async (params: UpdateScheduleFocusTimeParams) => {
  const query = scheduleQueries.updateScheduleFocusTimeQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)

  return params.schedule_activity_log_id
}
