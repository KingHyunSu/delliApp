import {useMemo} from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import {eachDayOfInterval, format, subDays} from 'date-fns'

interface Props {
  item: Todo
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
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.completeItemContainer}>
        <View style={styles.completeItemWrapper}>{completeListComponent}</View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff'
  },
  repeatText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#babfc5'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
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
