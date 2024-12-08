export const getUser = () => {
  return `SELECT * FROM USER`
}

export const setUser = () => {
  return `
		INSERT INTO "USER" ("user_id")
		SELECT ?
		WHERE NOT EXISTS (SELECT 1 FROM "USER")
	`
}

export const updateDisplayModeQuery = () => {
  return `UPDATE USER SET display_mode = ?`
}
