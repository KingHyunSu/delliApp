import React from 'react'
import {StyleSheet, Pressable, View} from 'react-native'

import {BottomSheetTextInput} from '@gorhom/bottom-sheet'
import {TextInput} from 'react-native-gesture-handler'

import EditIcon from '@/assets/icons/edit.svg'
import Edit2Icon from '@/assets/icons/edit2.svg'
import CancleIcon from '@/assets/icons/cancle.svg'

import Animated, {useSharedValue, useAnimatedStyle} from 'react-native-reanimated'

interface Props {
  value: string
  isEdit: boolean
  disabled?: boolean
  setBackdropPressBehavior: Function
  onChangeText: Function
  onFocus?: Function
  onBlur?: Function
  onEdit?: Function
  onClose: Function
  onSubmit: Function
}
const TimetableCategory = ({
  value,
  isEdit,
  disabled = false,
  setBackdropPressBehavior,
  onChangeText,
  onFocus,
  onBlur,
  onEdit,
  onClose,
  onSubmit
}: Props) => {
  const inputRef = React.useRef<TextInput>(null)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    if (disabled) {
      opacity.value = 0.5
    } else {
      opacity.value = 1
    }
  }, [disabled])

  React.useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus()
    }
  }, [isEdit])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const handleFocus = () => {
    if (onFocus) {
      onFocus()
    }

    setBackdropPressBehavior('none')
  }

  const handleBlur = () => {
    if (onBlur) {
      onBlur()
    }

    setBackdropPressBehavior('close')
  }

  const handleSelect = () => {
    if (disabled) {
      // [todo] add haptic
      return
    }
    if (isEdit) {
      inputRef.current?.focus()
      return
    }
  }

  const handleEdit = () => {
    if (disabled) {
      // [todo] add haptic
      return
    }

    if (onEdit) {
      onEdit()
    }
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable style={styles.wrapper} onPress={handleSelect}>
        <BottomSheetTextInput
          ref={inputRef}
          value={value}
          style={styles.titleText}
          editable={isEdit}
          placeholder="카테고리명"
          placeholderTextColor="#c3c5cc"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={e => onChangeText(e)}
        />

        {isEdit ? (
          <View style={styles.editButtonWrapper}>
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Edit2Icon stroke="#242933" />
            </Pressable>
            <Pressable style={styles.button} onPress={handleClose}>
              <CancleIcon stroke="#242933" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.button} onPress={handleEdit}>
            <EditIcon stroke="#242933" />
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  disabled: {
    opacity: 0.5
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleText: {
    paddingVertical: 25,
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#000'
  },
  editButtonWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
})
export default TimetableCategory
