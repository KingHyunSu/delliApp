import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

import {addMonths} from 'date-fns'

interface Props {
  currentDate: Date | null
  onChange: Function
}
const ControlBar = ({currentDate, onChange}: Props) => {
  const dateText = React.useMemo(() => {
    if (!currentDate) {
      return ''
    }

    return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`
  }, [currentDate])

  const handlePrev = React.useCallback(() => {
    if (currentDate) {
      const calcDate = addMonths(currentDate, -1)
      onChange(calcDate)
    }
  }, [currentDate, onChange])

  const handleNext = React.useCallback(() => {
    if (currentDate) {
      const calcDate = addMonths(currentDate, 1)
      onChange(calcDate)
    }
  }, [currentDate, onChange])

  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={handlePrev}>
        <LeftArrowIcon stroke="#424242" />
      </Pressable>

      <Text style={styles.text}>{dateText}</Text>

      <Pressable style={styles.arrowButton} onPress={handleNext}>
        <RightArrowIcon stroke="#424242" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 7
  },
  arrowButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#424242'
  }
})

export default ControlBar
