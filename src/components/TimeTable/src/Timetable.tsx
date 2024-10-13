import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {Circle, Defs, G, RadialGradient, Stop, Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import TimeBackground from '../components/TimeBackground'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import DefaultTimeAnchor from '@/assets/icons/default_time_anchor.svg'

import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {timetableWrapperHeightState, timetableCenterPositionState} from '@/store/system'
import {scheduleState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {updateWidgetWithImage} from '@/utils/widget'
import {widgetWithImageUpdatedState} from '@/store/widget'
import {polarToCartesian} from '@/utils/pieHelper'

interface Props {
  data: Schedule[]
  isRendered: boolean
}
const Timetable = ({data, isRendered}: Props) => {
  const refs = useRef<View>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [widgetWithImageUpdated, setWidgetWithImageUpdated] = useRecoilState(widgetWithImageUpdatedState)

  const timetableWrapperHeight = useRecoilValue(timetableWrapperHeightState)
  const timetableCenterPosition = useRecoilValue(timetableCenterPositionState)
  const setSchedule = useSetRecoilState(scheduleState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  // styles
  const containerStyle = useMemo(() => {
    return [styles.container, {height: timetableWrapperHeight}]
  }, [timetableWrapperHeight])

  const wrapperStyle = useMemo(() => {
    return [
      styles.wrapper,
      {
        width: timetableCenterPosition * 2,
        height: timetableCenterPosition * 2
      }
    ]
  }, [timetableCenterPosition])

  // TODO - 겹치는 일정만 뽑아내는 코드 (활용할 수 있을거 같아서 임시 주석)
  // const overlapScheduleList =  useMemo(() => {
  //   const _scheduleList = [...data] // update date로 정렬 필요
  //   const result: Schedule[] = []
  //
  //   const getExistOverlapSchedule = (item: Schedule) => result.some(sItem => item.schedule_id === sItem.schedule_id)
  //
  //   const setOverlapSchedule = (item: Schedule) => {
  //     const existOverlapSchedule = getExistOverlapSchedule(item)
  //
  //     if (!existOverlapSchedule) {
  //       const targetSubIndex = _scheduleList.findIndex(sItem => item.schedule_id === sItem.schedule_id)
  //
  //       _scheduleList.splice(targetSubIndex, 1)
  //       result.push(item)
  //     }
  //   }
  //
  //   for (let i = 0; i < data.length; i++) {
  //     const item = data[i]
  //
  //     const startTime = item.start_time
  //     const endTime = item.end_time
  //
  //     for (let j = 0; j < _scheduleList.length; j++) {
  //       const sItem = _scheduleList[j]
  //
  //       if (item.schedule_id === sItem.schedule_id) {
  //         continue
  //       }
  //
  //       const sStartTime = sItem.start_time
  //       const sEndTime = sItem.end_time
  //
  //       if (startTime > endTime) {
  //         if (sStartTime <= startTime && sEndTime <= endTime) {
  //           setOverlapSchedule(sItem)
  //           continue
  //         }
  //       }
  //
  //       if (sStartTime > sEndTime) {
  //         if (sStartTime < startTime || sEndTime > startTime || sStartTime < endTime || sEndTime > endTime) {
  //           setOverlapSchedule(sItem)
  //           continue
  //         }
  //
  //         if (startTime > endTime) {
  //           if (sStartTime >= startTime && sEndTime <= endTime) {
  //             setOverlapSchedule(sItem)
  //             continue
  //           }
  //         }
  //       }
  //
  //       if (sStartTime < sEndTime) {
  //         if (
  //           (sStartTime < startTime && sEndTime > startTime) ||
  //           (sStartTime < endTime && sEndTime > endTime) ||
  //           (sStartTime >= startTime && sEndTime <= endTime)
  //         ) {
  //           setOverlapSchedule(sItem)
  //         }
  //       }
  //     }
  //
  //     const targetIndex = _scheduleList.findIndex(sItem => item.schedule_id === sItem.schedule_id)
  //     _scheduleList.splice(targetIndex, 1)
  //   }
  //
  //   return result.reverse()
  // }, [data])
  //
  // const scheduleList =  useMemo(() => {
  //   return data.filter(item => {
  //     return !overlapScheduleList.some(sItem => item.schedule_id === sItem.schedule_id)
  //   })
  // }, [data, overlapScheduleList])

  const scheduleList = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.update_date && b.update_date) {
        return new Date(a.update_date).getTime() - new Date(b.update_date).getTime()
      }

      if (!a.update_date) return -1
      if (!b.update_date) return 1

      return 0
    })
  }, [data])

  const radius = useMemo(() => {
    return timetableCenterPosition - 40
  }, [timetableCenterPosition])

  const openEditMenuBottomSheet = useCallback(
    (value: Schedule) => {
      setSchedule(value)
      setShowEditMenuBottomSheet(true)
    },
    [setSchedule, setShowEditMenuBottomSheet]
  )

  useEffect(() => {
    const updateWidget = async () => {
      try {
        const imageUri = await captureRef(refs)
        await updateWidgetWithImage(imageUri)
      } catch (e) {
        console.error('eee', e)
      }
    }

    if (isRendered && widgetWithImageUpdated) {
      updateWidget()

      setWidgetWithImageUpdated(false)
    }
  }, [isRendered, widgetWithImageUpdated, setWidgetWithImageUpdated])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000 * 60)

    return () => clearInterval(timer)
  }, [])

  const arcLengthForOneDegree = useMemo(() => {
    return (2 * Math.PI * radius) / 360
  }, [radius])

  const currentTimeAngle = useMemo(() => {
    const hour = currentTime.getHours()
    const minute = currentTime.getMinutes()

    return (hour * 60 + minute) * 0.25 - Math.round(11 / arcLengthForOneDegree)
  }, [currentTime, arcLengthForOneDegree])

  const currentTimePosition = useMemo(() => {
    return polarToCartesian(timetableCenterPosition, timetableCenterPosition, radius + 24, currentTimeAngle)
  }, [timetableCenterPosition, radius, currentTimeAngle])

  const emptyTextComponent = useMemo(() => {
    if (data.length > 0) {
      return <></>
    }

    return (
      <Text x={radius} y={radius} fontSize={18} fill={'#babfc5'} fontFamily={'Pretendard-SemiBold'} textAnchor="middle">
        일정을 추가해주세요
      </Text>
    )
  }, [data.length, radius])

  if (!timetableWrapperHeight || !timetableCenterPosition) {
    return <></>
  }

  // const shadowRadius = 30
  return (
    <View style={containerStyle}>
      {/* 그림자 배경 sudo code */}
      {/*<Svg style={{position: 'absolute'}} width={radius * 2 + shadowRadius} height={radius * 2 + shadowRadius}>*/}
      {/*  <Defs>*/}
      {/*    <RadialGradient id="grad">*/}
      {/*      <Stop offset="0" stopColor="#000000" stopOpacity="1" />*/}
      {/*      <Stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />*/}
      {/*    </RadialGradient>*/}
      {/*  </Defs>*/}

      {/*  <Circle*/}
      {/*    cx={radius + shadowRadius / 2}*/}
      {/*    cy={radius + shadowRadius / 2}*/}
      {/*    r={radius + shadowRadius / 2}*/}
      {/*    fill="url(#grad)"*/}
      {/*  />*/}
      {/*</Svg>*/}

      <View style={wrapperStyle}>
        <TimeBackground x={timetableCenterPosition} y={timetableCenterPosition} radius={radius} />

        <View ref={refs}>
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
                  isEdit={false}
                  onClick={openEditMenuBottomSheet}
                />
              )
            })}

            {emptyTextComponent}
          </Svg>

          {data.map((item, index) => {
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

        <Svg
          width={timetableCenterPosition * 2}
          height={timetableCenterPosition * 2}
          style={styles.currentTimeAnchorIcon}>
          <G x={currentTimePosition.x} y={currentTimePosition.y} rotation={currentTimeAngle}>
            <DefaultTimeAnchor width={20} height={20} fill="#1E90FF" />
          </G>
        </Svg>
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
  currentTimeAnchorIcon: {
    position: 'absolute'
  }
})

export default Timetable
