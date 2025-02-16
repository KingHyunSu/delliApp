import {ForwardedRef, forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {Image, StyleSheet, View} from 'react-native'
import Svg, {Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import Outline from '../components/Outline'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
// import DefaultTimeAnchor from '@/assets/icons/default_time_anchor.svg'

import {useSetRecoilState, useRecoilValue} from 'recoil'
import {
  activeOutlineState,
  activeColorThemeDetailState,
  timetableContainerHeightState,
  timetableWrapperSizeState
} from '@/store/system'
import {editScheduleFormState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import {getScheduleBackgroundColor, getScheduleTextColor} from '../util'

type Timetable = {
  capture: () => Promise<string>
}
interface Props {
  data: Schedule[]
  readonly?: boolean
  outline?: ActiveOutline
  editScheduleCompleteCardId?: number
  activeSchedule?: Schedule
}
const TimetableComponent = (props: Props, ref: ForwardedRef<Timetable>) => {
  const {data, readonly = false, outline, editScheduleCompleteCardId, activeSchedule} = props

  const timetableRef = useRef<View>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const timetableContainerHeight = useRecoilValue(timetableContainerHeightState)
  const timetableWrapperSize = useRecoilValue(timetableWrapperSizeState)
  const activeColorThemeDetail = useRecoilValue(activeColorThemeDetailState)
  const activeOutline = useRecoilValue(activeOutlineState)

  const setEditScheduleForm = useSetRecoilState(editScheduleFormState)
  const setShowEditMenuBottomSheet = useSetRecoilState(showEditMenuBottomSheetState)

  // styles
  const containerStyle = useMemo(() => {
    return [styles.container, {height: timetableContainerHeight}]
  }, [timetableContainerHeight])

  const wrapperStyle = useMemo(() => {
    return [
      styles.wrapper,
      {
        width: timetableWrapperSize * 2,
        height: timetableWrapperSize * 2
      }
    ]
  }, [timetableWrapperSize])

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
    return timetableWrapperSize - 40
  }, [timetableWrapperSize])

  const openEditMenuBottomSheet = useCallback(
    (value: Schedule) => {
      if (readonly) {
        return
      }

      setEditScheduleForm(value)
      setShowEditMenuBottomSheet(true)
    },
    [readonly, setEditScheduleForm, setShowEditMenuBottomSheet]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000 * 60)

    return () => clearInterval(timer)
  }, [])

  const currentTimePercent = useMemo(() => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentMinutes = hours * 60 + minutes

    const totalMinutes = 24 * 60

    return (currentMinutes / totalMinutes) * 100
  }, [currentTime])

  useImperativeHandle(ref, () => {
    return {
      async capture() {
        return await captureRef(timetableRef)
      }
    }
  })

  // const arcLengthForOneDegree = useMemo(() => {
  //   return (2 * Math.PI * radius) / 360
  // }, [radius])

  // const currentTimeAngle = useMemo(() => {
  //   const hour = currentTime.getHours()
  //   const minute = currentTime.getMinutes()
  //
  //   return (hour * 60 + minute) * 0.25 - Math.round(11 / arcLengthForOneDegree)
  // }, [currentTime, arcLengthForOneDegree])

  // const currentTimePosition = useMemo(() => {
  //   return polarToCartesian(timetableWrapperSize, timetableWrapperSize, radius + 24, currentTimeAngle)
  // }, [timetableWrapperSize, radius, currentTimeAngle])

  const outlineComponent = useMemo(() => {
    const type = outline ? outline.product_outline_id : activeOutline.product_outline_id
    const backgroundColor = outline ? outline.background_color : activeOutline.background_color
    const progressColor = outline ? outline.progress_color : activeOutline.progress_color

    return (
      <Outline
        type={type}
        backgroundColor={backgroundColor}
        progressColor={progressColor}
        radius={radius}
        percentage={currentTimePercent}
      />
    )
  }, [outline, activeOutline, radius, currentTimePercent])

  const scheduleCompleteCardComponent = useMemo(() => {
    const cardWidth = 35
    const cardHeight = 35 * 1.25
    const domain = process.env.CDN_URL

    return data.map((item, index) => {
      if (
        editScheduleCompleteCardId === item.schedule_complete_id ||
        item.schedule_complete_card_x === null ||
        item.schedule_complete_card_x === undefined ||
        item.schedule_complete_card_y === null ||
        item.schedule_complete_card_y === undefined
      ) {
        return null
      }

      if (item.schedule_complete_card_path || item.schedule_complete_record) {
        const imageUrl = item.schedule_complete_card_path ? domain + '/' + item.schedule_complete_card_path : null
        const left = Math.round(radius + (radius / 100) * item.schedule_complete_card_x)
        const top = Math.round(radius - (radius / 100) * item.schedule_complete_card_y)

        return (
          <View key={index} style={{position: 'absolute', left, top}}>
            <View style={{width: cardWidth, height: cardHeight}}>
              <ScheduleCompleteCard
                type="attach"
                size="small"
                imageUrl={imageUrl}
                record={item.schedule_complete_record || ''}
                shadowColor="#efefef"
                shadowDistance={2}
                shadowOffset={[0, 1]}
              />
            </View>

            <Image source={require('@/assets/images/tape.png')} style={styles.tape} />
          </View>
        )
      }

      return null
    })
  }, [editScheduleCompleteCardId, data, radius])

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

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        {outlineComponent}

        <View ref={timetableRef}>
          {/* background */}
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
                  color={getScheduleBackgroundColor(item, data, activeColorThemeDetail)}
                  isEdit={false}
                  onClick={openEditMenuBottomSheet}
                />
              )
            })}

            {emptyTextComponent}
          </Svg>

          {activeSchedule && (
            <View style={{position: 'absolute'}}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: radius,
                  backgroundColor: '#000000',
                  opacity: 0.5
                }}
              />

              <Svg width={radius * 2} height={radius * 2}>
                <SchedulePie
                  data={activeSchedule}
                  x={radius}
                  y={radius}
                  radius={radius}
                  startTime={activeSchedule.start_time}
                  endTime={activeSchedule.end_time}
                  color={getScheduleBackgroundColor(activeSchedule, data, activeColorThemeDetail)}
                  borderColor={getScheduleBackgroundColor(activeSchedule, data, activeColorThemeDetail)}
                  isEdit={false}
                />
              </Svg>
            </View>
          )}

          {/* text */}
          {scheduleList.map((item, index) => {
            return (
              <ScheduleText
                key={index}
                data={item}
                centerX={radius}
                centerY={radius}
                radius={radius}
                color={getScheduleTextColor(item, data, activeColorThemeDetail)}
                onClick={openEditMenuBottomSheet}
              />
            )
          })}

          {scheduleCompleteCardComponent}
        </View>

        {/*<Svg width={timetableWrapperSize * 2} height={timetableWrapperSize * 2} style={styles.currentTimeAnchorIcon}>*/}
        {/*  <G x={currentTimePosition.x} y={currentTimePosition.y} rotation={currentTimeAngle}>*/}
        {/*    <DefaultTimeAnchor width={20} height={20} fill="#1E90FF" />*/}
        {/*  </G>*/}
        {/*</Svg>*/}
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
  },
  tape: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -8,
    left: 10
  }
})

const Timetable = forwardRef(TimetableComponent)

export default Timetable
