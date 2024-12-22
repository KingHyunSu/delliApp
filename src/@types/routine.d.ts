import {GetScheduleRoutineCompleteListResponse} from '@/apis/types/routine'

declare global {
  interface RoutineComplete extends GetScheduleRoutineCompleteListResponse {}
  interface ScheduleRoutine {
    schedule_routine_id: number
    title: string
    schedule_routine_complete_id: number | null
    complete_date: string | null
    complete_date_list: string[]
    schedule_id: number
  }
  interface EditRoutineForm {
    schedule_routine_id: number | null
    title: string
    schedule_id: number | null
  }
}
