import {useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import LeftArrowIcon from '@/assets/icons/arrow_left.svg'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

import {subMonths, addMonths} from 'date-fns'

interface Props {
  activeTheme: ActiveTheme
  currentDate: Date | null
  onChange: Function
}
const ControlBar = ({activeTheme, currentDate, onChange}: Props) => {
  const dateText = useMemo(() => {
    if (!currentDate) {
      return ''
    }

    return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`
  }, [currentDate])

  const handlePrev = useCallback(() => {
    if (currentDate) {
      onChange(subMonths(currentDate, 1))
    }
  }, [currentDate, onChange])

  const handleNext = useCallback(() => {
    if (currentDate) {
      onChange(addMonths(currentDate, 1))
    }
  }, [currentDate, onChange])

  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={handlePrev}>
        <LeftArrowIcon stroke={activeTheme.color3} />
      </Pressable>

      <Text style={[styles.text, {color: activeTheme.color3}]}>{dateText}</Text>

      <Pressable style={styles.arrowButton} onPress={handleNext}>
        <RightArrowIcon stroke={activeTheme.color3} />
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
    fontSize: 18
  }
})

export default ControlBar
