import {GetTodoList, SetTodo, DeleteTodo} from '../types/todo'

export const getTodoQuery = (params: GetTodoList) => {
  let query = `
    SELECT
      A.todo_id,
      A.title,
      A.start_date,
      A.end_date,
      A.schedule_id,
      B.complete_id,
      B.complete_date
    FROM
      TODO A
    LEFT OUTER JOIN 
      TODO_COMPLETE B
    ON
      A.todo_id = B.todo_id
    AND
      B.complete_date = "${params.date}"
    WHERE
      A.todo_id = ${params.todo_id}
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

export const getRoutineListQuery = () => {
  return `
    SELECT
      T.todo_id,
      T.title,
      T.start_date,
      T.end_date,
      T.repeat_complete_type,
      T.repeat_complete_count,
      (
        SELECT GROUP_CONCAT(TC.complete_date)
        FROM TODO_COMPLETE TC
        WHERE TC.todo_id = T.todo_id
        AND TC.complete_date >= DATE('now', '-' || (T.repeat_complete_type * 7) || ' days')
      ) AS complete_date_list
    FROM
      TODO T
    WHERE
      T.repeat_complete_type IS NOT NULL
  `
}
