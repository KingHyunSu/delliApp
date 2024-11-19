import {GetRoutineCompleteListResponse, GetRoutineListByScheduleResponse} from '@/apis/types/routine'

declare global {
  interface ScheduleRoutine extends GetRoutineListByScheduleResponse {}
  interface RoutineComplete extends GetRoutineCompleteListResponse {}
  interface EditRoutineForm {
    routine_id: number | null
    title: string
    schedule_id: number | null
  }
}
