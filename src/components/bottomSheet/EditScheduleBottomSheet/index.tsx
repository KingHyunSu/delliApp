import {useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useMemo} from 'react'
import {StyleSheet, ScrollView, Text, Pressable, TextStyle} from 'react-native'
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import {isAfter} from 'date-fns'

import BottomSheetHandler from '@/components/BottomSheetHandler'
import CustomBackdrop from './src/CustomBackdrop'
import ColorPanel from './src/ColorPanel'
import TimePanel from './src/TimePanel'
import DatePanel from './src/DatePanel'
import DayOfWeekPanel from './src/DayOfWeekPanel'
import CategoryPanel from './src/CategoryPanel'

import {useRecoilValue, useSetRecoilState} from 'recoil'
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

  const isEdit = useRecoilValue(isEditState)
  const editScheduleListSnapPoint = useRecoilValue(editScheduleListSnapPointState)
  const displayMode = useRecoilValue(displayModeState)
  const activeTheme = useRecoilValue(activeThemeState)

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

  const panelHeaderLabelStyle = useMemo(() => {
    return [styles.panelHeaderLabel, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const panelHeaderTitleStyle = useMemo(() => {
    return [styles.panelHeaderTitle, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const panelItemLabelStyle = useMemo(() => {
    return [styles.panelItemLabel, {color: activeTheme.color3}] as TextStyle
  }, [activeTheme.color3])

  const titleButtonStyle = useMemo(() => {
    const borderBottomColor = displayMode === 1 ? '#eeeded' : activeTheme.color2

    return [styles.titleButton, {borderBottomColor}]
  }, [displayMode, activeTheme.color2])

  const handleBottomSheetChanged = useCallback((index: number) => {
    setEditScheduleListStatus(index)

    if (index === 0) {
      closeAllPanel()
    }
  }, [])

  const panelBorderColor = useMemo(() => {
    return displayMode === 1 ? '#eeeded' : activeTheme.color2
  }, [displayMode, activeTheme.color2])

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
      onChange({...data, background_color: color})
    },
    [data, onChange]
  )

  const changeTextColor = useCallback(
    (color: string) => {
      onChange({...data, text_color: color})
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
    }
  }, [bottomSheetRef, isEdit])

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
        <Pressable style={titleButtonStyle} onPress={focusTitleInput}>
          {data.title ? (
            <Text style={[styles.titleText, {color: activeTheme.color3}]}>{data.title}</Text>
          ) : (
            <Text style={titleTextStyle}>일정명을 입력해주세요</Text>
          )}
        </Pressable>

        {/* 카테고리 */}
        {/*<CategoryPanel*/}
        {/*  data={data}*/}
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
        {/*  data={data}*/}
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
  titleButton: {
    paddingVertical: 20,
    borderBottomWidth: 1
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24
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

const titleTextStyle = StyleSheet.compose(styles.titleText, styles.titlePlaceHoldText)

export default EditScheduleBottomSheet
