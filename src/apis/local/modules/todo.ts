import {openDatabase} from '../utils/helper'
import * as todoQueries from '../queries/todo'
import {
  GetScheduleTodoDetailRequest,
  GetScheduleTodoDetailResponse,
  SetScheduleTodoRequest,
  UpdateScheduleTodoRequest,
  DeleteScheduleTodoRequest,
  UpdateScheduleTodoCompleteRequest
} from '@/apis/types/todo'

export const getScheduleTodoDetail = async (params: GetScheduleTodoDetailRequest) => {
  const query = todoQueries.getScheduleTodoDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.schedule_todo_id])

  return result.rows.item(0) as GetScheduleTodoDetailResponse
}

export const setScheduleTodo = async (params: SetScheduleTodoRequest) => {
  const query = todoQueries.setScheduleTodoQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.title, params.memo, params.schedule_id])

  return result.insertId
}

export const updateScheduleTodo = async (params: UpdateScheduleTodoRequest) => {
  const query = todoQueries.updateScheduleTodoQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.title, params.memo, params.schedule_todo_id])

  return params.schedule_todo_id
}

export const deleteScheduleTodo = async (params: DeleteScheduleTodoRequest) => {
  const query = todoQueries.deleteScheduleTodoQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.schedule_todo_id])

  return params.schedule_todo_id
}

export const updateScheduleTodoComplete = async (params: UpdateScheduleTodoCompleteRequest) => {
  const query = todoQueries.updateScheduleTodoCompleteQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.complete_date, params.schedule_todo_id])

  return result.insertId
}
