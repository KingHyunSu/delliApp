import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

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
      <Pressable onPress={handlePrev}>
        <Text>이전</Text>
      </Pressable>

      <Text style={styles.text}>{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</Text>

      <Pressable onPress={handleNext}>
        <Text>다음</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  text: {
    fontWeight: 'bold'
  }
})

export default ControlBar
