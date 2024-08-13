import {openDatabase} from '../utils/helper'
import * as scheduleQueries from '../queries/schedule'
import {
  GetScheduleList,
  GetExistScheduleList,
  SetSchedule,
  UpdateScheduleDisable,
  UpdateScheduleDeleted
} from '../types/schedule'

export const getScheduleList = async (params: GetScheduleList) => {
  const query = scheduleQueries.getScheduleListQuery(params)
  const db = await openDatabase()

  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const getExistScheduleList = async (params: GetExistScheduleList) => {
  const query = scheduleQueries.getExistScheduleListQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
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
