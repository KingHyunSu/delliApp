import * as routineQueries from '@/apis/local/queries/routine'
import {openDatabase} from '../utils/helper'
import {
  DeleteRoutineDeleteRequest,
  DeleteRoutineRequest,
  GetRoutineCompleteListRequest,
  GetRoutineCompleteListResponse,
  GetRoutineDetailRequest,
  GetRoutineDetailResponse,
  SetRoutineDeleteRequest,
  SetRoutineRequest,
  UpdateRoutineRequest
} from '@/apis/types/routine'
import {GetTodoListResponse} from '@/apis/types/routine'

// export const getRoutineList = async () => {
//   const query = routineQueries.getRoutineListQuery()
//   const db = await openDatabase()
//   const [result] = await db.executeSql(query)
//
//   return result.rows.raw().map(item => {
//     let completeDateList: string[] = []
//
//     if (item.complete_date_list) {
//       completeDateList = item.complete_date_list.split(',')
//     }
//
//     return {
//       ...item,
//       complete_date_list: completeDateList
//     }
//   }) as GetTodoListResponse[]
// }

export const getRoutineDetail = async (params: GetRoutineDetailRequest) => {
  const query = routineQueries.getRoutineDetailQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.routine_id])

  return result.rows.item(0) as GetRoutineDetailResponse
}

export const getRoutineCompleteList = async (params: GetRoutineCompleteListRequest) => {
  const query = routineQueries.getRoutineCompleteListQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.routine_id, params.start_date, params.end_date])

  return result.rows.raw() as GetRoutineCompleteListResponse[]
}

export const setRoutine = async (params: SetRoutineRequest) => {
  const query = routineQueries.setRoutineQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.title, params.schedule_id])

  return result.insertId
}

export const updateRoutine = async (params: UpdateRoutineRequest) => {
  const query = routineQueries.updateRoutineQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.title, params.routine_id])

  return params.routine_id
}

export const deleteRoutine = async (params: DeleteRoutineRequest) => {
  const query = routineQueries.deleteRoutineQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.routine_id])

  return params.routine_id
}

export const setRoutineComplete = async (params: SetRoutineDeleteRequest) => {
  const query = routineQueries.setRoutineCompleteQuery()
  const db = await openDatabase()
  const [result] = await db.executeSql(query, [params.routine_id, params.complete_date])

  return result.insertId
}

export const deleteRoutineComplete = async (params: DeleteRoutineDeleteRequest) => {
  const query = routineQueries.deleteRoutineCompleteQuery()
  const db = await openDatabase()
  await db.executeSql(query, [params.complete_id])

  return params.complete_id
}
