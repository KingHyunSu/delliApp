import {useMemo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {eachDayOfInterval, format, subDays} from 'date-fns'

interface Props {
  completeDateList: string[]
  itemSize?: number
}
const RoutineCompleteBar = ({completeDateList, itemSize = 24}: Props) => {
  const completeListComponent = useMemo(() => {
    const today = new Date()
    const startDate = subDays(today, 6)
    const dateList = eachDayOfInterval({start: startDate, end: today}).reverse()

    return dateList.map((date, index) => {
      const formatDate = format(date, 'yyyy-MM-dd')
      const isActive = completeDateList.includes(formatDate)

      const itemStyle = isActive ? activeItemStyle : styles.item
      return (
        <View key={index} style={[itemStyle, {width: itemSize, height: itemSize}]}>
          <Text style={[styles.itemText, {fontSize: itemSize / 2}]}>{date.getDate()}</Text>
        </View>
      )
    })
  }, [completeDateList, itemSize])

  return <View style={styles.container}>{completeListComponent}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2
  },
  item: {
    borderRadius: 5,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontFamily: 'Pretendard-Bold',
    color: '#ffffff'
  }
})

const activeItemStyle = StyleSheet.compose(styles.item, {backgroundColor: '#76d672'})

export default RoutineCompleteBar
