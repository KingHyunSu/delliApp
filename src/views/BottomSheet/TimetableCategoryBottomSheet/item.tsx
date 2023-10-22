import React from 'react'
import {Animated, StyleSheet, Pressable, View} from 'react-native'
import {TextInput} from 'react-native-gesture-handler'

import EditIcon from '@/assets/icons/edit.svg'
import Edit2Icon from '@/assets/icons/edit2.svg'
import CancleIcon from '@/assets/icons/cancle.svg'
import TrashIcon from '@/assets/icons/trash.svg'

import {Swipeable, RectButton} from 'react-native-gesture-handler'

import {TimeTableCategory} from '@/types/timetable'

interface Props {
  item: TimeTableCategory
  activeCategory: TimeTableCategory | null
  setActiveCategory: Function
  setBackdropPressBehavior: Function
}
const TimeTableCategoryItem = ({item, activeCategory, setActiveCategory, setBackdropPressBehavior}: Props) => {
  const END_POSITION = 80

  const inputRef = React.useRef<TextInput>(null)

  const [title, setTitle] = React.useState(item.title)

  const isEdit = React.useMemo(() => {
    return !!activeCategory && activeCategory.timetable_category_id === item.timetable_category_id
  }, [item, activeCategory])

  const handleFocus = () => {
    console.log('123')
    setBackdropPressBehavior('none')
  }

  const handleBlur = () => {
    console.log('456')
    setBackdropPressBehavior('close')
  }

  const handleSelect = () => {
    if (isEdit) {
      inputRef.current?.focus()
      return
    }
  }

  const handleEdit = () => {
    setActiveCategory(item)
  }

  const handleCancle = () => {
    setTitle(item.title)
    setActiveCategory(null)
  }

  const handleSave = () => {
    setActiveCategory({...item, title})
  }

  React.useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus()
    } else {
      setTitle(item.title)
    }
  }, [isEdit, item])

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
    <Swipeable friction={2} rightThreshold={40} renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Pressable style={styles.wrapper} onPress={handleSelect}>
          <TextInput
            ref={inputRef}
            value={title}
            style={styles.titleText}
            editable={isEdit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={setTitle}
          />

          {isEdit ? (
            <View style={styles.editButtonWrapper}>
              <Pressable style={styles.button} onPress={handleSave}>
                <Edit2Icon stroke="#242933" />
              </Pressable>
              <Pressable style={styles.button} onPress={handleCancle}>
                <CancleIcon stroke="#242933" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleEdit}>
              <EditIcon stroke="#242933" />
            </Pressable>
          )}
        </Pressable>
      </View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D2D2D4'
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editButtonWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'GmarketSansTTFMedium'
    // color: '#7c8698'
  },
  activeText: {
    // color: '#555'
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
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
