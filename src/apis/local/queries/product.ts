export const setDefaultBackgroundQuery = () => {
  return `
    INSERT INTO background (background_id, file_name, display_mode, background_color, sub_color, accent_color)
    SELECT 1, 'beige.png', 1, '#F8F4EC', '#F3EBDE', '#424242'
    WHERE NOT EXISTS (SELECT 1 FROM background WHERE background_id = 1)
  `
}

export const getDownloadedBackgroundListQuery = () => {
  return `SELECT background_id, file_name, display_mode, background_color, sub_color, accent_color FROM background`
}

export const setDownloadBackgroundQuery = () => {
  return `
    INSERT INTO background (background_id, file_name, display_mode, background_color, sub_color, accent_color) 
    VALUES (?, ?, ?, ?, ?, ?)
  `
}

export const getActiveBackgroundQuery = () => {
  return `
    SELECT 
      background_id, 
      file_name, 
      display_mode, 
      background_color, 
      sub_color,
      accent_color 
    FROM background 
    WHERE background_id = ?
  `
}
