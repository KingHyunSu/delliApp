import {useMemo} from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import {startOfWeek} from 'date-fns'
import {Routine} from '@/@types/routine'

interface Props {
  item: Routine
  moveDetail: (id: number) => void
}
const RoutineItem = ({item, moveDetail}: Props) => {
  const repeatTypeString = useMemo(() => {
    switch (item.routine_type) {
      case 1:
        return '매일'
      case 2:
        return '이틀에'
      case 3:
        return '일주일에'
      default:
        return ''
    }
  }, [item.routine_type])

  const repeatCountString = useMemo(() => {
    switch (item.routine_count) {
      case 1:
        return '한 번'
      case 2:
        return '두 번'
      case 3:
        return '세 번'
      case 4:
        return '네 번'
      case 5:
        return '다섯 번'
      case 6:
        return '여섯 번'
      default:
        return ''
    }
  }, [item.routine_count])

  const repeatCompleteItemList = useMemo(() => {
    const startDate = startOfWeek(new Date(), {weekStartsOn: 1})
    const startDateUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0))

    const completeCount = item.complete_date_list.reduce((acc, cur) => {
      if (new Date(cur) >= startDateUTC) {
        return acc + 1
      }

      return acc
    }, 0)

    const result = []

    for (let i = 1; i <= item.routine_count; i++) {
      const isComplete = i <= completeCount
      const backgroundColor = isComplete ? '#FFD54F' : '#f5f6f8'
      result.push(<View key={i} style={[styles.subCompleteItem, {backgroundColor}]} />)
    }

    return result
  }, [item.complete_date_list])

  return (
    <Pressable style={styles.container} onPress={() => moveDetail(item.routine_id)}>
      <View style={styles.titleWrapper}>
        <Text style={styles.repeatText}>
          {repeatTypeString} {repeatCountString}{' '}
        </Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <View style={styles.completeItemContainer}>
        {item.routine_count && <View style={styles.completeSubItemWrapper}>{repeatCompleteItemList}</View>}

        <View style={styles.completeItemWrapper}>
          <View style={styles.completeItem} />
          <View style={styles.completeItem} />
          <View style={styles.completeItem} />
          <View style={styles.completeItem} />
          <View style={styles.completeItem} />
          <View style={styles.completeItem} />
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
  titleWrapper: {
    flexDirection: 'row'
  },
  repeatText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#babfc5'
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  },
  completeItemContainer: {
    gap: 5
  },
  completeItemWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5
  },
  completeSubItemWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3
  },
  subCompleteItem: {
    width: 12,
    height: 5,
    borderRadius: 3
  },
  completeItem: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#76d672'
    // backgroundColor: '#f5f6f8'
  }
})

export default RoutineItem
