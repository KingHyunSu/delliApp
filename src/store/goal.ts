import {atom} from 'recoil'
import {GoalSchedule} from '@/@types/goal'

export const selectGoalScheduleListState = atom<GoalSchedule[]>({
  key: 'selectGoalScheduleListState',
  default: []
})
