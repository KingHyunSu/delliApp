import {GetScheduleList, GetExistScheduleList, UpdateScheduleDisable} from '../types/schedule'

export const getScheduleListQuery = (params: GetScheduleList) => {
  let query = `
    SELECT
      A.schedule_id,
      A.title,
      A.start_time,
      A.end_time,
      A.disable,
      A.mon,
      A.tue,
      A.wed,
      A.thu,
      A.fri,
      A.sat,
      A.sun,
      A.start_date,
      A.end_date,
      A.title_x,
      A.title_y,
      A.title_rotate,
      A.background_color as background_color,
      A.text_color as text_color,
      A.alarm,
      (CASE WHEN (COUNT(B.todo_id) = 0)
        THEN JSON_ARRAY()
        ELSE JSON_GROUP_ARRAY(
          JSON_OBJECT(
            'schedule_id', B.schedule_id,
            'todo_id', B.todo_id,
            'title', B.title,
            'start_date', B.start_date,
            'end_date', CASE WHEN (B.end_date = '9999-12-31') THEN null ELSE B.end_date END,
            'complete_id', C.complete_id,
            'complete_date', C.complete_date
          )
        )
      END) as todo_list
    FROM
      SCHEDULE A
    LEFT OUTER JOIN
      TODO B
    ON
      A.schedule_id = B.schedule_id
    AND
      B.start_date <= "${params.date}"
    AND
      B.end_date >= "${params.date}"
    LEFT OUTER JOIN
      TODO_COMPLETE C
    ON
      B.todo_id = C.todo_id
    AND
      C.complete_date = "${params.date}"
    WHERE
      A.start_date <= "${params.date}"
    AND
      A.end_date >= "${params.date}"
  `

  if (params.mon) {
    query += `AND A.mon = "${params.mon}"\n`
  }
  if (params.tue) {
    query += `AND A.tue = "${params.tue}"\n`
  }
  if (params.wed) {
    query += `AND A.wed = "${params.wed}"\n`
  }
  if (params.thu) {
    query += `AND A.thu = "${params.thu}"\n`
  }
  if (params.fri) {
    query += `AND A.fri = "${params.fri}"\n`
  }
  if (params.sat) {
    query += `AND A.sat = "${params.sat}"\n`
  }
  if (params.sun) {
    query += `AND A.sun = "${params.sun}"\n`
  }
  if (params.disable) {
    query += `AND A.disable = ${params.disable}`
  }

  query += `
    GROUP BY
      A.schedule_id,
      A.title,
      A.start_time,
      A.end_time,
      A.disable,
      A.mon,
      A.tue,
      A.wed,
      A.thu,
      A.fri,
      A.sat,
      A.sun,
      A.start_date,
      A.end_date,
      A.title_x,
      A.title_y,
      A.title_rotate,
      A.background_color,
      A.text_color,
      A.alarm
    ORDER BY A.start_time asc
  `

  return query
}

export const getExistScheduleListQuery = (params: GetExistScheduleList) => {
  let query = `
    SELECT
      schedule_id,
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun
    FROM
      SCHEDULE
    WHERE
      disable = '0'
    AND
      start_date <= '${params.end_date}'
    AND
      end_date > '${params.start_date}'
  `

  if (params.schedule_id !== null) {
    query += `AND schedule_id != ${params.schedule_id}\n`
  }

  query += `
    AND (
      (
        start_time > end_time AND (
          (
            start_time < ${params.start_time}
            OR
            end_time > ${params.start_time}
          ) OR (
            start_time < ${params.end_time}
            OR
            end_time > ${params.end_time}
          )
  `

  if (params.start_time > params.end_time) {
    query += `
      OR (
        start_time > ${params.start_time}
        AND
        end_time < ${params.end_time}
      ) 
    `
  }

  query += `
    )
      ) OR (
        start_time < end_time AND (
          (
            start_time < ${params.start_time} 
            AND 
            end_time > ${params.start_time}
          ) OR (
            start_time < ${params.end_time} 
            AND 
            end_time > ${params.end_time}
          ) OR (
            start_time >= ${params.start_time} 
            AND 
            end_time <= ${params.end_time}
          )
        )
      )
    )
  `

  query += `
    AND (
      1 = 2
  `

  if (params.mon === '1') {
    query += `OR mon = '1'\n`
  }
  if (params.tue === '1') {
    query += `OR tue = '1'\n`
  }
  if (params.wed === '1') {
    query += `OR wed = '1'\n`
  }
  if (params.thu === '1') {
    query += `OR thu = '1'\n`
  }
  if (params.fri === '1') {
    query += `OR fri = '1'\n`
  }
  if (params.sat === '1') {
    query += `OR sat = '1'\n`
  }
  if (params.sun === '1') {
    query += `OR sun = '1'`
  }

  query += `
    )
  `
  console.log('query', query)
  return query
}

export const setScheduleQuery = (params: Schedule) => {
  let query = `
    INSERT INTO SCHEDULE (
      title, 
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      start_time, 
      end_time,
      start_date, 
      end_date,
      title_x,
      title_y,
      title_rotate,
      background_color,
      text_color,
      disable,
      create_date,
      update_date
    ) VALUES (
      "${params.title}", 
      "${params.mon}",
      "${params.tue}",
      "${params.wed}",
      "${params.thu}",
      "${params.fri}",
      "${params.sat}",
      "${params.sun}",
      ${params.start_time}, 
      ${params.end_time}, 
      "${params.start_date}", 
      "${params.end_date}", 
      ${params.title_x},
      ${params.title_y},
      ${params.title_rotate},
      "${params.background_color}",
      "${params.text_color}",
      "0",
      (SELECT strftime('%Y-%m-%d', datetime('now', 'localtime'))),
      (SELECT strftime('%Y-%m-%d', datetime('now', 'localtime')))
    )
  `

  return query
}

export const updateScheduleQuery = (params: Schedule) => {
  let query = `
    UPDATE
      SCHEDULE
    SET
      start_time = ${params.start_time},
      end_time = ${params.end_time},
      title = "${params.title}",
      start_date = "${params.start_date}",
      end_date = "${params.end_date}",
      mon = "${params.mon}",
      tue = "${params.tue}",
      wed = "${params.wed}",
      thu = "${params.thu}",
      fri = "${params.fri}",
      sat = "${params.sat}",
      sun = "${params.sun}",
      title_x = ${params.title_x},
      title_y = ${params.title_y},
      title_rotate = ${params.title_rotate},
      background_color = "${params.background_color}",
      text_color = "${params.text_color}",
      update_date = (SELECT datetime('now', 'localtime'))
    WHERE
      schedule_id = ${params.schedule_id}
  `

  return query
}

export const updateScheduleDisableQuery = (params: UpdateScheduleDisable) => {
  let query = `
    UPDATE
      SCHEDULE
    SET
      disable = '1',
      disable_date = (SELECT datetime('now', 'localtime'))
    WHERE
      schedule_id = ${params.schedule_id}
  `

  return query
}

export const getBackgroundColorListQuery = () => {
  const query = `
    SELECT background_color as color
    FROM SCHEDULE
    GROUP BY background_color
    LIMIT 20
  `

  return query
}

export const getTextColorListQuery = () => {
  const query = `
    SELECT text_color as color
    FROM SCHEDULE
    GROUP BY text_color
    LIMIT 20
  `

  return query
}
