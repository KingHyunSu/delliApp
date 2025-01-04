import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {Text} from 'react-native-svg'
import {captureRef} from 'react-native-view-shot'

import Outline from '../components/Outline'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
// import DefaultTimeAnchor from '@/assets/icons/default_time_anchor.svg'

import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil'
import {
  activeOutlineState,
  activeColorThemeDetailState,
  timetableContainerHeightState,
  timetableWrapperSizeState
} from '@/store/system'
import {editScheduleFormState} from '@/store/schedule'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'
import {widgetWithImageUpdatedState} from '@/store/widget'

import {getScheduleColorList} from '../util'
import {updateWidgetWithImage} from '@/utils/widget'

interface Props {
  data: Schedule[]
  readonly?: boolean
  isRendered: boolean
  outline?: ActiveOutline
}
const Timetable = ({data, readonly = false, isRendered, outline}: Props) => {
  const refs = useRef<View>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [widgetWithImageUpdated, setWidgetWithImageUpdated] = useRecoilState(widgetWithImageUpdatedState)

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

  const sortedColorThemeItemList = useMemo(() => {
    if (!activeColorThemeDetail.is_active_color_theme) {
      return null
    }

    return [...activeColorThemeDetail.color_theme_item_list].sort((a, b) => a.order - b.order)
  }, [activeColorThemeDetail])

  const scheduleColorList = useMemo(() => {
    return getScheduleColorList(data, sortedColorThemeItemList)
  }, [data, sortedColorThemeItemList])

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

  const currentTimePercent = useMemo(() => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const currentMinutes = hours * 60 + minutes

    const totalMinutes = 24 * 60

    return (currentMinutes / totalMinutes) * 100
  }, [currentTime])

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
                  color={scheduleColorList[index].backgroundColor}
                  isEdit={false}
                  onClick={openEditMenuBottomSheet}
                />
              )
            })}

            {emptyTextComponent}
          </Svg>

          {scheduleList.map((item, index) => {
            return (
              <ScheduleText
                key={index}
                data={item}
                centerX={radius}
                centerY={radius}
                radius={radius}
                color={scheduleColorList[index].textColor}
                onClick={openEditMenuBottomSheet}
              />
            )
          })}
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
  }
})

export default Timetable
