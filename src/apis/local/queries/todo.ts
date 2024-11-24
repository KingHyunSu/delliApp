export const getScheduleTodoDetailQuery = () => {
  return `
    SELECT
      st.schedule_todo_id,
      st.title,
      st.memo,
      st.complete_date,
      st.schedule_id
    FROM schedule_todo st
    WHERE st.schedule_todo_id = ?
  `
}

export const setScheduleTodoQuery = () => {
  return `INSERT INTO schedule_todo (title, memo, schedule_id) VALUES (?, ?, ?)`
}

export const updateScheduleTodoQuery = () => {
  return `
    UPDATE schedule_todo SET title = ?, memo = ? WHERE schedule_todo_id = ?
  `
}

export const deleteScheduleTodoQuery = () => {
  return `
    DELETE FROM schedule_todo WHERE schedule_todo_id = ?
  `
}

export const getScheduleTodoByScheduleIdQuery = () => {
  return `
    SELECT 
      tc.schedule_todo_id,
      tc.title,
      tc.complete_date,
      tc.schedule_id
    FROM
      schedule_todo tc
    WHERE
      tc.schedule_id = ?
    ORDER BY tc.complete_date
  `
}

export const updateScheduleTodoCompleteQuery = () => {
  return `
    UPDATE schedule_todo SET complete_date = ? WHERE schedule_todo_id = ?
  `
}
