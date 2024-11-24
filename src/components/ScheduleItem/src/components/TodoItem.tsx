import {useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, Text, View} from 'react-native'
import debounce from 'lodash.debounce'
import CheckIcon from '@/assets/icons/check.svg'
import MoreIcon from '@/assets/icons/more_horiz.svg'

interface Props {
  value: ScheduleTodo
  activeTheme: ActiveTheme
  moveEdit: (value: ScheduleTodo) => void
  onChange: (isCompleted: boolean, value: ScheduleTodo) => void
}
const TodoItem = ({value, activeTheme, moveEdit, onChange}: Props) => {
  const isCompleted = useMemo(() => {
    return !!value.complete_date
  }, [value.complete_date])

  const checkButtonStyle = useMemo(() => {
    return isCompleted ? activeCheckButtonStyle : styles.checkButton
  }, [isCompleted])

  const checkButtonColor = useMemo(() => {
    return isCompleted ? '#ffffff' : '#eeeded'
  }, [isCompleted])

  const debounceChanged = useMemo(
    () =>
      debounce(() => {
        onChange(!isCompleted, value)
      }, 200),
    [isCompleted, value, onChange]
  )

  const handleMoveEdit = useCallback(() => {
    moveEdit(value)
  }, [moveEdit, value])

  const handleChanged = useCallback(() => {
    debounceChanged()
  }, [debounceChanged])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable style={styles.checkButtonWrapper} onPress={handleChanged}>
          <View style={checkButtonStyle}>
            <CheckIcon width={16} height={16} strokeWidth={3} stroke={checkButtonColor} />
          </View>
        </Pressable>

        <Pressable style={styles.modalButtonWrapper} onPress={handleMoveEdit}>
          <Text style={[styles.title, {color: activeTheme.color3}]}>{value.title}</Text>

          <View style={styles.moreButton}>
            <MoreIcon width={18} height={18} fill="#babfc5" />
          </View>
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

const activeCheckButtonStyle = StyleSheet.compose(styles.checkButton, {
  borderColor: '#76d672',
  backgroundColor: '#76d672'
})

export default TodoItem
