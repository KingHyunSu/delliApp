import {StyleSheet, Pressable, View, Text} from 'react-native'
import RoutineCompleteBar from '@/components/RoutineCompleteBar'

interface Props {
  item: Routine
  moveDetail: (id: number) => void
}
const RoutineItem = ({item, moveDetail}: Props) => {
  return (
    <Pressable style={styles.container} onPress={() => moveDetail(item.todo_id)}>
      <View style={styles.titleWrapper}>
        <View style={styles.scheduleTitleWrapper}>
          <Text style={styles.scheduleTitle}>{item.schedule_title}</Text>
          <Text style={styles.scheduleTitle}>할 때</Text>
        </View>

        <Text style={styles.routineTitle}>{item.title}</Text>
      </View>

      <RoutineCompleteBar completeDateList={item.complete_date_list} gap={5} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 15,
    paddingTop: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff'
  },
  titleWrapper: {
    flex: 1,
    gap: 5
  },
  scheduleTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  routineTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242'
  }
})

export default RoutineItem
