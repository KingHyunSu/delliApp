export const getRoutineListQuery = () => {
  return `
    SELECT
      R.routine_id,
      R.title,
      R.routine_type,
      R.routine_count,
      (
        SELECT GROUP_CONCAT(RC.complete_date)
        FROM ROUTINE_COMPLETE RC
        WHERE RC.routine_id = R.routine_id
        AND RC.complete_date >= DATE('now', '-' || (R.routine_type * 7) || ' days')
      ) AS complete_date_list
    FROM
			ROUTINE R
  `
}

export const setRoutineQuery = () => {
  return `
    INSERT INTO ROUTINE (title, routine_type, routine_count, schedule_id) 
    VALUES (?, ?, ?, ?)
  `
}

export const updateRoutineQuery = () => {
  return `
    UPDATE ROUTINE 
    SET title = ?, routine_type = ?, routine_count = ?, schedule_id = ?
    WHERE routine_id = ?
  `
}
