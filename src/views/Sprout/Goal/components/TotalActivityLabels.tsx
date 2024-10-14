import {useMemo} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import TimerIcon from '@/assets/icons/timer.svg'
import PriorityIcon from '@/assets/icons/priority2.svg'
import {getTimeString} from '@/views/Sprout/Goal/util'

interface Props {
  totalCompleteCount: number | null
  totalFocusTime: number | null
}
const TotalActivityLabels = ({totalCompleteCount, totalFocusTime}: Props) => {
  const totalCompleteCountText = useMemo(() => {
    if (!totalCompleteCount || totalCompleteCount === 0) {
      return null
    }

    return `${totalCompleteCount}회`
  }, [totalCompleteCount])

  const totalFocusTimeText = useMemo(() => {
    if (!totalFocusTime || totalFocusTime === 0) {
      return null
    }

    return getTimeString(totalFocusTime)
  }, [totalFocusTime])

  return (
    <View style={styles.container}>
      {totalCompleteCountText !== null && (
        <View style={[styles.wrapper, {backgroundColor: '#66BB6A'}]}>
          <PriorityIcon width={14} height={14} fill="#ffffff" />
          <Text style={styles.text}>{totalCompleteCountText}</Text>
        </View>
      )}

      {totalFocusTimeText !== null && (
        <View style={[styles.wrapper, {backgroundColor: '#FF6B6B'}]}>
          <TimerIcon width={13} height={13} fill="#ffffff" />
          <Text style={styles.text}>{totalFocusTimeText}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5
  },
  wrapper: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 7
  },
  text: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#fff'
  }
})

export default TotalActivityLabels
