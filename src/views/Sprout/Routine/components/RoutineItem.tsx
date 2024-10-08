import {useMemo} from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import {eachDayOfInterval, format, subDays} from 'date-fns'
import ScheduleItem from '@/components/ScheduleItem'

interface Props {
  item: RoutineListItem
  moveDetail: (id: number) => void
}
const RoutineItem = ({item, moveDetail}: Props) => {
  const completeListComponent = useMemo(() => {
    const today = new Date()
    const startDate = subDays(today, 6)
    const dateList = eachDayOfInterval({start: startDate, end: today}).reverse()

    return dateList.map((date, index) => {
      const formatDate = format(date, 'yyyy-MM-dd')
      const isActive = item.complete_date_list?.includes(formatDate)

      return (
        <View key={index} style={isActive ? activeCompleteItemStyle : styles.completeItem}>
          <Text style={styles.completeItemText}>{date.getDate()}</Text>
        </View>
      )
    })
  }, [item.complete_date_list])

  return (
    <Pressable style={styles.container} onPress={() => moveDetail(item.todo_id!)}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.completeItemContainer}>
          <View style={styles.completeItemWrapper}>{completeListComponent}</View>
        </View>
      </View>

      <ScheduleItem
        title={item.schedule_title}
        categoryId={item.schedule_category_id}
        time={{startTime: item.schedule_start_time, endTime: item.schedule_end_time}}
        date={{startDate: item.schedule_start_date, endDate: item.schedule_end_date}}
        dayOfWeek={{
          mon: item.schedule_mon,
          tue: item.schedule_tue,
          wed: item.schedule_wed,
          thu: item.schedule_thu,
          fri: item.schedule_fri,
          sat: item.schedule_sat,
          sun: item.schedule_sun
        }}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff'
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
  repeatText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#babfc5'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    flexShrink: 1
  },
  completeItemContainer: {
    gap: 5
  },
  completeItemWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3
  },
  completeItem: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  completeItemText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    color: '#ffffff'
  }
})

const activeCompleteItemStyle = StyleSheet.compose(styles.completeItem, {backgroundColor: '#76d672'})

export default RoutineItem
