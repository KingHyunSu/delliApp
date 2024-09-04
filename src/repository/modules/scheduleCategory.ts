import {openDatabase} from '../utils/helper'
import * as scheduleCategoryQueries from '../queries/scheduleCategory'
import {DeleteScheduleCategory, SetScheduleCategory, UpdateScheduleCategory} from '@/repository/types/scheduleCategory'

export const getScheduleCategoryListQuery = async (): Promise<ScheduleCategory[]> => {
  const query = scheduleCategoryQueries.getScheduleCategoryListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const setScheduleCategoryQuery = async (params: SetScheduleCategory) => {
  const query = scheduleCategoryQueries.setScheduleCategoryQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.insertId
}

export const updateScheduleCategoryQuery = async (params: UpdateScheduleCategory) => {
  const query = scheduleCategoryQueries.updateScheduleCategoryQuery(params)
  const db = await openDatabase()
  await db.executeSql(query)
}

export const deleteScheduleCategoryQuery = async (params: DeleteScheduleCategory) => {
  const query = scheduleCategoryQueries.deleteScheduleCategoryQuery(params)
  const db = await openDatabase()

  await db.executeSql(query)
}

export const setDefaultScheduleCategoryQuery = async () => {
  const query = scheduleCategoryQueries.setDefaultScheduleCategoryQuery()
  const db = await openDatabase()

  await db.executeSql(query)
}
