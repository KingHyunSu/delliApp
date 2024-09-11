import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import type {ScheduleActivityLog} from '@/@types/stats'

interface Props {
  data: ScheduleActivityLog[]
  height: number
}
const BarChart = ({data, height}: Props) => {
  const dateInfo = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        start: '',
        end: ''
      }
    }

    const startDate = new Date(data[0].date)
    const endDate = new Date(data[data.length - 1].date)

    return {
      start: `${startDate.getMonth() + 1}월 ${startDate.getDate()}일`,
      end: `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`
    }
  }, [data])

  const maxActiveTime = React.useMemo(() => {
    let _maxActiveTime = 0

    for (let i = 0; i < data.length; i++) {
      if (_maxActiveTime < data[i].totalActiveTime) {
        _maxActiveTime = data[i].totalActiveTime
      }
    }

    return _maxActiveTime
  }, [data])

  const barListComponent = React.useMemo(() => {
    return data.map((item, index) => {
      let percentage = 1

      if (item.totalActiveTime > 0) {
        percentage = Math.round((item.totalActiveTime / maxActiveTime) * 100)
      }

      return <View key={index} style={[styles.bar, {height: `${percentage}%`}]} />
    })
  }, [data, maxActiveTime])

  return (
    <View style={styles.container}>
      <View style={[styles.barWrapper, {height: height}]}>{barListComponent}</View>

      <View style={styles.dateInfoWrapper}>
        <Text style={styles.dateInfoText}>{dateInfo.start}</Text>
        <Text style={styles.dateInfoText}> - </Text>
        <Text style={styles.dateInfoText}>{dateInfo.end}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  barWrapper: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  bar: {
    width: 7,
    borderRadius: 10,
    backgroundColor: 'red'
  },
  dateInfoWrapper: {
    height: 22,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  dateInfoText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#c3c5cc'
  }
})

export default BarChart
