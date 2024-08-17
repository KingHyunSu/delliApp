export const getUser = () => {
  const query = `
		SELECT * FROM USER
	`

  return query
}

export const setUser = () => {
  const query = `
		INSERT INTO "USER" ("user_id")
		SELECT ?
		WHERE NOT EXISTS (SELECT 1 FROM "USER")
	`

  return query
}
