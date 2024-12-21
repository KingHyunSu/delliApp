import {GetRoutineCompleteListResponse} from '@/apis/types/routine'

declare global {
  interface RoutineComplete extends GetRoutineCompleteListResponse {}
  interface ScheduleRoutine {
    routine_id: number
    title: string
    complete_id: number | null
    complete_date: string | null
    complete_date_list: string[]
    schedule_id: number
  }
  interface EditRoutineForm {
    routine_id: number | null
    title: string
    schedule_id: number | null
  }
}
