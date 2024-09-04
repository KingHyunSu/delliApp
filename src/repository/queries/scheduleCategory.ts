import {DeleteScheduleCategory, SetScheduleCategory, UpdateScheduleCategory} from '../types/scheduleCategory'

export const getScheduleCategoryListQuery = () => {
  return `SELECT * FROM SCHEDULE_CATEGORY;`
}

export const setScheduleCategoryQuery = (params: SetScheduleCategory) => {
  return `INSERT INTO SCHEDULE_CATEGORY (title) VALUES ("${params.title}");`
}

export const updateScheduleCategoryQuery = (params: UpdateScheduleCategory) => {
  return `
		UPDATE 
			SCHEDULE_CATEGORY 
		SET
			title = "${params.title}"
		WHERE
			schedule_category_id = ${params.schedule_category_id}
	`
}

export const deleteScheduleCategoryQuery = (params: DeleteScheduleCategory) => {
  return `DELETE FROM SCHEDULE_CATEGORY WHERE schedule_category_id = ${params.schedule_category_id}`
}

export const setDefaultScheduleCategoryQuery = () => {
  return `
      INSERT INTO SCHEDULE_CATEGORY (title) VALUES
				("자기개발"),
				("공부"),
        ("운동"),
        ("취미"),
        ("업무"),
        ("휴식"),
        ("작업");
	`
}
