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

export const deleteTodoQuery = () => {
  return `
    DELETE FROM TODO WHERE todo_id = ?
  `
}

export const getRoutineListQuery = () => {
  return `
    SELECT
      T.todo_id,
      T.title,
      T.start_date,
      T.end_date,
      T.schedule_id,
      S.title AS schedule_title,
      S.schedule_category_id,
      S.start_time AS schedule_start_time,
      S.end_time AS schedule_end_time,
      S.mon AS schedule_mon,
      S.tue AS schedule_tue,
      S.wed AS schedule_wed,
      S.thu AS schedule_thu,
      S.fri AS schedule_fri,
      S.sat AS schedule_sat,
      S.sun AS schedule_sun,
      S.start_date AS schedule_start_date,
      S.end_date AS schedule_end_date,
      GROUP_CONCAT(TC.complete_date) AS complete_date_list
    FROM TODO T
    JOIN SCHEDULE S
      ON S.schedule_id = T.schedule_id
    LEFT JOIN TODO_COMPLETE TC
      ON T.todo_id = TC.todo_id
      AND TC.complete_date >= DATE('now', '-7 days')
    WHERE T.end_date = '9999-12-31'
    GROUP BY T.todo_id, T.title, T.start_date, T.end_date, T.schedule_id
  `
}

export const getRoutineDetailQuery = () => {
  return `
    SELECT
      T.todo_id,
      T.title,
      T.schedule_id,
      S.title AS schedule_title,
      S.schedule_category_id,
      S.start_time AS schedule_start_time,
      S.end_time AS schedule_end_time,
      S.mon AS schedule_mon,
      S.tue AS schedule_tue,
      S.wed AS schedule_wed,
      S.thu AS schedule_thu,
      S.fri AS schedule_fri,
      S.sat AS schedule_sat,
      S.sun AS schedule_sun,
      S.start_date AS schedule_start_date,
      S.end_date AS schedule_end_date
    FROM TODO T
    JOIN SCHEDULE S
        ON S.schedule_id = T.schedule_id
    WHERE T.todo_id = ?
  `
}

export const getRoutineCompleteListQuery = () => {
  return `
    SELECT complete_date FROM TODO_COMPLETE WHERE todo_id = ? AND complete_date >= ?
  `
}

export const setRoutineQuery = () => {
  return `
    INSERT INTO TODO (title, start_date, schedule_id) VALUES (?, ?, ?)  
  `
}

export const updateRoutineQuery = () => {
  return `
    UPDATE TODO SET title = ?, schedule_id = ? WHERE todo_id = ?
  `
}
