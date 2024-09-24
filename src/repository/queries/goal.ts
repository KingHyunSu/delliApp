import {GetGoalDetailRequest} from '@/repository/types/goal'

export const getGoalListQuery = () => {
  return `
		SELECT
			G.goal_id,
			G.title,
			G.end_date,
			G.state,
			SUM(GS.focus_time) AS focus_time_state,
			SUM(GS.complete_count) AS complete_state,
			SUM(SAL.active_time) AS total_focus_time,
			SUM(SAL.complete_state) AS total_complete_count
		FROM
			GOAL G
		LEFT OUTER JOIN
		  GOAL_SCHEDULE GS
		ON
		  G.goal_id = GS.goal_id
		LEFT OUTER JOIN
      SCHEDULE_ACTIVITY_LOG SAL
		ON
			GS.schedule_id = SAL.schedule_id
		GROUP BY
		  G.goal_id, G.title, G.end_date, G.state
	`
}

export const getGoalDetailQuery = (params: GetGoalDetailRequest) => {
  return `
		SELECT
			G.goal_id,
			G.title,
			G.end_date,
			G.active_end_date,
			G.state
		FROM
		  GOAL G
		WHERE
		  G.goal_id = ${params.goal_id}
	`
}

export const getGoalScheduleListQuery = (params: GetGoalDetailRequest) => {
  return `
    SELECT
      GS.focus_time,
      GS.complete_count,
      S.schedule_category_id,
      S.schedule_id,
      S.title,
      S.start_time,
      S.end_time,
      S.mon,
      S.tue,
      S.wed,
      S.thu,
      S.fri,
      S.sat,
      S.sun,
      S.start_date,
      S.end_date
    FROM
      GOAL_SCHEDULE GS
    JOIN
      SCHEDULE S
    ON
		  GS.schedule_id = S.schedule_id
    WHERE
      GS.goal_id = ${params.goal_id}
  `
}

export const setGoalDetailQuery = () => {
  return `
		INSERT INTO GOAL (title, end_date, active_end_date, state)
		VALUES (?, ?, ?, ?)
	`
}
