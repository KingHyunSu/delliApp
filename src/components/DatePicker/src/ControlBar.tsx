import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

import {addMonths} from 'date-fns'

interface Props {
  onChange: Function
}
const ControlBar = ({onChange}: Props) => {
  const [date, setDate] = React.useState(new Date())

  const handlePrev = () => {
    const calcDate = addMonths(date, -1)
    setDate(calcDate)
  }

  const handleNext = () => {
    const calcDate = addMonths(date, 1)
    setDate(calcDate)
  }

  React.useEffect(() => {
    onChange(date)
  }, [date, onChange])

  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={handlePrev}>
        <LeftArrowIcon stroke="#242933" />
      </Pressable>

      <Text style={styles.text}>{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</Text>

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
    marginBottom: 20
  },

  arrowButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default ControlBar
