import {openDatabase} from '../utils/helper'
import * as StatsQueries from '../queries/stats'
import {
  GetScheduleActivityLogListParams,
  GetCategoryStatsListResponse,
  GetScheduleActivityLogListResponse
} from '../types/stats'

export const getCategoryStatsList = async () => {
  const query = StatsQueries.getCategoryStatsListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as GetCategoryStatsListResponse[]
}

export const getScheduleActivityLogList = async (params: GetScheduleActivityLogListParams) => {
  const query = StatsQueries.getScheduleActivityLogListQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as GetScheduleActivityLogListResponse[]
}
