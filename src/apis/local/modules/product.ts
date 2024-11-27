import {openDatabase} from '../utils/helper'
import * as productQueries from '../queries/product'
import {
  GetActiveBackgroundRequest,
  GetActiveBackgroundResponse,
  GetDownloadedBackgroundListResponse,
  SetDownloadBackgroundRequest
} from '@/apis/types/product'

export const setDefaultBackground = async () => {
  const query = productQueries.setDefaultBackgroundQuery()
  const db = await openDatabase()

  return await db.executeSql(query)
}

export const getDownloadedBackgroundList = async () => {
  const query = productQueries.getDownloadedBackgroundListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as GetDownloadedBackgroundListResponse[]
}

export const setDownloadBackground = async (params: SetDownloadBackgroundRequest) => {
  const query = productQueries.setDownloadBackgroundQuery()
  const db = await openDatabase()

  return await db.executeSql(query, [
    params.background_id,
    params.file_name,
    params.display_mode,
    params.background_color,
    params.sub_color,
    params.accent_color
  ])
}

export const getActiveBackground = async (params: GetActiveBackgroundRequest) => {
  const query = productQueries.getActiveBackgroundQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.background_id])

  return result.rows.item(0) as GetActiveBackgroundResponse
}
