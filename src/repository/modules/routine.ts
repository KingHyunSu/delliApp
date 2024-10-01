import * as routineQueries from '@/repository/queries/routine'
import {openDatabase} from '../utils/helper'
import {Routine} from '@/@types/routine'
import {EditRoutineRequest} from '@/repository/types/routine'

export const getRoutineList = async () => {
  const query = routineQueries.getRoutineListQuery()
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
    } as Routine
  })
}

export const setRoutine = async (params: EditRoutineRequest) => {
  const query = routineQueries.setRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [params.title, params.routine_type, params.routine_count, params.schedule_id])
}

export const updateRoutine = async (params: EditRoutineRequest) => {
  const query = routineQueries.updateRoutineQuery()
  const db = await openDatabase()

  return db.executeSql(query, [
    params.title,
    params.routine_type,
    params.routine_count,
    params.schedule_id,
    params.routine_id
  ])
}
