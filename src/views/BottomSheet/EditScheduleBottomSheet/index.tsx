import React from 'react'
import {StyleSheet, ScrollView, Text, Pressable} from 'react-native'
import BottomSheet, {BottomSheetHandleProps, BottomSheetScrollView} from '@gorhom/bottom-sheet'

import BottomSheetHandler from '@/components/BottomSheetHandler'
import ColorPanel from './src/ColorPanel'
import TimePanel from './src/TimePanel'
import DatePanel from './src/DatePanel'
import DayOfWeekPanel from './src/DayOfWeekPanel'

import TimeWheelModal from '@/views/Modal/TimeWheelModal'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {editScheduleListSnapPointState, isEditState} from '@/store/system'
import {scheduleState, isInputModeState} from '@/store/schedule'
import {showTimeWheelModalState} from '@/store/modal'

import {RANGE_FLAG} from '@/utils/types'
import {isAfter} from 'date-fns'

import {DAY_OF_WEEK} from '@/types/common'

const EditScheduleBottomSheet = React.memo(() => {
  const defaultItemPanelHeight = 56
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetScrollViewRef = React.useRef<ScrollView>(null)

  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const editScheduleListSnapPoint = useRecoilValue(editScheduleListSnapPointState)
  const isEdit = useRecoilValue(isEditState)

  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setShowTimeWheelModal = useSetRecoilState(showTimeWheelModalState)

  const [activeColorPanel, setActiveColorPanel] = React.useState(false)
  const [activeDatePanel, setActiveDatePanel] = React.useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = React.useState(false)

  const closeAllPanel = () => {
    setActiveColorPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
  }

  const handleBottomSheetChanged = React.useCallback((index: number) => {
    if (index === 0) {
      closeAllPanel()
    }
  }, [])

  const handleColorPanel = React.useCallback(() => {
    setActiveColorPanel(!activeColorPanel)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
  }, [activeColorPanel])

  const handleTimePanel = React.useCallback(() => {
    setShowTimeWheelModal(true)
    closeAllPanel()
  }, [setShowTimeWheelModal])

  const handleDatePanel = React.useCallback(() => {
    setActiveColorPanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveDatePanel(!activeDatePanel)
  }, [activeDatePanel])

  const handleDayOfWeekPanel = React.useCallback(() => {
    setActiveColorPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(!activeDayOfWeekPanel)
  }, [activeDayOfWeekPanel])

  const focusTitleInput = React.useCallback(() => {
    bottomSheetRef.current?.collapse()
    setIsInputMode(true)
  }, [setIsInputMode])

  const changeBackgroundColor = React.useCallback(
    (color: string) => {
      setSchedule(prevState => ({
        ...prevState,
        background_color: color
      }))
    },
    [setSchedule]
  )

  const changeTextColor = React.useCallback(
    (color: string) => {
      setSchedule(prevState => ({
        ...prevState,
        text_color: color
      }))
    },
    [setSchedule]
  )

  const changeDate = React.useCallback(
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

  const changeStartDate = React.useCallback(
    (date: string) => {
      if (isAfter(new Date(date), new Date(schedule.end_date))) {
        changeDate('9999-12-31', RANGE_FLAG.END)
      }
      changeDate(date, RANGE_FLAG.START)
    },
    [schedule.end_date, changeDate]
  )

  const changeEndDate = React.useCallback(
    (date: string) => {
      changeDate(date, RANGE_FLAG.END)
    },
    [changeDate]
  )

  const changeDayOfWeek = React.useCallback(
    (key: DAY_OF_WEEK) => {
      const flag = schedule[key] === '1' ? '0' : '1'

      setSchedule(prevState => ({...prevState, [key]: flag}))
    },
    [schedule, setSchedule]
  )

  React.useEffect(() => {
    if (bottomSheetRef.current) {
      if (isEdit) {
        bottomSheetRef.current.snapToIndex(0)
      } else {
        bottomSheetRef.current.close()

        bottomSheetScrollViewRef.current?.scrollTo({y: 0})
        closeAllPanel()
      }
    }
  }, [isEdit])

  // components
  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  if (editScheduleListSnapPoint.length === 0) {
    return <></>
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
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

        {/* 색상 */}
        <ColorPanel
          value={activeColorPanel}
          isEdit={isEdit}
          data={schedule}
          itemPanelHeight={defaultItemPanelHeight}
          headerContainerStyle={styles.panelHeaderContainer}
          headerLabelStyle={styles.panelHeaderLabel}
          itemHeaderContainerStyle={styles.panelItemHeader}
          itemHeaderLabelStyle={styles.panelItemLabel}
          handleExpansion={handleColorPanel}
          changeBackgroundColor={changeBackgroundColor}
          changeTextColor={changeTextColor}
        />

        {/* 시간 */}
        <TimePanel
          data={schedule}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={styles.panelHeaderLabel}
          headerTitleStyle={styles.panelHeaderTitle}
          handleExpansion={handleTimePanel}
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

      <TimeWheelModal />
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
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
    fontFamily: 'Pretendard-Light',
    color: '#424242'
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
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  }
})

const titleTextStyle = StyleSheet.compose(styles.titleText, styles.titlePlaceHoldText)

export default EditScheduleBottomSheet
