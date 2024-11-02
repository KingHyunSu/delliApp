import {openDatabase} from '../utils/helper'
import * as colorQueries from '../queries/color'
import {DeleteColorRequest, SetColorRequest} from '@/apis/local/types/color'

export const getColorList = async () => {
  const query = colorQueries.getColorListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw() as Color[]
}

export const setColor = async (params: SetColorRequest) => {
  const query = colorQueries.setColorQuery()
  const db = await openDatabase()

  return await db.executeSql(query, [params.color])
}

export const deleteColor = async (params: DeleteColorRequest) => {
  const query = colorQueries.deleteColorQuery()
  const db = await openDatabase()

  return await db.executeSql(query, [params.color_id])
}
