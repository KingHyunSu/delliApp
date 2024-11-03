import {useRef, useState, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, Text, Pressable} from 'react-native'
import BottomSheet, {BottomSheetHandleProps, BottomSheetScrollView} from '@gorhom/bottom-sheet'
import {isAfter} from 'date-fns'

import BottomSheetHandler from '@/components/BottomSheetHandler'
import ColorPanel from './src/ColorPanel'
import TimePanel from './src/TimePanel'
import DatePanel from './src/DatePanel'
import DayOfWeekPanel from './src/DayOfWeekPanel'
import CategoryPanel from './src/CategoryPanel'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {editScheduleListSnapPointState, isEditState, editScheduleListStatusState} from '@/store/system'
import {scheduleState, isInputModeState} from '@/store/schedule'

import {RANGE_FLAG} from '@/utils/types'

import {DAY_OF_WEEK} from '@/types/common'
import {showScheduleCategorySelectorBottomSheetState} from '@/store/bottomSheet'

const EditScheduleBottomSheet = () => {
  const defaultItemPanelHeight = 56

  const bottomSheetRef = useRef<BottomSheet>(null)
  const bottomSheetScrollViewRef = useRef<ScrollView>(null)

  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const isEdit = useRecoilValue(isEditState)
  const editScheduleListSnapPoint = useRecoilValue(editScheduleListSnapPointState)

  const setIsInputMode = useSetRecoilState(isInputModeState)
  const showScheduleCategorySelectorBottomSheet = useSetRecoilState(showScheduleCategorySelectorBottomSheetState)
  const setEditScheduleListStatus = useSetRecoilState(editScheduleListStatusState)

  const [activeColorPanel, setActiveColorPanel] = useState(false)
  const [activeTimePanel, setActiveTimePanel] = useState(false)
  const [activeDatePanel, setActiveDatePanel] = useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = useState(false)

  const closeAllPanel = () => {
    setActiveColorPanel(false)
    setActiveTimePanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
  }

  const handleBottomSheetChanged = useCallback((index: number) => {
    setEditScheduleListStatus(index)

    if (index === 0) {
      closeAllPanel()
    }
  }, [])

  const handleCategoryPanel = useCallback(() => {
    closeAllPanel()
    showScheduleCategorySelectorBottomSheet(true)
  }, [])

  const handleColorPanel = useCallback(() => {
    closeAllPanel()
    setActiveColorPanel(!activeColorPanel)
  }, [activeColorPanel])

  const handleTimePanel = useCallback(() => {
    closeAllPanel()
    setActiveTimePanel(!activeTimePanel)
  }, [activeTimePanel])

  const handleDatePanel = useCallback(() => {
    closeAllPanel()
    setActiveDatePanel(!activeDatePanel)
  }, [activeDatePanel])

  const handleDayOfWeekPanel = useCallback(() => {
    closeAllPanel()
    setActiveDayOfWeekPanel(!activeDayOfWeekPanel)
  }, [activeDayOfWeekPanel])

  const focusTitleInput = useCallback(() => {
    bottomSheetRef.current?.collapse()
    setIsInputMode(true)
  }, [setIsInputMode])

  const changeBackgroundColor = useCallback(
    (color: string) => {
      setSchedule(prevState => ({
        ...prevState,
        background_color: color
      }))
    },
    [setSchedule]
  )

  const changeTextColor = useCallback(
    (color: string) => {
      setSchedule(prevState => ({
        ...prevState,
        text_color: color
      }))
    },
    [setSchedule]
  )

  const changeDate = useCallback(
    (date: string, flag: RANGE_FLAG) => {
      if (flag === RANGE_FLAG.START) {
        setSchedule(prevState => ({
          ...prevState,
          start_date: date
        }))
      } else if (flag === RANGE_FLAG.END) {
        setSchedule(prevState => ({
          ...prevState,
          end_date: date
        }))
      }
    },
    [setSchedule]
  )

  const changeStartTime = useCallback(
    (time: number) => {
      setSchedule(prevState => ({
        ...prevState,
        start_time: time
      }))
    },
    [setSchedule]
  )

  const changeEndTime = useCallback(
    (time: number) => {
      setSchedule(prevState => ({
        ...prevState,
        end_time: time
      }))
    },
    [setSchedule]
  )

  const changeStartDate = useCallback(
    (date: string) => {
      if (isAfter(new Date(date), new Date(schedule.end_date))) {
        changeDate('9999-12-31', RANGE_FLAG.END)
      }
      changeDate(date, RANGE_FLAG.START)
    },
    [schedule.end_date, changeDate]
  )

  const changeEndDate = useCallback(
    (date: string) => {
      changeDate(date, RANGE_FLAG.END)
    },
    [changeDate]
  )

  const changeDayOfWeek = useCallback(
    (key: DAY_OF_WEEK) => {
      const flag = schedule[key] === '1' ? '0' : '1'

      setSchedule(prevState => ({...prevState, [key]: flag}))
    },
    [schedule, setSchedule]
  )

  useEffect(() => {
    if (isEdit) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.close()
      bottomSheetScrollViewRef.current?.scrollTo({y: 0})
      closeAllPanel()
    }
  }, [bottomSheetRef, isEdit])

  // components
  const bottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={editScheduleListSnapPoint}
      handleComponent={bottomSheetHandler}
      onChange={handleBottomSheetChanged}>
      <BottomSheetScrollView ref={bottomSheetScrollViewRef} contentContainerStyle={styles.container}>
        {/* 일정명 */}
        <Pressable style={styles.titleButton} onPress={focusTitleInput}>
          {schedule.title ? (
            <Text style={styles.titleText}>{schedule.title}</Text>
          ) : (
            <Text style={titleTextStyle}>일정명을 입력해주세요</Text>
          )}
        </Pressable>

        {/* 카테고리 */}
        {/*<CategoryPanel*/}
        {/*  data={schedule}*/}
        {/*  headerContainerStyle={styles.panelHeaderContainer}*/}
        {/*  headerTitleWrapper={styles.panelHeaderTitleWrapper}*/}
        {/*  headerLabelStyle={styles.panelHeaderLabel}*/}
        {/*  headerTitleStyle={styles.panelHeaderTitle}*/}
        {/*  handleExpansion={handleCategoryPanel}*/}
        {/*/>*/}

        {/* 색상 */}
        {/*<ColorPanel*/}
        {/*  value={activeColorPanel}*/}
        {/*  isEdit={isEdit}*/}
        {/*  data={schedule}*/}
        {/*  itemPanelHeight={defaultItemPanelHeight}*/}
        {/*  headerContainerStyle={styles.panelHeaderContainer}*/}
        {/*  headerLabelStyle={styles.panelHeaderLabel}*/}
        {/*  itemHeaderContainerStyle={styles.panelItemHeader}*/}
        {/*  itemHeaderLabelStyle={styles.panelItemLabel}*/}
        {/*  handleExpansion={handleColorPanel}*/}
        {/*  changeBackgroundColor={changeBackgroundColor}*/}
        {/*  changeTextColor={changeTextColor}*/}
        {/*/>*/}

        {/* 시간 */}
        <TimePanel
          value={activeTimePanel}
          data={schedule}
          itemPanelHeight={defaultItemPanelHeight}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={styles.panelHeaderLabel}
          headerTitleStyle={styles.panelHeaderTitle}
          itemHeaderLabelStyle={styles.panelItemLabel}
          handleExpansion={handleTimePanel}
          changeStartTime={changeStartTime}
          changeEndTime={changeEndTime}
        />

        {/* 기간 */}
        <DatePanel
          value={activeDatePanel}
          data={schedule}
          itemPanelHeight={defaultItemPanelHeight}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={styles.panelHeaderLabel}
          headerTitleStyle={styles.panelHeaderTitle}
          itemHeaderContainerStyle={styles.panelItemHeader}
          itemHeaderLabelStyle={styles.panelItemLabel}
          handleExpansion={handleDatePanel}
          changeStartDate={changeStartDate}
          changeEndDate={changeEndDate}
        />

        {/* 요일 */}
        <DayOfWeekPanel
          value={activeDayOfWeekPanel}
          data={schedule}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={styles.panelHeaderLabel}
          headerTitleStyle={styles.panelHeaderTitle}
          handleExpansion={handleDayOfWeekPanel}
          changeDayOfWeek={changeDayOfWeek}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 70,
    gap: 20
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  titleButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#000'
  },
  titlePlaceHoldText: {
    color: '#c3c5cc'
  },

  // expansion panel style
  panelHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  panelHeaderTitleWrapper: {
    gap: 5
  },
  panelHeaderLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#7c8698'
  },
  panelHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  },
  panelItemHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeded'
  },
  panelItemLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#7c8698'
  }
})

const titleTextStyle = StyleSheet.compose(styles.titleText, styles.titlePlaceHoldText)

export default EditScheduleBottomSheet
