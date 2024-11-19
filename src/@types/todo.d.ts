import {GetTodoListByScheduleResponse} from '@/apis/types/todo'

declare global {
  interface ScheduleTodo extends GetTodoListByScheduleResponse {}
  interface EditTodoForm {
    todo_id: number | null
    title: string
    schedule_id: number | null
  }
}
