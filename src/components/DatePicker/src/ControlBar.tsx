import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

import {addMonths} from 'date-fns'

interface Props {
  currentDate: Date
  onChange: Function
}
const ControlBar = ({currentDate, onChange}: Props) => {
  const handlePrev = () => {
    const calcDate = addMonths(currentDate, -1)
    onChange(calcDate)
  }

  const handleNext = () => {
    const calcDate = addMonths(currentDate, 1)
    onChange(calcDate)
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={handlePrev}>
        <LeftArrowIcon stroke="#242933" />
      </Pressable>

      <Text style={styles.text}>{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</Text>

      <Pressable style={styles.arrowButton} onPress={handleNext}>
        <RightArrowIcon stroke="#242933" />
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
    color: '#000'
  }
})

export default ControlBar
