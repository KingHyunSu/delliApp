import React from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg, Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import ScheduleText from './src/ScheduleText'
import EditSchedulePie from './src/EditSchedulePie'
import EditScheduleText from './src/EditScheduleText'
import EditSchedulePieController from './src/EditSchedulePieController'

import {useRecoilState, useSetRecoilState, useRecoilValue} from 'recoil'
import {timetableWrapperHeightState, timetableCenterPositionState} from '@/store/system'
import {scheduleState, disableScheduleListState, isInputModeState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

export type TimetableRefs = {
  getImage: () => Promise<string>
}
interface Props {
  data: Schedule[]
  isEdit: boolean
}
const TimeTable = React.forwardRef<TimetableRefs, Props>(({data, isEdit}, ref) => {
  const refs = React.useRef<View>(null)

  const timetableWrapperHeight = useRecoilValue(timetableWrapperHeightState)
  const timetableCenterPosition = useRecoilValue(timetableCenterPositionState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  // styles
  const containerStyle = React.useMemo(() => {
    return [styles.container, {height: timetableWrapperHeight}]
  }, [timetableWrapperHeight])

  const wrapperStyle = React.useMemo(() => {
    return {
      width: timetableCenterPosition * 2,
      height: timetableCenterPosition * 2
    }
  }, [timetableCenterPosition])

  const radius = React.useMemo(() => {
    return timetableCenterPosition - 32
  }, [timetableCenterPosition])

  const list = React.useMemo(() => {
    if (isEdit && schedule.schedule_id) {
      return data.filter(item => item.schedule_id !== schedule.schedule_id)
    }
    return data
  }, [isEdit, data, schedule.schedule_id])

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

  const getImage = async () => {
    if (refs.current) {
      return await captureRef(refs, {
        format: 'png',
        quality: 1
      })
    }

    return Promise.reject('timetable image capture error!')
  }

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

    setDisableScheduleList(result as ExistSchedule[])
  }, [isEdit, schedule.schedule_id, schedule.start_time, schedule.end_time, data, setDisableScheduleList])

  React.useImperativeHandle(ref, () => ({
    getImage
  }))

  if (!timetableWrapperHeight || !timetableCenterPosition) {
    return <></>
  }

  return (
    <View style={containerStyle}>
      <View ref={refs} style={wrapperStyle}>
        <Svg>
          <Background x={timetableCenterPosition} y={timetableCenterPosition} radius={radius} />

          {list.map((item, index) => {
            return (
              <SchedulePie
                key={index}
                data={item}
                x={timetableCenterPosition}
                y={timetableCenterPosition}
                radius={radius}
                isEdit={isEdit}
                disableScheduleList={disableScheduleList}
                onClick={openEditMenuBottomSheet}
              />
            )
          })}

          {list.length === 0 && !isEdit && (
            <Text
              x={timetableCenterPosition}
              y={timetableCenterPosition}
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
              centerX={timetableCenterPosition}
              centerY={timetableCenterPosition}
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
                x={timetableCenterPosition}
                y={timetableCenterPosition}
                radius={radius}
                scheduleList={data}
                disableScheduleList={disableScheduleList}
              />
            </Svg>

            <EditScheduleText
              data={schedule}
              centerX={timetableCenterPosition}
              centerY={timetableCenterPosition}
              radius={radius}
              onChangeSchedule={changeSchedule}
            />

            {!isInputMode && (
              <EditSchedulePieController
                data={schedule}
                x={timetableCenterPosition}
                y={timetableCenterPosition}
                radius={radius}
                onScheduleChanged={changeSchedule}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  editContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})

export default TimeTable
