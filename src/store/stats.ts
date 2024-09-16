import {atom} from 'recoil'
import type {CategoryStatsList} from '@/@types/stats'

export const categoryStatsListState = atom<CategoryStatsList[]>({
  key: 'categoryStatsListState',
  default: []
})

export const categoryTotalTimeState = atom({
  key: 'categoryTotalTimeState',
  default: 0
})
