import {useMemo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {eachDayOfInterval, format, subDays} from 'date-fns'

interface Props {
  completeDateList: string[]
  itemSize?: number
  gap?: number
  activeTheme: ActiveTheme
}
const RoutineCompleteBar = ({completeDateList, itemSize = 24, gap = 3, activeTheme}: Props) => {
  const completeListComponent = useMemo(() => {
    const today = new Date()
    // const startDate = subDays(today, 6)
    const startDate = subDays(today, 4)
    const dateList = eachDayOfInterval({start: startDate, end: today}).reverse()

    return dateList.map((date, index) => {
      const formatDate = format(date, 'yyyy-MM-dd')
      const isActive = completeDateList?.includes(formatDate)

      const itemStyle = isActive ? activeItemStyle : [styles.item, {backgroundColor: activeTheme?.color6}]
      const itemTextStyle = isActive ? activeItemTextStyle : styles.itemText

      return (
        <View key={index} style={[itemStyle, {width: itemSize, height: itemSize}]}>
          <Text style={[itemTextStyle, {fontSize: itemSize / 2}]}>{date.getDate()}</Text>
        </View>
      )
    })
  }, [activeTheme?.color6, completeDateList, itemSize])

  return <View style={[styles.container, {gap: gap}]}>{completeListComponent}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  item: {
    borderRadius: 5,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#c8cdd4'
  }
})

const activeItemStyle = StyleSheet.compose(styles.item, {backgroundColor: '#FFD54F'})
const activeItemTextStyle = StyleSheet.compose(styles.itemText, {fontFamily: 'Pretendard-Bold', color: '#ffffff'})

export default RoutineCompleteBar
