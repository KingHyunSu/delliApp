import {StyleSheet, Pressable, View, Text} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import RoutineCompleteBar from '@/components/RoutineCompleteBar'

interface Props {
  item: RoutineListItem
  moveDetail: (id: number) => void
}
const RoutineItem = ({item, moveDetail}: Props) => {
  return (
    <Pressable style={styles.container} onPress={() => moveDetail(item.todo_id!)}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.completeItemContainer}>
          <RoutineCompleteBar completeDateList={item.complete_date_list} />
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
  }
})

export default RoutineItem
