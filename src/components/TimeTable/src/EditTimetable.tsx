import {useMemo, useCallback} from 'react'
import {StyleSheet, View, Pressable} from 'react-native'
import {Svg} from 'react-native-svg'
import {colorKit} from 'reanimated-color-picker'

import Outline from '../components/Outline'
import Background from '../components/Background'
import SchedulePie from '../components/SchedulePie'
import ScheduleText from '../components/ScheduleText'
import EditSchedulePie from '../components/EditSchedulePie'
import EditScheduleText from '../components/EditScheduleText'

import {useRecoilState, useRecoilValue} from 'recoil'
import {activeOutlineState, timetableContainerHeightState, timetableWrapperSizeState} from '@/store/system'
import {disableScheduleListState, isInputModeState, editScheduleFormState} from '@/store/schedule'

import {getScheduleColorList} from '../util'

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

  const radius = useMemo(() => {
    return timetableWrapperSize - 40
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
    if (colorThemeDetail.is_active_color_theme) {
      return colorThemeDetail.color_theme_item_list.sort((a, b) => a.order - b.order)
    }
    return null
  }, [colorThemeDetail])

  const scheduleColorList = useMemo(() => {
    return getScheduleColorList(data, colorThemeItemList)
  }, [data, colorThemeItemList])

  const editScheduleColor = useMemo(() => {
    if (colorThemeDetail.is_active_color_theme) {
      const backgroundColor = colorThemeDetail.color_theme_item_list[0].color
      const textColor = colorKit.isDark(backgroundColor) ? '#ffffff' : '#000000'

      return {
        backgroundColor,
        textColor
      }
    }

    return {
      backgroundColor: '#ffffff',
      textColor: '#000000'
    }
  }, [colorThemeDetail])

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
                  color={scheduleColorList[index].backgroundColor}
                  isEdit={true}
                  disableScheduleList={disableScheduleList}
                />
              )
            })}
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
              />
            )
          })}
        </View>

        <View style={styles.editContainer}>
          <EditSchedulePie
            data={editScheduleForm}
            scheduleList={data}
            centerX={timetableWrapperSize}
            centerY={timetableWrapperSize}
            radius={radius}
            color={editScheduleColor.backgroundColor}
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
            color={editScheduleColor.textColor}
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
