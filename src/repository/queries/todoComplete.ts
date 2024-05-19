import {SetScheduleTodoComplete, DeleteScheduleTodoComplete} from '../types/todoComplete'

export const setScheduleTodoCompleteQuery = (params: SetScheduleTodoComplete) => {
  let query = `
    INSERT INTO TODO_COMPLETE (
      todo_id,
      complete_date
    ) VALUES (
      ${params.todo_id},
      "${params.complete_date}"
    )
  `

  return query
}

export const deleteScheduleTodoCompleteQuery = (params: DeleteScheduleTodoComplete) => {
  let query = `
    DELETE FROM TODO_COMPLETE
    WHERE complete_id = ${params.complete_id}
  `

  return query
}
