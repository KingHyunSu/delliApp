import {openDatabase} from '../utils/helper'
import * as colorQueries from '../queries/color'
import {SetColorRequest} from '@/apis/local/types/color'

export const getColorList = async () => {
  const query = colorQueries.getColorListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as string[]
}

export const setColor = async (params: SetColorRequest) => {
  const query = colorQueries.setColorQuery()
  const db = await openDatabase()

  return await db.executeSql(query, [params.color])
}
