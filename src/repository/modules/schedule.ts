import {openDatabase} from '../utils/helper'
import * as scheduleQueries from '../queries/schedule'
import * as todoQueries from '../queries/todo'
import {
  GetScheduleList,
  GetExistScheduleList,
  SetSchedule,
  UpdateScheduleDisable,
  UpdateScheduleDeleted,
  SetScheduleCompleteParams,
  SetScheduleFocusTimeParams,
  UpdateScheduleCompleteParams,
  UpdateScheduleFocusTimeParams
} from '../types/schedule'
import type {SearchSchedule} from '@/views/SearchSchedule'

export const getScheduleList = async (params: GetScheduleList) => {
  const getScheduleListQuery = scheduleQueries.getScheduleListQuery(params)
  const getTodoByScheduleQuery = todoQueries.getTodoByScheduleQuery()
  const db = await openDatabase()

  const result: Schedule[] = []

  // await db.transaction(tx => {
  //   tx.executeSql(getScheduleListQuery, [], (tx1, result1) => {
  //     const scheduleList: Schedule[] = result1.rows.raw()
  //     scheduleList.forEach(item => {
  //       // console.log('item', item)
  //       tx1.executeSql(getTodoByScheduleQuery, [item.schedule_id], (tx2, result2) => {
  //         console.log('result2.rows.raw()', result2.rows.raw())
  //         result.push({
  //           ...item,
  //           todo_list: result2.rows.raw()
  //         })
  //       })
  //     })
  //   })
  // })

  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        getScheduleListQuery,
        [],
        (tx1, result1) => {
          const scheduleList: Schedule[] = result1.rows.raw()

          const promises = scheduleList.map(item => {
            return new Promise((resolve, reject) => {
              tx1.executeSql(
                getTodoByScheduleQuery,
                [item.schedule_id],
                (tx2, result2) => {
                  console.log('result2.rows.raw()', result2.rows.raw())
                  resolve({
                    ...item,
                    todo_list: result2.rows.raw()
                  })
                },
                reject
              )
            })
          })

          // 모든 스케줄에 대한 todo 쿼리가 완료되면 result에 값을 추가하고 resolve 호출
          Promise.all(promises)
            .then(values => {
              console.log('values', values)
              result.push(...values)
              resolve()
            })
            .catch(reject)
        },
        reject
      )
    })
  })

  console.log('result', result)
  // const [result] = await db.executeSql(getScheduleListQuery)
  // const scheduleList = result.rows.raw()
  //
  // return result.rows.raw()

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

export const setSchedule = async (params: SetSchedule) => {
  const query = scheduleQueries.setScheduleQuery(params.schedule)
  const db = await openDatabase()
  let insertId = 0

  await db.transaction(tx => {
    tx.executeSql(query, undefined, (tx2, response) => {
      insertId = response.insertId
    })
  })

  return insertId
}

export const updateSchedule = async (params: SetSchedule) => {
  const query = scheduleQueries.updateScheduleQuery(params.schedule)
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

  await db.executeSql(query)
}

export const updateScheduleFocusTime = async (params: UpdateScheduleFocusTimeParams) => {
  const query = scheduleQueries.updateScheduleFocusTimeQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}
