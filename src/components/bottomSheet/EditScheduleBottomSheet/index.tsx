import {useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useMemo} from 'react'
import {TextStyle, Keyboard, StyleSheet, ScrollView, TextInput} from 'react-native'
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import {isAfter} from 'date-fns'

import BottomSheetHandler from '@/components/BottomSheetHandler'
import CustomBackdrop from './src/CustomBackdrop'
import TimePanel from './src/TimePanel'
import DatePanel from './src/DatePanel'
import DayOfWeekPanel from './src/DayOfWeekPanel'
import CategoryPanel from './src/CategoryPanel'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {
  editScheduleListSnapPointState,
  isEditState,
  editScheduleListStatusState,
  activeThemeState,
  displayModeState
} from '@/store/system'
import {isInputModeState} from '@/store/schedule'

import {RANGE_FLAG} from '@/utils/types'

import {showScheduleCategorySelectorBottomSheetState} from '@/store/bottomSheet'
import {DAY_OF_WEEK} from '@/types/common'
import type {DayOfWeeks} from './src/DayOfWeekPanel'

export interface EditScheduleBottomSheetRef {
  collapse: () => void
}
interface Props {
  data: EditScheduleForm
  onChange: (value: EditScheduleForm) => void
}
const EditScheduleBottomSheet = forwardRef<EditScheduleBottomSheetRef, Props>(({data, onChange}, ref) => {
  const defaultItemPanelHeight = 56

  const bottomSheetRef = useRef<BottomSheet>(null)
  const bottomSheetScrollViewRef = useRef<ScrollView>(null)

  const [editScheduleListStatus, setEditScheduleListStatus] = useRecoilState(editScheduleListStatusState)
  const [isInputMode, setIsInputMode] = useRecoilState(isInputModeState)

  const isEdit = useRecoilValue(isEditState)
  const editScheduleListSnapPoint = useRecoilValue(editScheduleListSnapPointState)
  const displayMode = useRecoilValue(displayModeState)
  const activeTheme = useRecoilValue(activeThemeState)

  const showScheduleCategorySelectorBottomSheet = useSetRecoilState(showScheduleCategorySelectorBottomSheetState)

  const [activeTimePanel, setActiveTimePanel] = useState(false)
  const [activeDatePanel, setActiveDatePanel] = useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = useState(false)

  const closeAllPanel = () => {
    setActiveTimePanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
  }

  const panelHeaderLabelStyle = useMemo(() => {
    return [styles.panelHeaderLabel, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const panelHeaderTitleStyle = useMemo(() => {
    return [styles.panelHeaderTitle, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const panelItemLabelStyle = useMemo(() => {
    return [styles.panelItemLabel, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const titleStyle = useMemo(() => {
    const borderBottomColor = displayMode === 1 ? '#eeeded' : activeTheme.color2

    return [styles.title, {borderBottomColor, color: activeTheme.color3}]
  }, [displayMode, activeTheme.color2, activeTheme.color3])

  const handleBottomSheetChanged = useCallback(
    (index: number) => {
      setEditScheduleListStatus(index)

      if (editScheduleListStatus === 1 && index === 0) {
        closeAllPanel()
        Keyboard.dismiss()
      }
    },
    [editScheduleListStatus, setEditScheduleListStatus]
  )

  const panelBorderColor = useMemo(() => {
    return displayMode === 1 ? '#eeeded' : activeTheme.color2
  }, [displayMode, activeTheme.color2])

  const handleCategoryPanel = useCallback(() => {
    closeAllPanel()
    showScheduleCategorySelectorBottomSheet(true)
  }, [])

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
    if (editScheduleListStatus === 0) {
      setIsInputMode(true)
    }
  }, [editScheduleListStatus, setIsInputMode])

  const changeTitle = useCallback(
    (value: string) => {
      onChange({...data, title: value})
    },
    [data, onChange]
  )

  const changeDate = useCallback(
    (date: string, flag: RANGE_FLAG) => {
      if (flag === RANGE_FLAG.START) {
        onChange({...data, start_date: date})
      } else if (flag === RANGE_FLAG.END) {
        onChange({...data, end_date: date})
      }
    },
    [data, onChange]
  )

  const changeStartTime = useCallback(
    (time: number) => {
      onChange({...data, start_time: time})
    },
    [data, onChange]
  )

  const changeEndTime = useCallback(
    (time: number) => {
      onChange({...data, end_time: time})
    },
    [data, onChange]
  )

  const changeStartDate = useCallback(
    (date: string) => {
      if (isAfter(new Date(date), new Date(data.end_date))) {
        changeDate('9999-12-31', RANGE_FLAG.END)
      }
      changeDate(date, RANGE_FLAG.START)
    },
    [data.end_date, changeDate]
  )

  const changeEndDate = useCallback(
    (date: string) => {
      changeDate(date, RANGE_FLAG.END)
    },
    [changeDate]
  )

  const changeDayOfWeek = useCallback(
    (key: DAY_OF_WEEK) => {
      const flag = data[key] === '1' ? '0' : '1'

      onChange({...data, [key]: flag})
    },
    [data, onChange]
  )

  const changeDayOfWeeks = useCallback(
    (value: DayOfWeeks) => {
      onChange({
        ...data,
        ...value
      })
    },
    [data, onChange]
  )

  useEffect(() => {
    if (isEdit) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.close()
      bottomSheetScrollViewRef.current?.scrollTo({y: 0})
      closeAllPanel()
      setEditScheduleListStatus(0)
    }
  }, [bottomSheetRef, isEdit, setEditScheduleListStatus])

  useEffect(() => {
    if (isInputMode) {
      bottomSheetRef.current?.collapse()
    }
  }, [isInputMode])

  useImperativeHandle(
    ref,
    () => {
      return {
        collapse() {
          bottomSheetRef.current?.collapse()
          bottomSheetScrollViewRef.current?.scrollTo({y: 0})
          closeAllPanel()
        }
      }
    },
    []
  )

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

  const getBackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => {
      return <CustomBackdrop props={props} activeTheme={activeTheme} />
    },
    [activeTheme]
  )

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={editScheduleListSnapPoint}
      backgroundStyle={{backgroundColor: activeTheme.color5, borderTopLeftRadius: 40, borderTopRightRadius: 40}}
      handleComponent={bottomSheetHandler}
      backdropComponent={getBackdropComponent}
      onChange={handleBottomSheetChanged}>
      <BottomSheetScrollView ref={bottomSheetScrollViewRef} bounces={false} contentContainerStyle={styles.container}>
        {/* 일정명 */}
        <TextInput
          style={titleStyle}
          value={data.title}
          placeholder="일정명을 입력해주세요"
          placeholderTextColor="#c3c5cc"
          onPress={focusTitleInput}
          onChangeText={changeTitle}
        />

        {/* 카테고리 */}
        {/*<CategoryPanel*/}
        {/*  data={data}*/}
        {/*  headerContainerStyle={styles.panelHeaderContainer}*/}
        {/*  headerTitleWrapper={styles.panelHeaderTitleWrapper}*/}
        {/*  headerLabelStyle={styles.panelHeaderLabel}*/}
        {/*  headerTitleStyle={styles.panelHeaderTitle}*/}
        {/*  handleExpansion={handleCategoryPanel}*/}
        {/*/>*/}

        {/* 시간 */}
        <TimePanel
          value={activeTimePanel}
          data={data}
          displayMode={displayMode}
          borderColor={panelBorderColor}
          itemPanelHeight={defaultItemPanelHeight}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={panelHeaderLabelStyle}
          headerTitleStyle={panelHeaderTitleStyle}
          itemHeaderLabelStyle={panelItemLabelStyle}
          handleExpansion={handleTimePanel}
          changeStartTime={changeStartTime}
          changeEndTime={changeEndTime}
        />

        {/* 기간 */}
        <DatePanel
          value={activeDatePanel}
          data={data}
          activeTheme={activeTheme}
          displayMode={displayMode}
          borderColor={panelBorderColor}
          itemPanelHeight={defaultItemPanelHeight}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={panelHeaderLabelStyle}
          headerTitleStyle={panelHeaderTitleStyle}
          itemHeaderLabelStyle={panelItemLabelStyle}
          handleExpansion={handleDatePanel}
          changeStartDate={changeStartDate}
          changeEndDate={changeEndDate}
        />

        {/* 요일 */}
        <DayOfWeekPanel
          value={activeDayOfWeekPanel}
          data={data}
          activeTheme={activeTheme}
          displayMode={displayMode}
          headerContainerStyle={styles.panelHeaderContainer}
          headerTitleWrapper={styles.panelHeaderTitleWrapper}
          headerLabelStyle={panelHeaderLabelStyle}
          headerTitleStyle={panelHeaderTitleStyle}
          handleExpansion={handleDayOfWeekPanel}
          changeDayOfWeek={changeDayOfWeek}
          changeDayOfWeeks={changeDayOfWeeks}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 128,
    gap: 20
  },
  title: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24
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
    fontFamily: 'Pretendard-Medium'
  },
  panelHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium'
  },
  panelItemLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium'
  }
})

export default EditScheduleBottomSheet
