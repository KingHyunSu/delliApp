import {useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, View, Text, Image} from 'react-native'
import {differenceInDays, formatISO9075, isEqual, isAfter} from 'date-fns'
import BullseyeIcon from '@/assets/icons/bullseye.svg'
import {GetGoalResponse} from '@/repository/types/goal'

interface Props {
  item: GetGoalResponse
  moveDetail: (id: number | null) => void
}
const GoalItem = ({item, moveDetail}: Props) => {
  const completeCountInfoWrapperStyle = useMemo(() => {
    let backgroundColor = '#f9f9f9'
    let borderColor = '#f9f9f9'

    // if (item.complete_state === 1) {
    //   backgroundColor = '#ffffff'
    //   borderColor = '#f1f1f1'
    // }

    return [styles.activityInfoWrapper, {backgroundColor, borderColor}]
  }, [])

  const focusTimeInfoWrapperStyle = useMemo(() => {
    let backgroundColor = '#f9f9f9'
    let borderColor = '#f9f9f9'

    // if (item.focus_time_state === 1) {
    //   backgroundColor = '#ffffff'
    //   borderColor = '#f1f1f1'
    // }

    return [styles.activityInfoWrapper, {backgroundColor, borderColor}]
  }, [])

  const getFocusTime = useCallback((time: number | null) => {
    if (!time || time < 60) {
      return '0분'
    }

    const hours = Math.floor(time / 3600) // 전체 초에서 시간을 계산
    const minutes = Math.floor((time % 3600) / 60) // 남은 초에서 분을 계산

    const hoursStr = hours === 0 ? '' : `${String(hours)}시간 `
    const minutesStr = minutes === 0 ? '' : `${String(minutes)}분`

    return `${hoursStr}${minutesStr}`
  }, [])

  const handleMoveEdit = useCallback(() => {
    moveDetail(item.goal_id)
  }, [item.goal_id, moveDetail])

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

  const goalTextComponent = useMemo(() => {
    const totalFocusTime = item.total_focus_time || 0
    const totalCompleteCount = item.total_complete_count || 0

    const hours = Math.floor(totalFocusTime / 60)
    const minutes = Math.floor(totalFocusTime % 60)

    let hoursStr = ''
    let minutesStr = ''

    if (hours > 0) {
      hoursStr = `${hours}시간 `
    }
    if (minutes > 0) {
      minutesStr = `${minutes}분`
    }

    let timeStr = `${hoursStr}${minutesStr}`
    if (hours === 0 && minutes === 0) {
      timeStr = '0분'
    }

    return `총 ${totalCompleteCount}회 / ${timeStr}`
  }, [item.total_focus_time, item.total_complete_count])

  // const remainComponent = useMemo(() => {
  //   let remainCompleteCount = null
  //   let remainActiveTime = null
  //   let separator = null
  //
  //   if (item.complete_state === 1 && item.complete_count) {
  //     const remainCount = item.complete_count - (item.total_complete_count || 0)
  //     remainCompleteCount = `${remainCount}회`
  //   }
  //
  //   if (item.focus_time_state === 1 && item.focus_time) {
  //     const goalTime = item.focus_time * 60
  //     const remainTime = goalTime - (item.total_focus_time || 0)
  //
  //     remainActiveTime = getFocusTime(remainTime)
  //   }
  //
  //   if (remainCompleteCount && remainActiveTime) {
  //     separator = ' / '
  //   }
  //
  //   if (remainCompleteCount || remainActiveTime) {
  //     return (
  //       <Text style={styles.remainText}>
  //         {remainCompleteCount}
  //         {separator}
  //         {remainActiveTime} 남음
  //       </Text>
  //     )
  //   }
  //
  //   return <></>
  // }, [
  //   item.complete_state,
  //   item.complete_count,
  //   item.total_complete_count,
  //   item.focus_time_state,
  //   item.focus_time,
  //   item.total_focus_time,
  //   getFocusTime
  // ])

  return (
    <Pressable style={styles.container} onPress={handleMoveEdit}>
      {labelComponent}

      <Text style={styles.title}>{item.title}</Text>
      {/*{remainComponent}*/}

      <View style={styles.infoWrapper}>
        <Image source={require('@/assets/icons/calendar.png')} style={{width: 16, height: 16}} />
        <Text style={styles.infoText}>{item.start_date || '없음'}</Text>
      </View>

      <View style={styles.infoWrapper}>
        <BullseyeIcon width={16} height={16} />
        <Text style={styles.infoText}>{goalTextComponent}</Text>
      </View>

      <View style={styles.activityInfoContainer}>
        <View style={completeCountInfoWrapperStyle}>
          <Text style={styles.activityInfoTitle}>일정 완료</Text>

          <Text style={styles.activityInfoSubTitle}>{Number(item.activity_complete_count).toLocaleString()}회</Text>
        </View>

        <View style={focusTimeInfoWrapperStyle}>
          <Text style={styles.activityInfoTitle}>집중한 시간</Text>

          <Text style={styles.activityInfoSubTitle}>{getFocusTime(item.activity_focus_time)}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    gap: 15
  },
  activityInfoTitle: {
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
    color: '#8d9195'
  },
  activityInfoSubTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242'
  }
})

const dDayLabelWrapper = StyleSheet.compose(styles.labelWrapper, {backgroundColor: '#1E90FF20'})
const dDayLabelText = StyleSheet.compose(styles.labelText, {color: '#1E90FF'})
const completeLabelWrapper = StyleSheet.compose(styles.labelWrapper, {backgroundColor: '#32CD3220'})
const completeLabelText = StyleSheet.compose(styles.labelText, {color: '#32CD32'})

export default GoalItem
