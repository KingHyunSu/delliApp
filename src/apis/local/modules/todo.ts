import {openDatabase} from '../utils/helper'
import * as todoQueries from '../queries/todo'
import {
  SetTodoRequest,
  UpdateTodoRequest,
  DeleteTodoRequest,
  GetTodoDetailRequest,
  GetTodoDetailResponse,
  SetTodoCompleteRequest,
  DeleteTodoCompleteRequest
} from '@/apis/types/todo'

export const getTodoDetail = async (params: GetTodoDetailRequest) => {
  const query = todoQueries.getTodoDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.todo_id])

  return result.rows.item(0) as GetTodoDetailResponse
}

export const setTodo = async (params: SetTodoRequest) => {
  const query = todoQueries.setTodoQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.title, params.start_date, params.end_date, params.schedule_id])

  return result.insertId
}

export const updateTodo = async (params: UpdateTodoRequest) => {
  const query = todoQueries.updateTodoQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.title, params.todo_id])

  return params.todo_id
}

export const deleteTodo = async (params: DeleteTodoRequest) => {
  const query = todoQueries.deleteTodoQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.todo_id])

  return params.todo_id
}

export const setTodoComplete = async (params: SetTodoCompleteRequest) => {
  const query = todoQueries.setTodoCompleteQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.todo_id, params.complete_date])

  return result.insertId
}

export const deleteTodoComplete = async (params: DeleteTodoCompleteRequest) => {
  const query = todoQueries.deleteTodoCompleteQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.complete_id])

  return params.complete_id
}
