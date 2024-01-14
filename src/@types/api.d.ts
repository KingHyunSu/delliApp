declare interface joinResponse {
  token: string
}

declare interface loginResponse {
  token: string
}

declare interface SetScheduleTodoCompleteRequest {
  todo_id: number
  complete_date: string
}

declare interface DeleteScheduleTodoCompleteRequest {
  complete_id: number
}
