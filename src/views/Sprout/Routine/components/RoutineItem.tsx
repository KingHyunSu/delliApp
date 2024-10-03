import {StyleSheet, Pressable, View, Text} from 'react-native'

interface Props {
  item: Todo
  moveDetail: (id: number) => void
}
const RoutineItem = ({item, moveDetail}: Props) => {
  return (
    <Pressable style={styles.container} onPress={() => moveDetail(item.todo_id)}>
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.completeItemContainer}>
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
