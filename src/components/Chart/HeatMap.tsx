import React from 'react'
import {StyleSheet, View} from 'react-native'
import type {ScheduleActivityLog} from '@/@types/stats'

interface Props {
  data: ScheduleActivityLog[]
  height: number
}
const HeatMap = ({data, height}: Props) => {
  const item = React.useMemo(() => {
    const size = height / 7
    const list = []

    for (let i = 0; i < data.length; i += 7) {
      const chunk = data.slice(i, i + 7)

      list.push(chunk)
    }

    return list.map((row, index) => {
      return (
        <View key={index}>
          {row.map((item, sIndex) => {
            const activeStyle = item.totalCompleteCount > 0 && {
              backgroundColor: '#32CD32',
              opacity: item.totalCompleteCount / 5 > 1 ? 1 : item.totalCompleteCount / 5
            }

            return <View key={sIndex} style={[styles.item, {...activeStyle, width: size, height: size}]} />
          })}
        </View>
      )
    })
  }, [data, height])

  return <View style={styles.container}>{item}</View>
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  item: {
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#f9f9f9'
  }
})

export default HeatMap
