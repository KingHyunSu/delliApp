import React from 'react'
import {useWindowDimensions, Platform, StatusBar, StyleSheet, View, Pressable, TextInput} from 'react-native'
import {Svg, G, Text} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import InsertSchedulePie from './src/InsertSchedulePie'
import ScheduleText from './src/ScheduleText'
import EditScheduleText from './src/EditScheduleText'

import {getStatusBarHeight} from 'react-native-status-bar-height'

import {scheduleState} from '@/store/schedule'
import {useRecoilState} from 'recoil'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  homeTopHeight: number
  isEdit: boolean
  titleInputRef: React.RefObject<TextInput>
  onClick: Function
}
const TimeTable = ({data, homeTopHeight, isEdit, onClick, titleInputRef}: Props) => {
  const StatusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight || 0
  const {width, height} = useWindowDimensions()
  const x = width / 2
  const y = height * 0.28
  const fullRadius = width / 2 - 36

  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [isComponentEdit, setIsComponentEdit] = React.useState(false)

  const radius = React.useMemo(() => {
    let result = fullRadius - (20 - (y - fullRadius - 20))

    if (result > fullRadius) {
      return fullRadius
    }

    return result
  }, [fullRadius, y])

  const list = React.useMemo(() => {
    return data.filter(item => item.disable === '0')
  }, [data])

  const clickBackground = () => {
    if (titleInputRef && titleInputRef.current) {
      titleInputRef.current.blur()
    }
  }

  const changeSchedule = React.useCallback(
    (data: Object) => {
      setSchedule(prevState => ({
        ...prevState,
        ...data
      }))
    },
    [setSchedule]
  )

  return (
    <View style={{position: 'relative'}}>
      <Svg onPress={() => onClick()}>
        <G>
          <Background x={x} y={y} radius={radius} />

          <G opacity={isEdit ? 0.5 : 1}>
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
              <Text x={x} y={y} fontSize={18} fill={'#BABABA'} fontFamily={'GmarketSansTTFBold'} textAnchor="middle">
                터치하여 일정 추가하기
              </Text>
            )}
          </G>
        </G>
      </Svg>

      {list.map((item, index) => {
        return <ScheduleText key={index} data={item} centerX={x} centerY={y} radius={radius} />
      })}

      {isEdit && (
        <Pressable style={styles.editContainer} onPress={clickBackground}>
          {/* <Pressable style={styles.editContainer} onPress={() => setIsComponentEdit(false)}> */}
          <InsertSchedulePie
            data={schedule}
            scheduleList={data}
            x={x}
            y={y}
            radius={radius}
            statusBarHeight={StatusBarHeight}
            homeTopHeight={homeTopHeight}
            isComponentEdit={isComponentEdit}
            onChangeSchedule={changeSchedule}
          />

          <EditScheduleText
            data={schedule}
            centerX={x}
            centerY={y}
            radius={radius}
            titleInputRef={titleInputRef}
            onChangeSchedule={changeSchedule}
          />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  editContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})

export default TimeTable
