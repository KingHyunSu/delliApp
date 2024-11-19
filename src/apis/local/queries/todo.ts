export const getTodoDetailQuery = () => {
  return `
    SELECT
      T.todo_id,
      T.title,
      T.schedule_id
    FROM TODO T
    WHERE T.todo_id = ?
  `
}

export const setTodoQuery = () => {
  return `INSERT INTO TODO (title, start_date, end_date, schedule_id) VALUES (?, ?, ?, ?)
  `
}

export const updateTodoQuery = () => {
  return `
    UPDATE TODO SET title = ? WHERE todo_id = ?
  `
}

export const deleteTodoQuery = () => {
  return `
    DELETE FROM TODO WHERE todo_id = ?
  `
}

export const getTodoByScheduleQuery = () => {
  return `
    SELECT 
      T.schedule_id,
      T.todo_id,
      T.title,
      TC.complete_id,
      TC.complete_date
    FROM
      TODO T
    LEFT OUTER JOIN TODO_COMPLETE TC
      ON T.todo_id = TC.todo_id
      AND TC.complete_date = ?
    WHERE
      T.schedule_id = ?
    AND
      T.end_date = ?
  `
}

export const setTodoCompleteQuery = () => {
  return `
    INSERT INTO TODO_COMPLETE (todo_id, complete_date) VALUES (?, ?)
  `
}

export const deleteTodoCompleteQuery = () => {
  return `
    DELETE FROM TODO_COMPLETE WHERE complete_id = ?
  `
}
