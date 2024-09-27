import {useMemo} from 'react'
import {StyleProp, ViewStyle, StyleSheet, View, Text} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import {getTimeString} from '../util'
import {GoalSchedule} from '@/@types/goal'

interface Props {
  item: GoalSchedule
}
const GoalScheduleItem = ({item}: Props) => {
  const focusTimeInfo = useMemo(() => {
    const totalFocusTime = item.total_focus_time || 0
    const activityFocusTime = (item.activity_focus_time || 0) / 60

    const totalTimeString = getTimeString(totalFocusTime)
    const activityTimeString = getTimeString(activityFocusTime)
    let percentage = 0

    if (totalFocusTime > 0) {
      percentage = Math.trunc((activityFocusTime / totalFocusTime) * 100) || 0
    }

    if (percentage > 100) {
      percentage = 100
    }

    return {
      percentage,
      desc: `${activityTimeString} / ${totalTimeString}`
    }
  }, [item.activity_focus_time, item.total_focus_time])

  const completeCountInfo = useMemo(() => {
    const totalCompleteCount = item.total_complete_count || 0
    const activityCompleteCount = item.activity_complete_count || 0
    let percentage = 0

    if (totalCompleteCount > 0) {
      percentage = Math.trunc((activityCompleteCount / totalCompleteCount) * 100) || 0
    }

    if (percentage > 100) {
      percentage = 100
    }

    return {
      percentage,
      desc: `${activityCompleteCount}회 / ${totalCompleteCount}회`
    }
  }, [item.activity_complete_count, item.total_complete_count])

  const focusTimeStatsBarStyle: StyleProp<ViewStyle> = useMemo(() => {
    return [styles.statsBar, {width: `${focusTimeInfo.percentage}%`, backgroundColor: '#FF6B6B'}]
  }, [focusTimeInfo.percentage])

  const completeCountStatsBarStyle: StyleProp<ViewStyle> = useMemo(() => {
    return [styles.statsBar, {width: `${completeCountInfo.percentage}%`, backgroundColor: '#66BB6A'}]
  }, [completeCountInfo.percentage])

  return (
    <View style={styles.container}>
      <ScheduleItem
        title={item.title}
        categoryId={item.schedule_category_id}
        time={{startTime: item.start_time, endTime: item.end_time}}
        date={{startDate: item.start_date, endDate: item.end_date}}
        dayOfWeek={{
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun
        }}
      />

      <View style={styles.formContainer}>
        <View>
          <View style={styles.statsContainer}>
            <View style={styles.statsWrapper}>
              <Text style={styles.label}>목표 집중 시간</Text>

              <View style={styles.statsBarWrapper}>
                <View style={focusTimeStatsBarStyle} />
              </View>
            </View>
            <Text style={styles.statsText}>{focusTimeInfo.percentage}%</Text>
          </View>

          <Text style={styles.subLabel}>{focusTimeInfo.desc}</Text>
        </View>

        <View>
          <View style={styles.statsContainer}>
            <View style={styles.statsWrapper}>
              <Text style={styles.label}>목표 완료 횟수</Text>

              <View style={styles.statsBarWrapper}>
                <View style={completeCountStatsBarStyle} />
              </View>
            </View>
            <Text style={styles.statsText}>{completeCountInfo.percentage}%</Text>
          </View>

          <Text style={styles.subLabel}>{completeCountInfo.desc}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 10
  },
  formContainer: {
    marginTop: 20,
    gap: 20,
    paddingLeft: 10
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  subLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#babfc5'
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-end',
    marginBottom: 3
  },
  statsWrapper: {
    flex: 1
  },
  statsBarWrapper: {
    width: '100%',
    borderRadius: 7,
    height: 10,
    marginTop: 5,
    backgroundColor: '#f5f6f8'
  },
  statsBar: {
    borderRadius: 7,
    height: 10,
    backgroundColor: 'red'
  },
  statsText: {
    width: 75,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  }
})

export default GoalScheduleItem
