// 날짜 가져오기
export const getDateList = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  // 마지막 날 가져오기
  const lastDay = new Date(year, month + 1, 0).getDate()
  const dateList = []

  for (let i = 0; i < lastDay; i++) {
    dateList.push({
      year,
      month: month + 1,
      day: i + 1,
      current: true
    })
  }

  return dateList
}

// 남은 이전 날짜 가져오기
export const getRemainPrevDateList = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  // 첫 번째 요일
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  // 이전 달의 마지막 일
  const prevMonthDate = new Date(year, month, 0)

  const remainPrevDateList = []

  for (let i = 1; i <= firstDayOfWeek; i++) {
    remainPrevDateList.push({
      year: prevMonthDate.getFullYear(),
      month: prevMonthDate.getMonth() + 1,
      day: prevMonthDate.getDate() - firstDayOfWeek + i,
      current: false
    })
  }

  return remainPrevDateList
}
// 남은 다음 날짜 가져오기
export const getRemainNextDateList = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const lastDay = new Date(year, month + 1, 0).getDate()

  const remainDayCount = 42 - (firstDayOfWeek + lastDay)

  let nextYear = year
  let nextMonth = month + 1

  if (nextMonth > 11) {
    nextYear += 1
    nextMonth = 11
  }

  const remainNextDateList = []

  for (let i = 1; i <= remainDayCount; i++) {
    remainNextDateList.push({
      year: nextYear,
      month: nextMonth + 1,
      day: i,
      current: false
    })
  }

  return remainNextDateList
}
