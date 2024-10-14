import {openDatabase} from '../utils/helper'
import {SetTodoComplete, DeleteTodoComplete} from '../types/todoComplete'
import * as todoCompleteQueries from '../queries/todoComplete'

export const setScheduleTodoCompleteQuery = async (params: SetTodoComplete) => {
  const query = todoCompleteQueries.setScheduleTodoCompleteQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.todo_id, params.complete_date])

  return {complete_id: result.insertId}
}

export const deleteScheduleTodoCompleteQuery = async (params: DeleteTodoComplete) => {
  const query = todoCompleteQueries.deleteScheduleTodoCompleteQuery()
  const db = await openDatabase()
  return await db.executeSql(query, [params.complete_id])
}
