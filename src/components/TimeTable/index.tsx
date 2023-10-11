import React from 'react'
import {StyleSheet, useWindowDimensions} from 'react-native'
import {Svg, G, Text} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import InsertSchedulePie from './src/InsertSchedulePie'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  isInsertMode: Boolean
  onClick: Function
}
const TimeTable = ({data, isInsertMode, onClick}: Props) => {
  const {width} = useWindowDimensions()
  const x = width / 2
  const y = width / 2
  const radius = width / 2 - 36

  const list = React.useMemo(() => {
    return data.filter(item => item.disable === '0')
  }, [data])

  return (
    <Svg onPress={() => onClick()}>
      <G>
        <Background x={x} y={y} radius={radius} />

        <G opacity={isInsertMode ? 0.5 : 1}>
          {list.length > 0 ? (
            list.map((item, index) => {
              const startAngle = item.start_time * 0.25
              const endAngle = item.end_time * 0.25

              return (
                <SchedulePie
                  key={index}
                  data={item}
                  x={x}
                  y={y}
                  radius={radius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                />
              )
            })
          ) : (
            <Text x={x} y={y} fontSize={18} fill={'#BABABA'} textAnchor="middle">
              터치하여 일정 추가하기
            </Text>
          )}
        </G>

        {isInsertMode && <InsertSchedulePie scheduleList={data} x={x} y={y} radius={radius} />}
      </G>
    </Svg>
  )
}

const styles = StyleSheet.create({
  controlButtonContainer: {
    width: 200,
    height: 80,
    justifyContent: 'space-between'
  },
  controlButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButton: {
    width: 60,
    borderRadius: 10,
    paddingVertical: 2,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5
  },
  plusControlButtonColor: {
    backgroundColor: '#6BB5FF'
  },
  minusControlButtonColor: {
    backgroundColor: '#FF8C85'
  },
  controlButtonText: {
    color: '#fff'
  }
})
export default TimeTable
