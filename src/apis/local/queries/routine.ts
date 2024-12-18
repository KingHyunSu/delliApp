export const getRoutineDetailQuery = () => {
  return `
    SELECT
      sr.routine_id,
      sr.title,
      sr.schedule_id
    FROM schedule_routine sr
    WHERE sr.routine_id = ?
  `
}

export const getRoutineCompleteListQuery = () => {
  return `
    SELECT complete_date FROM schedule_routine_complete WHERE routine_id = ? AND complete_date >= ? AND complete_date <= ?
  `
}

export const setRoutineQuery = () => {
  return `
    INSERT INTO schedule_routine (title, schedule_id) VALUES (?, ?)  
  `
}

export const updateRoutineQuery = () => {
  return `
    UPDATE schedule_routine SET title = ? WHERE routine_id = ?
  `
}

export const deleteRoutineQuery = () => {
  return `
    DELETE FROM schedule_routine WHERE routine_id = ?
  `
}

export const getRoutineListBySchedule = () => {
  return `
    SELECT
      sr.schedule_id,
      sr.routine_id,
      sr.title,
      src1.complete_id,
      src1.complete_date,
      GROUP_CONCAT(src2.complete_date) AS complete_date_list
    FROM
      schedule_routine sr
    LEFT OUTER JOIN schedule_routine_complete src1
      ON sr.routine_id = src1.routine_id
      AND src1.complete_date = ?
    LEFT OUTER JOIN schedule_routine_complete src2
      ON sr.routine_id = src2.routine_id
      AND src2.complete_date >= DATE('now', '-7 days')
    WHERE
      sr.schedule_id = ?
    AND
      sr.end_date = '9999-12-31'
    GROUP BY
      sr.schedule_id,
      sr.routine_id,
      sr.title,
      src1.complete_id,
      src1.complete_date
  `
}

export const setRoutineCompleteQuery = () => {
  return `INSERT INtO schedule_routine_complete (routine_id, complete_date) VALUES (?, ?)`
}

export const deleteRoutineCompleteQuery = () => {
  return `DELETE FROM schedule_routine_complete WHERE complete_id = ?`
}
