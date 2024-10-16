import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, Pressable, View, Text, Image} from 'react-native'
import {differenceInDays, formatISO9075, isEqual, isAfter} from 'date-fns'
import BullseyeIcon from '@/assets/icons/bullseye.svg'
import {getPercentage} from '../util'
import TotalActivityLabels from '../components/TotalActivityLabels'
import {Goal} from '@/@types/goal'

interface Props {
  item: Goal
  moveDetail: (data: Goal) => void
}
const GoalItem = ({item, moveDetail}: Props) => {
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [totalCompleteCount, setTotalCompleteCount] = useState(0)
  const [activityFocusTime, setActivityFocusTime] = useState(0)
  const [activityCompleteCount, setActivityCompleteCount] = useState(0)

  useEffect(() => {
    if (item.scheduleList && item.scheduleList.length > 0) {
      let _totalFocusTime = 0
      let _totalCompleteCount = 0
      let _activityFocusTime = 0
      let _activityCompleteCount = 0

      item.scheduleList.forEach(schedule => {
        _totalFocusTime += schedule.total_focus_time || 0
        _totalCompleteCount += schedule.total_complete_count || 0

        if (schedule.total_focus_time && schedule.total_focus_time > 0) {
          _activityFocusTime += schedule.activity_focus_time || 0
        }
        if (schedule.total_complete_count && schedule.total_complete_count > 0) {
          _activityCompleteCount += schedule.activity_complete_count || 0
        }
      })

      setTotalFocusTime(_totalFocusTime)
      setTotalCompleteCount(_totalCompleteCount)
      setActivityFocusTime(_activityFocusTime)
      setActivityCompleteCount(_activityCompleteCount)
    }
  }, [item.scheduleList])

  const focusTimeString = useMemo(() => {
    if (activityFocusTime < 60) {
      return '0분'
    }

    const hours = Math.floor(activityFocusTime / 3600) // 전체 초에서 시간을 계산
    const minutes = Math.floor((activityFocusTime % 3600) / 60) // 남은 초에서 분을 계산

    const hoursStr = hours === 0 ? '' : `${String(hours)}시간 `
    const minutesStr = minutes === 0 ? '' : `${String(minutes)}분`

    return `${hoursStr}${minutesStr}`
  }, [activityFocusTime])

  const completePercentage = useMemo(() => {
    return getPercentage({total: totalCompleteCount, activity: activityCompleteCount})
  }, [totalCompleteCount, activityCompleteCount])

  const focusTimePercentage = useMemo(() => {
    return getPercentage({total: totalFocusTime, activity: activityFocusTime / 60})
  }, [totalFocusTime, activityFocusTime])

  const handleMoveEdit = useCallback(() => {
    moveDetail(item)
  }, [item, moveDetail])

  // components
  const labelComponent = useMemo(() => {
    if (item.state === 1) {
      return (
        <View style={completeLabelWrapper}>
          <Text style={completeLabelText}>완료</Text>
        </View>
      )
    }

    let today = new Date(formatISO9075(new Date(), {representation: 'date'}))
    let day = null
    let separator: '-' | '+' = '-'

    if (item.end_date) {
      const targetDate = new Date(item.end_date)

      if (isAfter(today, targetDate)) {
        separator = '+'
      }

      if (isEqual(targetDate, today)) {
        day = 'Day'
      } else {
        day = Math.abs(differenceInDays(targetDate, today))
      }
    }

    if (day && item.active_end_date === 1) {
      return (
        <View style={dDayLabelWrapper}>
          <Text style={dDayLabelText}>D</Text>
          <Text style={dDayLabelText}>{separator}</Text>
          <Text style={dDayLabelText}>{day}</Text>
        </View>
      )
    }

    return <></>
  }, [item.state, item.end_date, item.active_end_date])

  return (
    <Pressable style={styles.container} onPress={handleMoveEdit}>
      {labelComponent}

      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.infoWrapper}>
        <Image source={require('@/assets/icons/calendar.png')} style={{width: 16, height: 16}} />
        <Text style={styles.infoText}>{item.start_date || '없음'}</Text>
      </View>

      <View style={styles.infoWrapper}>
        <BullseyeIcon width={16} height={16} />
        <TotalActivityLabels totalCompleteCount={totalCompleteCount} totalFocusTime={totalFocusTime} />
      </View>

      <View style={styles.activityInfoContainer}>
        <View style={styles.activityInfoWrapper}>
          <Text style={styles.activityInfoTitle}>일정 완료</Text>

          <Text style={styles.activityInfoSubTitle}>{Number(activityCompleteCount).toLocaleString()}회</Text>

          <View style={styles.percentageBarContainer}>
            <View style={styles.percentageBarWrapper}>
              <View style={[styles.percentageBar, {width: `${completePercentage}%`, backgroundColor: '#66BB6A'}]} />
            </View>

            <Text style={styles.percentageText}>{completePercentage}%</Text>
          </View>
        </View>

        <View style={styles.activityInfoWrapper}>
          <Text style={styles.activityInfoTitle}>집중한 시간</Text>

          <Text style={styles.activityInfoSubTitle}>{focusTimeString}</Text>

          <View style={styles.percentageBarContainer}>
            <View style={styles.percentageBarWrapper}>
              <View style={[styles.percentageBar, {width: `${focusTimePercentage}%`, backgroundColor: '#FF6B6B'}]} />
            </View>

            <Text style={styles.percentageText}>{focusTimePercentage}%</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    gap: 10
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    alignSelf: 'flex-start'
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Bold'
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  infoText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  },
  remainText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#7c8698'
  },
  activityInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5
  },
  activityInfoWrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    gap: 5
  },
  activityInfoTitle: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#8d9195',
    marginBottom: 5
  },
  activityInfoSubTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#424242'
  },
  percentageBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  percentageBarWrapper: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  percentageBar: {
    height: 10,
    borderRadius: 10
  },
  percentageText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    color: '#424242'
  }
})

const dDayLabelWrapper = StyleSheet.compose(styles.labelWrapper, {backgroundColor: '#1E90FF20'})
const dDayLabelText = StyleSheet.compose(styles.labelText, {color: '#1E90FF'})
const completeLabelWrapper = StyleSheet.compose(styles.labelWrapper, {backgroundColor: '#32CD3220'})
const completeLabelText = StyleSheet.compose(styles.labelText, {color: '#32CD32'})

export default GoalItem
