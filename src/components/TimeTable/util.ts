export const getScheduleBackgroundColor = (
  schedule: EditScheduleForm | Schedule,
  scheduleList: Schedule[],
  colorThemeDetail: ColorThemeDetail
) => {
  const targetIndex = scheduleList.findIndex(item => item.schedule_id === schedule.schedule_id)
  const colorThemeItemList = colorThemeDetail.color_theme_item_list
  const isActiveColorTheme = colorThemeDetail.is_active_color_theme

  if (isActiveColorTheme) {
    return colorThemeItemList[targetIndex % colorThemeItemList.length].background_color
  }
  return schedule.background_color
}

export const getScheduleTextColor = (
  schedule: EditScheduleForm,
  scheduleList: Schedule[],
  colorThemeDetail: ColorThemeDetail
) => {
  const targetIndex = scheduleList.findIndex(item => item.schedule_id === schedule.schedule_id)
  const colorThemeItemList = colorThemeDetail.color_theme_item_list
  const isActiveColorTheme = colorThemeDetail.is_active_color_theme

  if (isActiveColorTheme) {
    return colorThemeItemList[targetIndex % colorThemeItemList.length].text_color
  }
  return schedule.text_color
}
