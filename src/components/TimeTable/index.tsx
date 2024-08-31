import React from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg, Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import TimeBackground from './src/TimeBackground'
import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import ScheduleText from './src/ScheduleText'
import EditSchedulePie from './src/EditSchedulePie'
import EditScheduleText from './src/EditScheduleText'

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
    return [
      styles.wrapper,
      {
        width: timetableCenterPosition * 2,
        height: timetableCenterPosition * 2
      }
    ]
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
      return await captureRef(refs)
    }

    return Promise.reject('timetable image capture error!')
  }

  const changeScheduleDisabled = React.useCallback((value: ExistSchedule[]) => {
    setDisableScheduleList(value)
  }, [])

  React.useImperativeHandle(ref, () => ({
    getImage
  }))

  if (!timetableWrapperHeight || !timetableCenterPosition) {
    return <></>
  }

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        <TimeBackground x={timetableCenterPosition} y={timetableCenterPosition} radius={radius} />

        <View ref={refs}>
          <Svg width={radius * 2} height={radius * 2}>
            <Background x={radius} y={radius} radius={radius} />

            {list.map((item, index) => {
              return (
                <SchedulePie
                  key={index}
                  data={item}
                  x={radius}
                  y={radius}
                  radius={radius}
                  startTime={item.start_time}
                  endTime={item.end_time}
                  isEdit={isEdit}
                  disableScheduleList={disableScheduleList}
                  onClick={openEditMenuBottomSheet}
                />
              )
            })}

            {list.length === 0 && !isEdit && (
              <Text
                x={radius}
                y={radius}
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
                centerX={radius}
                centerY={radius}
                radius={radius}
                onClick={openEditMenuBottomSheet}
              />
            )
          })}
        </View>

        {isEdit && (
          <Pressable style={styles.editContainer} onPress={clickBackground}>
            <EditSchedulePie
              isEdit={isEdit}
              data={schedule}
              scheduleList={data}
              x={timetableCenterPosition}
              y={timetableCenterPosition}
              radius={radius}
              isInputMode={isInputMode}
              onChangeSchedule={changeSchedule}
              onChangeScheduleDisabled={changeScheduleDisabled}
            />

            <EditScheduleText
              data={schedule}
              centerX={timetableCenterPosition}
              centerY={timetableCenterPosition}
              radius={radius}
              onChangeSchedule={changeSchedule}
            />
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
  wrapper: {
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
