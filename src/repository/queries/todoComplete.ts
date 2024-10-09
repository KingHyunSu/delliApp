export const setScheduleTodoCompleteQuery = () => {
  return `
    INSERT INTO TODO_COMPLETE (todo_id, complete_date) VALUES (?, ?)
  `
}

export const deleteScheduleTodoCompleteQuery = () => {
  return `
    DELETE FROM TODO_COMPLETE WHERE complete_id = ?
  `
}
