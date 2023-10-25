import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import TimetableCategory from './TimetableCategory'

import TrashIcon from '@/assets/icons/trash.svg'

import {Swipeable, RectButton} from 'react-native-gesture-handler'

import {TimeTableCategory} from '@/types/timetable'

interface Props {
  value: TimeTableCategory
  activeCategory: TimeTableCategory
  onChangeText: Function
  onFocus?: Function
  onBlur?: Function
  onEdit: Function
  onClose: Function
  onSubmit: Function
  setBackdropPressBehavior: Function
}
const TimeTableCategoryItem = ({
  value,
  activeCategory,
  onChangeText,
  onFocus,
  onBlur,
  onEdit,
  onClose,
  onSubmit,
  setBackdropPressBehavior
}: Props) => {
  const END_POSITION = 80

  const title = React.useMemo(() => {
    if (activeCategory.timetable_category_id === value.timetable_category_id) {
      return activeCategory.title
    }
    return value.title
  }, [activeCategory, value])

  const isEdit = React.useMemo(() => {
    return activeCategory.timetable_category_id === value.timetable_category_id
  }, [value, activeCategory])

  const disabled = React.useMemo(() => {
    return !isEdit && !!activeCategory.timetable_category_id
  }, [isEdit, activeCategory])

  const handleEdit = () => {
    onEdit(value)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [END_POSITION, 0]
    })

    return (
      <View style={{width: END_POSITION}}>
        <Animated.View style={[styles.deleteButtonWrapper, {transform: [{translateX: trans}]}]}>
          <RectButton style={styles.deleteButton}>
            <TrashIcon stroke="#fff" />
          </RectButton>
        </Animated.View>
      </View>
    )
  }

  return (
    <View>
      {isEdit || disabled ? (
        <TimetableCategory
          value={title}
          isEdit={isEdit}
          disabled={disabled}
          setBackdropPressBehavior={setBackdropPressBehavior}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onEdit={handleEdit}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      ) : (
        <Swipeable friction={2} rightThreshold={40} renderRightActions={renderRightActions}>
          <TimetableCategory
            value={title}
            isEdit={isEdit}
            disabled={disabled}
            setBackdropPressBehavior={setBackdropPressBehavior}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            onEdit={handleEdit}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </Swipeable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  deleteButtonWrapper: {
    flex: 1
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF2D1F',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TimeTableCategoryItem
