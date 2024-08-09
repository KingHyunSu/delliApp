import React from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg, Text} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import ScheduleText from './src/ScheduleText'
import EditSchedulePie from './src/EditSchedulePie'
import EditScheduleText from './src/EditScheduleText'
import EditSchedulePieController from './src/EditSchedulePieController'

import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil'
import {timetableSizeState, timetablePositionXState, timetablePositionYState} from '@/store/system'
import {scheduleState, disableScheduleListState, isInputModeState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

interface Props {
  data: Schedule[]
  isEdit: boolean
}
const TimeTable = ({data, isEdit}: Props) => {
  const timetableSize = useRecoilValue(timetableSizeState)
  const timetablePositionX = useRecoilValue(timetablePositionXState)
  const timetablePositionY = useRecoilValue(timetablePositionYState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  const list = React.useMemo(() => {
    if (isEdit && schedule.schedule_id) {
      return data.filter(item => item.schedule_id !== schedule.schedule_id)
    }
    return data
  }, [isEdit, data, schedule.schedule_id])

  const radius = React.useMemo(() => {
    return timetableSize / 2
  }, [timetableSize])

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

        if (startTime > endTime) {
          if (endTime > start_time) {
            start_time += 1440
          }
          endTime += 1440
        }
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
        <Background x={timetablePositionX} y={timetablePositionY} radius={radius} />

        {list.map((item, index) => {
          return (
            <SchedulePie
              key={index}
              data={item}
              x={timetablePositionX}
              y={timetablePositionY}
              radius={radius}
              isEdit={isEdit}
              disableScheduleList={disableScheduleList}
              onClick={openEditMenuBottomSheet}
            />
          )
        })}

        {list.length === 0 && !isEdit && (
          <Text
            x={timetablePositionX}
            y={timetablePositionY}
            fontSize={18}
            fill={'#babfc5'}
            fontFamily={'Pretendard-SemiBold'}
            textAnchor="middle">
            일정을 추가해주세요
          </Text>
        )}
      </Svg>

      {list.map((item, index) => {
        return (
          <ScheduleText
            key={index}
            data={item}
            centerX={timetablePositionX}
            centerY={timetablePositionY}
            radius={radius}
            onClick={openEditMenuBottomSheet}
          />
        )
      })}

      {isEdit && (
        <Pressable style={styles.editContainer} onPress={clickBackground}>
          <Svg>
            <EditSchedulePie
              data={schedule}
              x={timetablePositionX}
              y={timetablePositionY}
              radius={radius}
              scheduleList={data}
              disableScheduleList={disableScheduleList}
            />
          </Svg>

          <EditScheduleText
            data={schedule}
            centerX={timetablePositionX}
            centerY={timetablePositionY}
            radius={radius}
            onChangeSchedule={changeSchedule}
          />

          <EditSchedulePieController
            data={schedule}
            x={timetablePositionX}
            y={timetablePositionY}
            radius={radius}
            onScheduleChanged={changeSchedule}
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
