import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Svg, Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import TimeBackground from '../components/TimeBackground'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'

import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {timetableWrapperHeightState, timetableCenterPositionState} from '@/store/system'
import {scheduleState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {updateWidgetWithImage} from '@/utils/widget'
import {widgetWithImageUpdatedState} from '@/store/widget'

interface Props {
  data: Schedule[]
  isRendered: boolean
}
const Timetable = ({data, isRendered}: Props) => {
  const refs = React.useRef<View>(null)

  const [widgetWithImageUpdated, setWidgetWithImageUpdated] = useRecoilState(widgetWithImageUpdatedState)

  const timetableWrapperHeight = useRecoilValue(timetableWrapperHeightState)
  const timetableCenterPosition = useRecoilValue(timetableCenterPositionState)
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
    return timetableCenterPosition - 32
  }, [timetableCenterPosition])

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
  }
})

export default Timetable
