export const getColorListQuery = () => {
  return 'SELECT * FROM COLOR'
}

export const setColorQuery = () => {
  return `INSERT INTO COLOR (color, create_date) VALUES (?, (SELECT datetime('now', 'localtime')))`
}

export const deleteColorQuery = () => {
  return `DELETE FROM COLOR WHERE color_id = ?`
}
