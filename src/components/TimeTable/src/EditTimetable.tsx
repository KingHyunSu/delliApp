import {useMemo, useCallback} from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg} from 'react-native-svg'

import Outline from '../components/Outline'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import EditSchedulePie from '../components/EditSchedulePie'
import EditScheduleText from '../components/EditScheduleText'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeOutlineState, timetableContainerHeightState, timetableWrapperSizeState} from '@/store/system'
import {disableScheduleListState, isInputModeState, editScheduleFormState} from '@/store/schedule'

interface Props {
  data: Schedule[]
  colorThemeDetail: ColorThemeDetail
  isRendered: boolean
}
const EditTimetable = ({data, colorThemeDetail, isRendered}: Props) => {
  const [editScheduleForm, setEditScheduleForm] = useRecoilState(editScheduleFormState)
  const [disableScheduleList, setDisableScheduleList] = useRecoilState(disableScheduleListState)
  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  const timetableContainerHeight = useRecoilValue(timetableContainerHeightState)
  const timetableWrapperSize = useRecoilValue(timetableWrapperSizeState)
  const activeOutline = useRecoilValue(activeOutlineState)

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

  const sortedScheduleList = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.update_date && b.update_date) {
        return new Date(a.update_date).getTime() - new Date(b.update_date).getTime()
      }

      if (!a.update_date) return -1
      if (!b.update_date) return 1

      return 0
    })
  }, [data])

  const scheduleList = useMemo(() => {
    return sortedScheduleList.filter(item => item.schedule_id !== editScheduleForm.schedule_id)
  }, [sortedScheduleList, editScheduleForm.schedule_id])

  const colorThemeItemList = useMemo(() => {
    switch (colorThemeDetail.color_theme_type) {
      case 1:
        return colorThemeDetail.color_theme_item_list
      case 2:
        return colorThemeDetail.color_theme_item_list.sort((a, b) => a.order - b.order)
      case 0:
      default:
        return null
    }
  }, [colorThemeDetail])

  const radius = useMemo(() => {
    return timetableWrapperSize - 40
  }, [timetableWrapperSize])

  const getSchedulePieColor = useCallback(
    (index: number) => {
      if (!colorThemeItemList) {
        return null
      }

      return colorThemeItemList[index % colorThemeItemList.length].color
    },
    [colorThemeItemList]
  )

  const editSchedulePieColor = useMemo(() => {
    if (!colorThemeItemList) {
      return null
    }

    const targetIndex = sortedScheduleList.findIndex(item => item.schedule_id === editScheduleForm.schedule_id)

    if (targetIndex !== -1) {
      return getSchedulePieColor(targetIndex)
    }

    return colorThemeItemList[0].color
  }, [sortedScheduleList, editScheduleForm, getSchedulePieColor, colorThemeItemList])

  const closeKeyboard = useCallback(() => {
    setIsInputMode(false)
  }, [setIsInputMode])

  const clickBackground = useCallback(() => {
    closeKeyboard()
  }, [closeKeyboard])

  const changeSchedule = useCallback(
    (value: Object) => {
      setEditScheduleForm(prevState => ({
        ...prevState,
        ...value
      }))
    },
    [setEditScheduleForm]
  )

  const changeScheduleDisabled = useCallback(
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
        <Outline
          type={activeOutline.product_outline_id}
          backgroundColor={activeOutline.background_color}
          progressColor={activeOutline.progress_color}
          radius={radius}
          percentage={0}
        />

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
                  color={getSchedulePieColor(index)}
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
            data={editScheduleForm}
            scheduleList={data}
            x={timetableWrapperSize}
            y={timetableWrapperSize}
            radius={radius}
            color={editSchedulePieColor}
            isInputMode={isInputMode}
            onChangeSchedule={changeSchedule}
            onChangeScheduleDisabled={changeScheduleDisabled}
          />

          <EditScheduleText
            data={editScheduleForm}
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
