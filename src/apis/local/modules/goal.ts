import {openDatabase} from '../utils/helper'
import * as goalQueries from '../queries/goal'
import {DeleteGoalDetailRequest, GetGoalDetailRequest, GetGoalResponse, SetGoalDetailParams} from '../types/goal'
import {Goal} from '@/@types/goal'

export const getGoalList = async () => {
  const getGoalListQuery = goalQueries.getGoalListQuery()
  // const getGoalScheduleListQuery = goalQueries.getGoalScheduleListQuery()
  const db = await openDatabase()

  // const [result] = await db.executeSql(getGoalListQuery)
  //
  // return result.rows.raw() as GetGoalResponse[]

  const result: Goal[] = []

  await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(getGoalListQuery, [], (tx1, result1) => {
        const goalList: Goal[] = result1.rows.raw()

        const promises = goalList.map(item => {
          return new Promise<Goal>((resolve2, reject2) => {})
        })
      })
    })
  })
}

export const getGoalDetail = async (params: GetGoalDetailRequest) => {
  const goalDetailQuery = goalQueries.getGoalDetailQuery(params)
  const db = await openDatabase()

  let result: Goal = {
    goal_id: null,
    title: '',
    start_date: null,
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: []
  }

  try {
    await db.transaction(tx => {
      tx.executeSql(goalDetailQuery, [], (tx1, result1) => {
        const goalDetailResponse = result1.rows.item(0)
        const goalScheduleListQuery = goalQueries.getGoalScheduleListQuery({
          goal_id: goalDetailResponse.goal_id,
          start_date: goalDetailResponse.start_date
        })

        tx.executeSql(goalScheduleListQuery, [], (tx2, result2) => {
          result = {
            ...result1.rows.item(0),
            scheduleList: result2.rows.raw()
          }
        })
      })
    })

    return result
  } catch (e) {
    throw e
  }
}

export const setGoalDetail = async (params: SetGoalDetailParams) => {
  const setGoalDetailQuery = goalQueries.setGoalDetailQuery()
  const setGoalScheduleQuery = goalQueries.setGoalScheduleQuery()
  const updateGoalScheduleQuery = goalQueries.updateGoalScheduleQuery()
  const deleteGoalScheduleQuery = goalQueries.deleteGoalScheduleQuery()

  const db = await openDatabase()

  return db.transaction(tx => {
    tx.executeSql(
      setGoalDetailQuery,
      [params.title, params.start_date, params.end_date, params.active_end_date],
      (tx1, result) => {
        // insert goal schedule
        if (params.insertedList.length > 0) {
          params.insertedList.forEach(item => {
            tx1.executeSql(setGoalScheduleQuery, [
              result.insertId,
              item.schedule_id,
              item.total_focus_time,
              item.total_complete_count
            ])
          })
        }

        // update goal schedule
        if (params.updatedList.length > 0) {
          params.updatedList.forEach(item => {
            tx1.executeSql(updateGoalScheduleQuery, [
              item.total_focus_time,
              item.total_complete_count,
              item.goal_schedule_id
            ])
          })
        }

        // delete goal schedule
        if (params.deletedList.length > 0) {
          params.deletedList.forEach(item => {
            tx1.executeSql(deleteGoalScheduleQuery, [item.goal_schedule_id])
          })
        }
      }
    )
  })
}

export const updateGoalDetail = async (params: SetGoalDetailParams) => {
  const updateGoalDetailQuery = goalQueries.updateGoalDetailQuery()
  const setGoalScheduleQuery = goalQueries.setGoalScheduleQuery()
  const updateGoalScheduleQuery = goalQueries.updateGoalScheduleQuery()
  const deleteGoalScheduleQuery = goalQueries.deleteGoalScheduleQuery()

  const db = await openDatabase()

  return db.transaction(tx => {
    tx.executeSql(
      updateGoalDetailQuery,
      [params.title, params.start_date, params.end_date, params.active_end_date, params.goal_id],
      tx1 => {
        // insert goal schedule
        if (params.insertedList.length > 0) {
          params.insertedList.forEach(item => {
            tx1.executeSql(setGoalScheduleQuery, [
              params.goal_id,
              item.schedule_id,
              item.total_focus_time,
              item.total_complete_count
            ])
          })
        }

        // update goal schedule
        if (params.updatedList.length > 0) {
          params.updatedList.forEach(item => {
            tx1.executeSql(updateGoalScheduleQuery, [
              item.total_focus_time,
              item.total_complete_count,
              item.goal_schedule_id
            ])
          })
        }

        // delete goal schedule
        if (params.deletedList.length > 0) {
          params.deletedList.forEach(item => {
            tx1.executeSql(deleteGoalScheduleQuery, [item.goal_schedule_id, null])
          })
        }
      }
    )
  })
}

export const deleteGoalDetail = async (params: DeleteGoalDetailRequest) => {
  const deleteGoalDetailQuery = goalQueries.deleteGoalDetailQuery()
  const deleteGoalScheduleQuery = goalQueries.deleteGoalScheduleQuery()

  const db = await openDatabase()

  return db.transaction(tx => {
    tx.executeSql(deleteGoalDetailQuery, [params.goal_id])
    tx.executeSql(deleteGoalScheduleQuery, [null, params.goal_id])
  })
}
