import {Transaction} from 'react-native-sqlite-storage'
import {openDatabase} from '../utils/helper'
import * as scheduleQueries from '../queries/schedule'
import {GetScheduleList, GetExistScheduleList, SetSchedule, UpdateScheduleDisable} from '../types/schedule'

export const getScheduleList = async (params: GetScheduleList) => {
  const query = scheduleQueries.getScheduleListQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params])

  return result.rows.raw()
}

export const getExistScheduleList = async (params: GetExistScheduleList) => {
  const query = scheduleQueries.getExistScheduleListQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params])

  return result.rows.raw()
}

export const setSchedule = async (params: SetSchedule) => {
  const query = scheduleQueries.setScheduleQuery(params.schedule)
  const db = await openDatabase()

  await db.transaction(tx => {
    tx.executeSql(query, [params])

    if (params.disableScheduleIdList && params.disableScheduleIdList.length > 0) {
      params.disableScheduleIdList?.forEach(item => {
        updateScheduleDisable(item, tx)
      })
    }
  })
}

export const updateSchedule = async (params: SetSchedule) => {
  const query = scheduleQueries.updateScheduleQuery(params.schedule)
  const db = await openDatabase()

  await db.executeSql(query, [params])
}

export const updateScheduleDisable = async (params: UpdateScheduleDisable, tx?: Transaction) => {
  const query = scheduleQueries.updateScheduleDisableQuery(params)

  if (tx) {
    tx.executeSql(query, [params])
  } else {
    const db = await openDatabase()

    await db.executeSql(query, [params])
  }
}
