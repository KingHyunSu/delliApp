export const getColorListQuery = () => {
  return 'SELECT * FROM COLOR'
}

export const setColorQuery = () => {
  return `INSERT INTO COLOR (color, create_date) VALUES (?, (SELECT datetime('now', 'localtime')))`
}
