import {useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import debounce from 'lodash.debounce'
import RoutineCompleteBar from '@/components/RoutineCompleteBar'
import CheckIcon from '@/assets/icons/check.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

export interface ChangeTodoCompleteArguments {
  todoId: number
  completeId: number | null
  scheduleId: number
}
interface Props {
  todoId: number
  completeId: number | null
  scheduleId: number
  title: string
  completeDateList?: string[]
  openEditModal?: (params: EditTodoForm) => void
  onChange: (isCompleted: boolean, changeTodoCompleteArguments: ChangeTodoCompleteArguments) => void
}
const TodoItem = ({todoId, completeId, scheduleId, title, completeDateList, openEditModal, onChange}: Props) => {
  const isCompleted = useMemo(() => {
    return !!completeId
  }, [completeId])

  const checkButtonStyle = useMemo(() => {
    if (isCompleted) {
      if (completeDateList) {
        return activeRoutineCheckButtonStyle
      } else {
        return activeTodoCheckButtonStyle
      }
    }

    return styles.checkButton
  }, [isCompleted])

  const checkButtonColor = useMemo(() => {
    return isCompleted ? '#ffffff' : '#eeeded'
  }, [isCompleted])

  const debounceChanged = useMemo(
    () =>
      debounce(() => {
        onChange(!isCompleted, {todoId, completeId, scheduleId})
      }, 200),
    [isCompleted, todoId, completeId, scheduleId, onChange]
  )

  const handleChanged = useCallback(() => {
    debounceChanged()
  }, [debounceChanged])

  const handleShowEditModal = useCallback(() => {
    if (openEditModal) {
      openEditModal({todo_id: todoId, title, schedule_id: scheduleId})
    }
  }, [todoId, title, scheduleId, openEditModal])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable style={styles.checkButtonWrapper} onPress={handleChanged}>
          <View style={checkButtonStyle}>
            <CheckIcon width={16} height={16} strokeWidth={3} stroke={checkButtonColor} />
          </View>
        </Pressable>

        <Pressable style={styles.modalButtonWrapper} onPress={handleShowEditModal}>
          <Text style={styles.title}>{title}</Text>

          {completeDateList ? (
            <RoutineCompleteBar completeDateList={completeDateList} itemSize={20} />
          ) : (
            <View style={styles.moreButton}>
              <MoreIcon width={18} height={18} fill="#babfc5" />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242',
    flexShrink: 1
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
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtonWrapper: {
    flex: 1,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  moreButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
})

const activeTodoCheckButtonStyle = StyleSheet.compose(styles.checkButton, {
  borderColor: '#76d672',
  backgroundColor: '#76d672'
})
const activeRoutineCheckButtonStyle = StyleSheet.compose(styles.checkButton, {
  borderColor: '#FFCA28',
  backgroundColor: '#FFCA28'
})

export default TodoItem
