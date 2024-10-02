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

export const getRoutineDetailQuery = () => {
  return `
    SELECT
      R.routine_id,
      R.title,
      R.routine_type,
      R.routine_count,
      S.schedule_id,
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
      (
        SELECT GROUP_CONCAT(RC.complete_date)
        FROM ROUTINE_COMPLETE RC
        WHERE RC.routine_id = R.routine_id
          AND RC.complete_date >= DATE('now', '-' || (R.routine_type * 7) || ' days')
      ) AS complete_date_list
    FROM
      ROUTINE R
    JOIN
      SCHEDULE S
    ON
      S.schedule_id = R.schedule_id
    WHERE
      R.routine_id = ?
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
