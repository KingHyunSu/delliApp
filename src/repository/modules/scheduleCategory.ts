import {openDatabase} from '../utils/helper'
import * as scheduleQueries from '../queries/schedule'
import * as scheduleCategoryQueries from '../queries/scheduleCategory'
import {DeleteScheduleCategory, SetScheduleCategory, UpdateScheduleCategory} from '@/repository/types/scheduleCategory'

export const getLastScheduleCategorySeq = async () => {
  const query = scheduleCategoryQueries.getLastScheduleCategorySeqQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const getScheduleCategoryList = async (): Promise<ScheduleCategory[]> => {
  const query = scheduleCategoryQueries.getScheduleCategoryListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const setScheduleCategory = async (params: SetScheduleCategory) => {
  const query = scheduleCategoryQueries.setScheduleCategoryQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.insertId
}

export const updateScheduleCategory = async (params: UpdateScheduleCategory) => {
  const query = scheduleCategoryQueries.updateScheduleCategoryQuery(params)
  const db = await openDatabase()
  await db.executeSql(query)
}

export const deleteScheduleCategory = async (params: DeleteScheduleCategory) => {
  const deleteScheduleCategoryQuery = scheduleCategoryQueries.deleteScheduleCategoryQuery(params)
  const updateScheduleCategoryQuery = scheduleQueries.updateScheduleCategory(params)
  const db = await openDatabase()

  await db.transaction(tx => {
    tx.executeSql(deleteScheduleCategoryQuery)
    tx.executeSql(updateScheduleCategoryQuery)
  })
}

export const setDefaultScheduleCategory = async () => {
  const query = scheduleCategoryQueries.setDefaultScheduleCategoryQuery()
  const db = await openDatabase()

  await db.executeSql(query)
}
