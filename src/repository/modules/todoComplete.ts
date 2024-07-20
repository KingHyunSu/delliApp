import {openDatabase} from '../utils/helper'
import {SetScheduleTodoComplete, DeleteScheduleTodoComplete} from '../types/todoComplete'
import * as todoCompleteQueries from '../queries/todoComplete'

export const setScheduleTodoCompleteQuery = async (params: SetScheduleTodoComplete) => {
  const query = todoCompleteQueries.setScheduleTodoCompleteQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return {complete_id: result.insertId}
}

export const deleteScheduleTodoCompleteQuery = async (params: DeleteScheduleTodoComplete) => {
  const query = todoCompleteQueries.deleteScheduleTodoCompleteQuery(params)
  const db = await openDatabase()
  await db.executeSql(query)
}
