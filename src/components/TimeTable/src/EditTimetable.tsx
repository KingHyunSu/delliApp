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
import {timetableWrapperHeightState, timetableCenterPositionState} from '@/store/system'
import {scheduleState, disableScheduleListState, isInputModeState} from '@/store/schedule'

interface Props {
  data: Schedule[]
  isRendered: boolean
  onChangeStartTime: (value: number) => void
  onChangeEndTime: (value: number) => void
}
const EditTimetable = ({data, isRendered, onChangeStartTime, onChangeEndTime}: Props) => {
  const timetableWrapperHeight = useRecoilValue(timetableWrapperHeightState)
  const timetableCenterPosition = useRecoilValue(timetableCenterPositionState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

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

  const list = React.useMemo(() => {
    if (schedule.schedule_id) {
      return data.filter(item => item.schedule_id !== schedule.schedule_id)
    }

    return data
  }, [data, schedule.schedule_id])

  const overlapScheduleList = React.useMemo(() => {
    const _scheduleList = [...list] // update date로 정렬 필요
    const result: Schedule[] = []

    const getExistOverlapSchedule = (item: Schedule) => result.some(sItem => item.schedule_id === sItem.schedule_id)

    const setOverlapSchedule = (item: Schedule) => {
      const existOverlapSchedule = getExistOverlapSchedule(item)

      if (!existOverlapSchedule) {
        const targetSubIndex = _scheduleList.findIndex(sItem => item.schedule_id === sItem.schedule_id)

        _scheduleList.splice(targetSubIndex, 1)
        result.push(item)
      }
    }

    for (let i = 0; i < list.length; i++) {
      const item = list[i]

      const startTime = item.start_time
      const endTime = item.end_time

      for (let j = 0; j < _scheduleList.length; j++) {
        const sItem = _scheduleList[j]

        if (item.schedule_id === sItem.schedule_id) {
          continue
        }

        const sStartTime = sItem.start_time
        const sEndTime = sItem.end_time

        if (startTime > endTime) {
          if (sStartTime <= startTime && sEndTime <= endTime) {
            setOverlapSchedule(sItem)
            continue
          }
        }

        if (sStartTime > sEndTime) {
          if (sStartTime < startTime || sEndTime > startTime || sStartTime < endTime || sEndTime > endTime) {
            setOverlapSchedule(sItem)
            continue
          }

          if (startTime > endTime) {
            if (sStartTime >= startTime && sEndTime <= endTime) {
              setOverlapSchedule(sItem)
              continue
            }
          }
        }

        if (sStartTime < sEndTime) {
          if (
            (sStartTime < startTime && sEndTime > startTime) ||
            (sStartTime < endTime && sEndTime > endTime) ||
            (sStartTime >= startTime && sEndTime <= endTime)
          ) {
            setOverlapSchedule(sItem)
          }
        }
      }

      const targetIndex = _scheduleList.findIndex(sItem => item.schedule_id === sItem.schedule_id)
      _scheduleList.splice(targetIndex, 1)
    }

    return result.reverse()
  }, [list])

  const scheduleList = React.useMemo(() => {
    return list.filter(item => {
      return !overlapScheduleList.some(sItem => item.schedule_id === sItem.schedule_id)
    })
  }, [list, overlapScheduleList])

  const radius = React.useMemo(() => {
    return timetableCenterPosition - 40
  }, [timetableCenterPosition])

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

  if (!timetableWrapperHeight || !timetableCenterPosition) {
    return <></>
  }

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        <TimeBackground x={timetableCenterPosition} y={timetableCenterPosition} radius={radius} />

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

          <Svg width={radius * 2} height={radius * 2} style={{position: 'absolute'}}>
            {overlapScheduleList.map((item, index) => {
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

          {list.map((item, index) => {
            return <ScheduleText key={index} data={item} centerX={radius} centerY={radius} radius={radius} />
          })}
        </View>

        <Pressable style={styles.editContainer} onPress={clickBackground}>
          <EditSchedulePie
            data={schedule}
            scheduleList={data}
            x={timetableCenterPosition}
            y={timetableCenterPosition}
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
            centerX={timetableCenterPosition}
            centerY={timetableCenterPosition}
            radius={radius}
            onChangeSchedule={changeSchedule}
          />
        </Pressable>
      </View>
    </View>
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
