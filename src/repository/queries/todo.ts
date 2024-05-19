import {GetTodoList, SetTodo, DeleteTodo} from '../types/todo'

export const getTodoQuery = (params: GetTodoList) => {
  let query = `
    SELECT
      *
    FROM
      TODO
    WHERE
      todo_id = ${params.todo_id}
  `

  return query
}

export const setTodoQuery = (params: SetTodo) => {
  let query = `
    INSERT INTO TODO (
      schedule_id,
      title, 
      start_date, 
      end_date
    ) VALUES (
      ${params.schedule_id},
      "${params.title}",
      "${params.start_date}",
  `

  if (params.end_date) {
    query += `"${params.end_date}"`
  } else {
    query += '"9999-12-31"'
  }

  query += '\n)'

  return query
}

export const updateTodoQuery = (params: SetTodo) => {
  let query = `
    UPDATE
      TODO
    SET
      title = "${params.title}",\n
    `

  if (params.end_date) {
    query += `end_date = "${params.end_date}"`
  } else {
    query += `end_date = "9999-12-31"`
  }

  query += `
    WHERE todo_id = ${params.todo_id}
  `

  return query
}

export const deleteTodoQuery = (params: DeleteTodo) => {
  let query = `
    DELETE FROM TODO
    WHERE todo_id = ${params.todo_id}
  `

  return query
}
