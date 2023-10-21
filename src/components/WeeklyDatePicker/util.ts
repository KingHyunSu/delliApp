import {addDays, eachDayOfInterval} from 'date-fns'

export const getWeeklyDateList = (targetDate: Date) => {
  const dayOfWeekIndex = targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1

  const startDate = addDays(targetDate, -dayOfWeekIndex)
  const endDate = addDays(targetDate, 6 - dayOfWeekIndex)

  return eachDayOfInterval({start: startDate, end: endDate})
}
