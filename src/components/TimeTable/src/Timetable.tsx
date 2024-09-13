import React from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {G, Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import TimeBackground from '../components/TimeBackground'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import DefaultTimeAnchor from '@/assets/icons/default_time_anchor.svg'

import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {timetableWrapperHeightState, timetableCenterPositionState} from '@/store/system'
import {focusModeInfoState, scheduleState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {updateWidgetWithImage} from '@/utils/widget'
import {widgetWithImageUpdatedState} from '@/store/widget'
import {polarToCartesian} from '@/utils/pieHelper'

interface Props {
  data: Schedule[]
  isRendered: boolean
}
const Timetable = ({data, isRendered}: Props) => {
  const refs = React.useRef<View>(null)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const [widgetWithImageUpdated, setWidgetWithImageUpdated] = useRecoilState(widgetWithImageUpdatedState)

  const timetableWrapperHeight = useRecoilValue(timetableWrapperHeightState)
  const timetableCenterPosition = useRecoilValue(timetableCenterPositionState)
  const focusModeInfo = useRecoilValue(focusModeInfoState)
  const setSchedule = useSetRecoilState(scheduleState)
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
    return timetableCenterPosition - 40
  }, [timetableCenterPosition])

  const anchorIconColor = React.useMemo(() => {
    return focusModeInfo ? '#FF0000' : '#1E90FF'
  }, [focusModeInfo])

  const openEditMenuBottomSheet = React.useCallback(
    (value: Schedule) => {
      setSchedule(value)
      setShowEditMenuBottomSheet(true)
    },
    [setSchedule, setShowEditMenuBottomSheet]
  )

  React.useEffect(() => {
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

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000 * 60)

    return () => clearInterval(timer)
  }, [])

  const arcLengthForOneDegree = React.useMemo(() => {
    return (2 * Math.PI * radius) / 360
  }, [radius])

  const currentTimeAngle = React.useMemo(() => {
    const hour = currentTime.getHours()
    const minute = currentTime.getMinutes()

    return (hour * 60 + minute) * 0.25 - Math.round(11 / arcLengthForOneDegree)
  }, [currentTime, arcLengthForOneDegree])

  const currentTimePosition = React.useMemo(() => {
    return polarToCartesian(timetableCenterPosition, timetableCenterPosition, radius + 24, currentTimeAngle)
  }, [timetableCenterPosition, radius, currentTimeAngle])

  const emptyTextComponent = React.useMemo(() => {
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

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        <TimeBackground x={timetableCenterPosition} y={timetableCenterPosition} radius={radius} />

        <View ref={refs}>
          <Svg width={radius * 2} height={radius * 2}>
            <Background x={radius} y={radius} radius={radius} />

            {data.map((item, index) => {
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
            <DefaultTimeAnchor width={20} height={20} fill={anchorIconColor} />
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
