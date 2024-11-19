export const getRoutineListQuery = () => {
  return `
    SELECT
      T.routine_id,
      T.title,
      S.title AS schedule_title,
      GROUP_CONCAT(TC.complete_date) AS complete_date_list
    FROM ROUTINE T
      JOIN SCHEDULE S
        ON S.schedule_id = T.schedule_id
      LEFT JOIN ROUTINE_COMPLETE TC
        ON T.routine_id = TC.routine_id
        AND TC.complete_date >= DATE('now', '-7 days')
    WHERE T.end_date = '9999-12-31'
    GROUP BY T.routine_id, T.title, T.start_date, T.end_date, T.schedule_id
  `
}

// export const getRoutineListQuery = () => {
//   return `
//     SELECT
//       T.todo_id,
//       T.title,
//       T.start_date,
//       T.end_date,
//       T.schedule_id,
//       S.title AS schedule_title,
//       S.schedule_category_id,
//       S.start_time AS schedule_start_time,
//       S.end_time AS schedule_end_time,
//       S.mon AS schedule_mon,
//       S.tue AS schedule_tue,
//       S.wed AS schedule_wed,
//       S.thu AS schedule_thu,
//       S.fri AS schedule_fri,
//       S.sat AS schedule_sat,
//       S.sun AS schedule_sun,
//       S.start_date AS schedule_start_date,
//       S.end_date AS schedule_end_date,
//       GROUP_CONCAT(TC.complete_date) AS complete_date_list
//     FROM TODO T
//     JOIN SCHEDULE S
//       ON S.schedule_id = T.schedule_id
//     LEFT JOIN TODO_COMPLETE TC
//       ON T.todo_id = TC.todo_id
//       AND TC.complete_date >= DATE('now', '-7 days')
//     WHERE T.end_date = '9999-12-31'
//     GROUP BY T.todo_id, T.title, T.start_date, T.end_date, T.schedule_id
//   `
// }

export const getRoutineDetailQuery = () => {
  return `
    SELECT
      T.routine_id,
      T.title,
      T.schedule_id
    FROM ROUTINE T
    WHERE T.routine_id = ?
  `
}

export const getRoutineCompleteListQuery = () => {
  return `
    SELECT complete_date FROM ROUTINE_COMPLETE WHERE routine_id = ? AND complete_date >= ? AND complete_date <= ?
  `
}

export const setRoutineQuery = () => {
  return `
    INSERT INTO ROUTINE (title, schedule_id) VALUES (?, ?)  
  `
}

export const updateRoutineQuery = () => {
  return `
    UPDATE ROUTINE SET title = ? WHERE routine_id = ?
  `
}

export const deleteRoutineQuery = () => {
  return `
    DELETE FROM ROUTINE WHERE routine_id = ?
  `
}

export const getRoutineListBySchedule = () => {
  return `
    SELECT
      R.schedule_id,
      R.routine_id,
      R.title,
      RC1.complete_id,
      RC1.complete_date,
      GROUP_CONCAT(RC2.complete_date) AS complete_date_list
    FROM
      ROUTINE R
    LEFT OUTER JOIN ROUTINE_COMPLETE RC1
      ON R.routine_id = RC1.routine_id
      AND RC1.complete_date = ?
    LEFT OUTER JOIN ROUTINE_COMPLETE RC2
      ON R.routine_id = RC2.routine_id
      AND RC2.complete_date >= DATE('now', '-7 days')
    WHERE
      R.schedule_id = ?
    AND
      R.end_date = '9999-12-31'
    GROUP BY
      R.schedule_id,
      R.routine_id,
      R.title,
      RC1.complete_id,
      RC1.complete_date
  `
}

export const setRoutineCompleteQuery = () => {
  return `INSERT INtO ROUTINE_COMPLETE (routine_id, complete_date) VALUES (?, ?)`
}

export const deleteRoutineCompleteQuery = () => {
  return `DELETE FROM ROUTINE_COMPLETE WHERE complete_id = ?`
}
