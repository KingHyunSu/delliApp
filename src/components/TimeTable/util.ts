import {colorKit} from 'reanimated-color-picker'

export const getScheduleColorList = (
  scheduleList: Schedule[],
  colorThemeItemList: ColorThemeItem[] | null
): {backgroundColor: string; textColor: string}[] => {
  if (!colorThemeItemList) {
    return scheduleList.map(item => {
      return {backgroundColor: item.background_color, textColor: item.text_color}
    })
  }
  if (colorThemeItemList.length === 0) {
    return scheduleList.map(_ => {
      return {backgroundColor: '#ffffff', textColor: '#000000'}
    })
  }

  return [...scheduleList]
    .sort((a, b) => a.start_time - b.start_time)
    .map((item, index) => {
      const backgroundColor = colorThemeItemList[index % colorThemeItemList.length].color
      const textColor = colorKit.isDark(backgroundColor) ? '#ffffff' : '#000000'

      return {
        backgroundColor,
        textColor
      }
    })
}
