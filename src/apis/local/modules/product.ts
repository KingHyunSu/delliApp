import {openDatabase} from '../utils/helper'
import * as productQueries from '../queries/product'
import {GetThemeRequest, SetThemeRequest} from '@/apis/local/types/product'

export const getDownloadThemeList = async () => {
  const query = productQueries.getDownloadThemeListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as ActiveTheme[]
}

export const getActiveTheme = async (params: GetThemeRequest) => {
  const query = productQueries.getActiveThemeQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.theme_id])

  return result.rows.item(0) as ActiveTheme
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
    params.main_color,
    params.sub_color,
    params.sub_color2,
    params.text_color
  ])
}
