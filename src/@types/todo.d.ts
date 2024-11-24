import {GetTodoListByScheduleIdResponse} from '@/apis/types/todo'

declare global {
  interface ScheduleTodo extends GetTodoListByScheduleIdResponse {}
  interface EditTodoForm {
    schedule_todo_id: number | null
    title: string
    memo: string
    complete_date: string | null
    schedule_id: number | null
  }
}
