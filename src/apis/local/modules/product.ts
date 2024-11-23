import {openDatabase} from '../utils/helper'
import * as productQueries from '../queries/product'
import {GetActiveThemeRequest, GetActiveThemeResponse, SetThemeRequest} from '@/apis/types/product'

export const getDownloadThemeList = async () => {
  const query = productQueries.getDownloadThemeListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as GetActiveThemeResponse[]
}

export const getActiveTheme = async (params: GetActiveThemeRequest) => {
  const query = productQueries.getActiveThemeQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.theme_id])

  return result.rows.item(0) as GetActiveThemeResponse
}

export const setDefaultTheme = async () => {
  const query = productQueries.setDefaultThemeQuery()
  const db = await openDatabase()

  return await db.executeSql(query)
}

export const setTheme = async (params: SetThemeRequest) => {
  const query = productQueries.setThemeQuery()
  const db = await openDatabase()

  return await db.executeSql(query, [
    params.theme_id,
    params.file_name,
    params.color1,
    params.color2,
    params.color3,
    params.color4,
    params.color5,
    params.color6,
    params.color7,
    params.color8,
    params.display_mode
  ])
}
