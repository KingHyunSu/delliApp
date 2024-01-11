import React from 'react'
import {StyleSheet, FlatList, Pressable, View, Text} from 'react-native'

import {useSetRecoilState} from 'recoil'
import {scheduleTodoState} from '@/store/schedule'
import {showEditTodoModalState} from '@/store/modal'

import MoreIcon from '@/assets/icons/more_horiz.svg'

interface Props {
  data: Todo[]
}
interface ItemProps {
  item: Todo
  showEditModal: Function
}
const ScheduleTodo = ({item, showEditModal}: ItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemWrapper}>
        <Pressable style={styles.checkButtonWrapper}>
          <View style={styles.checkButton} />
        </Pressable>
        <Text style={styles.text}>{item.title}</Text>
      </View>

      <Pressable style={styles.moreButton} onPress={() => showEditModal(item)}>
        <MoreIcon width={18} height={18} fill="#babfc5" />
      </Pressable>
    </View>
  )
}

const ScheduleTodoList = ({data}: Props) => {
  const scheduleTodo = useSetRecoilState(scheduleTodoState)
  const setShowEditTodoModal = useSetRecoilState(showEditTodoModalState)

  const showEditModal = (item: Todo) => {
    scheduleTodo(item)
    setShowEditTodoModal(true)
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => String(index)}
      style={styles.container}
      renderItem={({item}) => <ScheduleTodo item={item} showEditModal={showEditModal} />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkButtonWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center'
  },
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 7
  },
  moreButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  text: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  }
})

export default ScheduleTodoList
