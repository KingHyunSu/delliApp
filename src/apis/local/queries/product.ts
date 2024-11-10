export const getDownloadThemeListQuery = () => {
  return `SELECT * FROM THEME`
}

export const getActiveThemeQuery = () => {
  return `SELECT * FROM THEME WHERE theme_id = ?`
}

export const setDefaultThemeQuery = () => {
  return `
    INSERT INTO THEME (theme_id, file_name, main_color, sub_color, text_color)
    SELECT 1, 'white.png', '#ffffff', '#f5f6f8', '#424242'
    WHERE NOT EXISTS (SELECT 1 FROM THEME WHERE theme_id = 1)
	`
}

export const setThemeQuery = () => {
  return `
    INSERT INTO THEME (theme_id, file_name, main_color, sub_color, text_color) 
    VALUES (?, ?, ?, ?, ?)
  `
}
