import {openDatabase} from '../utils/helper'
import * as goalQueries from '../queries/goal'
import {GetGoalDetailRequest, GetGoalResponse} from '@/repository/types/goal'
import {Goal} from '@/@types/goal'

export const getGoalList = async () => {
  const query = goalQueries.getGoalListQuery()
  const db = await openDatabase()

  const [result] = await db.executeSql(query)

  return result.rows.raw() as GetGoalResponse[]
}

export const getGoalDetail = async (params: GetGoalDetailRequest) => {
  const goalDetailQuery = goalQueries.getGoalDetailQuery(params)
  const goalScheduleListQuery = goalQueries.getGoalScheduleListQuery(params)
  const db = await openDatabase()

  let result: Goal = {
    goal_id: null,
    title: '',
    active_end_date: 0,
    end_date: null,
    state: 0,
    scheduleList: []
  }
  console.log('21839102830913,')
  try {
    await db.transaction(tx => {
      tx.executeSql(goalDetailQuery, [], (tx1, result1) => {
        tx.executeSql(goalScheduleListQuery, [], (tx2, result2) => {
          // result.scheduleList = result2.rows.raw()
          result = {
            ...result1.rows.item(0),
            scheduleList: result2.rows.raw()
          }
        })
      })
    })

    console.log('result', result)

    return result
  } catch (e) {
    console.error('error', e)
  }
}
