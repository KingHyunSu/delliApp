export const getRoutineListBySchedule = () => {
  return `
    SELECT
      sr.schedule_id,
      sr.schedule_routine_id,
      sr.title,
      src1.schedule_routine_complete_id,
      src1.complete_date,
      GROUP_CONCAT(src2.complete_date) AS complete_date_list
    FROM
      schedule_routine sr
    LEFT OUTER JOIN schedule_routine_complete src1
      ON sr.schedule_routine_id = src1.schedule_routine_id
      AND src1.complete_date = ?
    LEFT OUTER JOIN schedule_routine_complete src2
      ON sr.schedule_routine_id = src2.schedule_routine_id
      AND src2.complete_date >= DATE('now', '-7 days')
    WHERE
      sr.schedule_id = ?
    AND
      sr.end_date = '9999-12-31'
    GROUP BY
      sr.schedule_id,
      sr.schedule_routine_id,
      sr.title,
      src1.schedule_routine_complete_id,
      src1.complete_date
  `
}

export const getScheduleRoutineDetailQuery = () => {
  return `
    SELECT
      sr.schedule_routine_id,
      sr.title,
      sr.schedule_id
    FROM schedule_routine sr
    WHERE sr.schedule_routine_id = ?
  `
}

export const setScheduleRoutineQuery = () => {
  return `
    INSERT INTO schedule_routine (title, schedule_id) VALUES (?, ?)  
  `
}

export const updateScheduleRoutineQuery = () => {
  return `
    UPDATE schedule_routine SET title = ? WHERE schedule_routine_id = ?
  `
}

export const deleteScheduleRoutineQuery = () => {
  return `
    DELETE FROM schedule_routine WHERE schedule_routine_id = ?
  `
}

export const getScheduleRoutineCompleteListQuery = () => {
  return `
    SELECT complete_date FROM schedule_routine_complete WHERE schedule_routine_id = ? AND complete_date >= ? AND complete_date <= ?
  `
}

export const completeScheduleRoutineQuery = () => {
  return `INSERT INtO schedule_routine_complete (schedule_routine_id, complete_date) VALUES (?, ?)`
}

export const incompleteScheduleRoutineQuery = () => {
  return `DELETE FROM schedule_routine_complete WHERE schedule_routine_complete_id = ?`
}
