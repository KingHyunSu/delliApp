import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable} from 'react-native'
import {Svg, G, Text, Circle} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import ScheduleText from './src/ScheduleText'
import EditSchedulePie from './src/EditSchedulePie'
import EditScheduleText from './src/EditScheduleText'
import EditSchedulePieController from './src/EditSchedulePieController'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {scheduleState, disableScheduleListState, isInputModeState} from '@/store/schedule'
import {showStyleBottomSheetState, showEditMenuBottomSheetState} from '@/store/bottomSheet'

import PaletteIcon from '@/assets/icons/palette.svg'

interface Props {
  data: Schedule[]
  isEdit: boolean
}
const TimeTable = ({data, isEdit}: Props) => {
  const {width, height} = useWindowDimensions()
  const x = width / 2
  const y = height * 0.28
  const fullRadius = width / 2 - 36

  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setIsShowStyleBottomSheet = useSetRecoilState(showStyleBottomSheetState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  const list = React.useMemo(() => {
    if (isEdit && schedule.schedule_id) {
      return data.filter(item => item.schedule_id !== schedule.schedule_id)
    }
    return data
  }, [isEdit, data, schedule.schedule_id])

  const radius = React.useMemo(() => {
    let result = fullRadius - (20 - (y - fullRadius - 20))

    if (result > fullRadius) {
      return fullRadius
    }

    return result
  }, [fullRadius, y])

  const openEditMenuBottomSheet = React.useCallback(
    (value: Schedule) => {
      setSchedule(value)
      setShowEditMenuBottomSheet(true)
    },
    [setSchedule, setShowEditMenuBottomSheet]
  )

  const closeKeyboard = React.useCallback(() => {
    setIsInputMode(false)
  }, [setIsInputMode])

  const showStyleBottomSheet = React.useCallback(() => {
    closeKeyboard()
    setIsShowStyleBottomSheet(true)
  }, [closeKeyboard, setIsShowStyleBottomSheet])

  const clickBackground = React.useCallback(() => {
    closeKeyboard()
  }, [closeKeyboard])

  const changeSchedule = React.useCallback(
    (data: Object) => {
      setSchedule(prevState => ({
        ...prevState,
        ...data
      }))
    },
    [setSchedule]
  )

  React.useLayoutEffect(() => {
    if (!isEdit) {
      return
    }

    let startTime = schedule.start_time
    let endTime = schedule.end_time

    const result = data
      .filter(item => {
        if (schedule.schedule_id === item.schedule_id) {
          return false
        }

        let start_time = item.start_time === 0 ? 1440 : item.start_time
        let end_time = item.end_time

        if (start_time > end_time) {
          const isOverlapStart = startTime > start_time || startTime < end_time
          const isOverlapEnd = endTime > start_time || endTime < end_time
          const isOverlapAll = startTime > endTime && startTime <= start_time && endTime >= end_time

          return isOverlapStart || isOverlapEnd || isOverlapAll
        }

        const isOverlapStart = startTime > start_time && startTime < end_time
        const isOverlapEnd = endTime > start_time && endTime < end_time
        const isOverlapAll = start_time >= startTime && end_time <= endTime

        return isOverlapStart || isOverlapEnd || isOverlapAll
      })
      .map(item => {
        return {
          schedule_id: item.schedule_id,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          start_date: item.start_date,
          end_date: item.end_date,
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun
        }
      })

    setDisableScheduleList(result)
  }, [isEdit, schedule.schedule_id, schedule.start_time, schedule.end_time, data, setDisableScheduleList])

  return (
    <View>
      <Svg>
        <Background x={x} y={y} radius={radius} />

        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <SchedulePie
                key={index}
                data={item}
                x={x}
                y={y}
                radius={radius}
                disableScheduleList={disableScheduleList}
                onClick={openEditMenuBottomSheet}
              />
            )
          })
        ) : (
          <Text x={x} y={y} fontSize={18} fill={'#babfc5'} fontFamily={'Pretendard-SemiBold'} textAnchor="middle">
            일정을 추가해주세요
          </Text>
        )}
      </Svg>

      {list.map((item, index) => {
        return (
          <ScheduleText
            key={index}
            data={item}
            centerX={x}
            centerY={y}
            radius={radius}
            onClick={openEditMenuBottomSheet}
          />
        )
      })}

      {isEdit && (
        <Pressable style={styles.editContainer} onPress={clickBackground}>
          <Svg>
            <G x={20} y={y + radius - 10}>
              <PaletteIcon width={32} height={32} fill="#babfc5" />
              <Circle cx={15} cy={15} r={18} fill={'transparent'} onPress={showStyleBottomSheet} />
            </G>

            <EditSchedulePie
              data={schedule}
              x={x}
              y={y}
              radius={radius}
              scheduleList={data}
              disableScheduleList={disableScheduleList}
            />
          </Svg>

          <EditScheduleText data={schedule} centerX={x} centerY={y} radius={radius} onChangeSchedule={changeSchedule} />

          <EditSchedulePieController data={schedule} x={x} y={y} radius={radius} onScheduleChanged={changeSchedule} />
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
