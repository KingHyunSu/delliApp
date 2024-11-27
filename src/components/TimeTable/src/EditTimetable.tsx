import React from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg} from 'react-native-svg'

import TimeBackground from '../components/TimeBackground'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import EditSchedulePie from '../components/EditSchedulePie'
import EditScheduleText from '../components/EditScheduleText'

import {useRecoilState, useRecoilValue} from 'recoil'
import {timetableContainerHeightState, timetableWrapperSizeState} from '@/store/system'
import {scheduleState, disableScheduleListState, isInputModeState} from '@/store/schedule'

interface Props {
  data: Schedule[]
  isRendered: boolean
  onChangeStartTime: (value: number) => void
  onChangeEndTime: (value: number) => void
}
const EditTimetable = ({data, isRendered, onChangeStartTime, onChangeEndTime}: Props) => {
  const timetableContainerHeight = useRecoilValue(timetableContainerHeightState)
  const timetableWrapperSize = useRecoilValue(timetableWrapperSizeState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  // styles
  const containerStyle = React.useMemo(() => {
    return [styles.container, {height: timetableContainerHeight}]
  }, [timetableContainerHeight])

  const wrapperStyle = React.useMemo(() => {
    return [
      styles.wrapper,
      {
        width: timetableWrapperSize * 2,
        height: timetableWrapperSize * 2
      }
    ]
  }, [timetableWrapperSize])

  const scheduleList = React.useMemo(() => {
    return data
      .filter(item => item.schedule_id !== schedule.schedule_id)
      .sort((a, b) => {
        if (a.update_date && b.update_date) {
          return new Date(a.update_date).getTime() - new Date(b.update_date).getTime()
        }

        if (!a.update_date) return -1
        if (!b.update_date) return 1

        return 0
      })
  }, [data, schedule.schedule_id])

  const radius = React.useMemo(() => {
    return timetableWrapperSize - 40
  }, [timetableWrapperSize])

  const closeKeyboard = React.useCallback(() => {
    setIsInputMode(false)
  }, [setIsInputMode])

  const clickBackground = React.useCallback(() => {
    closeKeyboard()
  }, [closeKeyboard])

  const changeSchedule = React.useCallback(
    (value: Object) => {
      setSchedule(prevState => ({
        ...prevState,
        ...value
      }))
    },
    [setSchedule]
  )

  const changeScheduleDisabled = React.useCallback(
    (value: ExistSchedule[]) => {
      setDisableScheduleList(prevState => {
        if (prevState === value || (prevState.length === 0 && value.length === 0)) {
          return prevState
        }
        return value
      })
    },
    [setDisableScheduleList]
  )

  return (
    <Pressable style={containerStyle} onPress={clickBackground}>
      <View style={wrapperStyle}>
        <TimeBackground radius={radius} percentage={0} />

        <View>
          <Svg width={radius * 2} height={radius * 2}>
            <Background x={radius} y={radius} radius={radius} />

            {scheduleList.map((item, index) => {
              return (
                <SchedulePie
                  key={index}
                  data={item}
                  x={radius}
                  y={radius}
                  radius={radius}
                  startTime={item.start_time}
                  endTime={item.end_time}
                  isEdit={true}
                  disableScheduleList={disableScheduleList}
                />
              )
            })}
          </Svg>

          {scheduleList.map((item, index) => {
            return <ScheduleText key={index} data={item} centerX={radius} centerY={radius} radius={radius} />
          })}
        </View>

        <View style={styles.editContainer}>
          <EditSchedulePie
            data={schedule}
            scheduleList={data}
            x={timetableWrapperSize}
            y={timetableWrapperSize}
            radius={radius}
            isInputMode={isInputMode}
            onChangeSchedule={changeSchedule}
            onChangeScheduleDisabled={changeScheduleDisabled}
            onChangeStartTime={onChangeStartTime}
            onChangeEndTime={onChangeEndTime}
          />

          <EditScheduleText
            data={schedule}
            isRendered={isRendered}
            centerX={timetableWrapperSize}
            centerY={timetableWrapperSize}
            radius={radius}
            onChangeSchedule={changeSchedule}
          />
        </View>
      </View>
    </Pressable>
  )
}

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

export default EditTimetable
