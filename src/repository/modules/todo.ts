import {openDatabase} from '../utils/helper'
import {
  GetTodoList,
  SetTodo,
  DeleteTodo,
  SetRoutineRequest,
  GetRoutineDetailRequest,
  GetRoutineCompleteListRequest
} from '../types/todo'
import * as todoQueries from '../queries/todo'

export const getTodo = async (params: GetTodoList) => {
  const query = todoQueries.getTodoQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw()
}

export const setTodo = async (params: SetTodo) => {
  const query = todoQueries.setTodoQuery(params)
  const db = await openDatabase()
  const [result] = await db.executeSql(query)
  const insertId = result.insertId

  return await getTodo({todo_id: insertId, date: params.date})
}

export const updateTodo = async (params: SetTodo) => {
  const query = todoQueries.updateTodoQuery(params)
  const db = await openDatabase()
  await db.executeSql(query)

  return await getTodo({todo_id: params.todo_id!, date: params.date})
}

export const deleteTodo = async (params: DeleteTodo) => {
  const query = todoQueries.deleteTodoQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.todo_id])

  return {todo_id: params.todo_id}
}

export const getRoutineList = async () => {
  const query = todoQueries.getRoutineListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query)

  return result.rows.raw().map(item => {
    let completeDateList: string[] = []

    if (item.complete_date_list) {
      completeDateList = item.complete_date_list.split(',')
    }

    return {
      ...item,
      complete_date_list: completeDateList
    }
  }) as Todo[]
}

export const getRoutineDetail = async (params: GetRoutineDetailRequest) => {
  const query = todoQueries.getRoutineDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.todo_id])

  return result.rows.item(0) as TodoDetail
}

export const getRoutineCompleteList = async (params: GetRoutineCompleteListRequest) => {
  const query = todoQueries.getRoutineCompleteListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.todo_id, params.startDate])

  return result.rows.raw() as TodoComplete[]
}

export const setRoutine = async (params: SetRoutineRequest) => {
  const query = todoQueries.setRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [params.title, params.start_date, params.schedule_id])
}

export const updateRoutine = async (params: SetRoutineRequest) => {
  const query = todoQueries.updateRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [params.title, params.schedule_id, params.todo_id])
}
