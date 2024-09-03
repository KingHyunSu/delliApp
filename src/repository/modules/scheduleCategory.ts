import {openDatabase} from '../utils/helper'
import * as scheduleCategoryQueries from '../queries/scheduleCategory'
import {SetScheduleCategory} from '@/repository/types/scheduleCategory'

export const getScheduleCategoryListQuery = async () => {
  const query = scheduleCategoryQueries.getScheduleCategoryListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const setScheduleCategoryQuery = async (params: SetScheduleCategory) => {
  const query = scheduleCategoryQueries.setScheduleCategory(params)
  const db = await openDatabase()

  await db.executeSql(query)
}
