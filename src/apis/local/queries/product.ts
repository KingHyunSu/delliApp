export const getDownloadThemeListQuery = () => {
  return `SELECT * FROM THEME`
}

export const getActiveThemeQuery = () => {
  return `SELECT * FROM THEME WHERE theme_id = ?`
}

export const setDefaultThemeQuery = () => {
  return `
    INSERT INTO THEME (theme_id, file_name, color1, color2, color3, color4, color5, color6, color7, color8)
    SELECT 1, 'white.png', '#ffffff', '#f5f6f8', '#424242', '', '#ffffff', '#f9f9f9', '#424242', '#babfc5'
    WHERE NOT EXISTS (SELECT 1 FROM THEME WHERE theme_id = 1)
	`
}

export const setThemeQuery = () => {
  return `
    INSERT INTO THEME (theme_id, file_name, color1, color2, color3, color4, color5, color6, color7, color8) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
}
