import type {GetCategoryStatsListResponse, GetScheduleActivityLogListResponse} from '@/repository/types/stats'

export interface CategoryStatsList {
  schedule_category_id: number | null
  categoryTitle: string
  categoryIcon: string | null
  image: string | null
  totalTime: number
  color: string
  percentage?: number
  data: GetCategoryStatsListResponse[]
}

export interface ScheduleActivityLog {
  date: string
  totalActiveTime: number
  totalCompleteCount: number
  data: GetScheduleActivityLogListResponse[]
}
