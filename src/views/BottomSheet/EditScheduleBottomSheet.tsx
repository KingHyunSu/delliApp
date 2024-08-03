import React from 'react'
import {StyleSheet, ViewStyle, ScrollView, TextStyle, View, Text, Pressable, TextInput} from 'react-native'
import Switch from '@/components/Swtich'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import type {returnedResults} from 'reanimated-color-picker'

import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import ColorPicker from '@/components/ColorPicker'
import DatePicker from '@/components/DatePicker'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {editScheduleListSnapPointState, isEditState} from '@/store/system'
import {scheduleState, scheduleDayOfWeekIndexState, isInputModeState} from '@/store/schedule'
import {showTimeWheelModalState} from '@/store/modal'

import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import {getTimeOfMinute} from '@/utils/helper'
import {RANGE_FLAG} from '@/utils/types'
import {isAfter} from 'date-fns'
// import {getTime, startOfToday, setMinutes} from 'date-fns'
// import notifee, {TimestampTrigger, TriggerType, RepeatFrequency} from '@notifee/react-native'

import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {DAY_OF_WEEK} from '@/types/common'
import TimeWheelModal from '@/views/Modal/TimeWheelModal'

const defaultPanelHeight = 74
const defaultItemPanelHeight = 56
const defaultFullColorPanelItemHeight = 320
const defaultFullDateItemPanelHeight = 426
// const alarmWheelTimeList = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']

const EditScheduleBottomSheet = React.memo(() => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetScrollViewRef = React.useRef<ScrollView>(null)

  const editScheduleListSnapPoint = useRecoilValue(editScheduleListSnapPointState)
  const isEdit = useRecoilValue(isEditState)
  const scheduleDayOfWeekIndex = useRecoilValue(scheduleDayOfWeekIndexState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const setIsInputMode = useSetRecoilState(isInputModeState)
  const setShowTimeWheelModal = useSetRecoilState(showTimeWheelModalState)

  const [activeColorPanel, setActiveColorPanel] = React.useState(false)
  const [activeDatePanel, setActiveDatePanel] = React.useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = React.useState(false)
  const [activeAlarmPanel, setActiveAlarmPanel] = React.useState(false)
  const [colorFlag, setColorFlag] = React.useState<'background' | 'text'>('background')
  const [dateFlag, setDateFlag] = React.useState<RANGE_FLAG>(RANGE_FLAG.START)

  // const [alarmWheelIndex, setAlarmWheelIndex] = React.useState(1)

  const colorPanelHeight = useSharedValue(defaultPanelHeight)
  const backgroundColorPanelHeight = useSharedValue(defaultItemPanelHeight)
  const textColorPanelHeight = useSharedValue(defaultItemPanelHeight)
  const datePanelHeight = useSharedValue(defaultPanelHeight)
  const dateStartPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dateEndPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dayOfWeekPanelHeight = useSharedValue(defaultPanelHeight)
  const alarmPanelHeight = useSharedValue(defaultPanelHeight)

  // color panel style
  const colorPanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: colorPanelHeight.value
  }))
  const backgroundColorPanelItemStyle = useAnimatedStyle(() => ({
    ...styles.panelItemWrapper,
    height: backgroundColorPanelHeight.value
  }))
  const textColorPanelItemHeightStyle = useAnimatedStyle(() => ({
    height: textColorPanelHeight.value
  }))
  const textColorPanelItemStyle = React.useMemo(() => {
    return [
      styles.panelItemWrapper,
      textColorPanelItemHeightStyle,
      colorFlag === 'background' && {borderTopWidth: 1, borderTopColor: '#eeeded'}
    ]
  }, [colorFlag])

  // time panel style
  const timePanelContainerStyle = React.useMemo(() => {
    return {
      ...styles.panel,
      height: defaultPanelHeight
    }
  }, [])

  // date panel style
  const datePanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: datePanelHeight.value
  }))
  const startDatePanelItemStyle = useAnimatedStyle(() => ({
    ...styles.panelItemWrapper,
    height: dateStartPanelHeight.value
  }))
  const endDatePanelItemHeightStyle = useAnimatedStyle(() => ({
    height: dateEndPanelHeight.value
  }))
  const endDatePanelItemStyle = React.useMemo(() => {
    return [
      styles.panelItemWrapper,
      endDatePanelItemHeightStyle,
      dateFlag === RANGE_FLAG.START && {borderTopWidth: 1, borderTopColor: '#eeeded'}
    ]
  }, [dateFlag])

  // day of week panel style
  const dayOfWeekPanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: dayOfWeekPanelHeight.value
  }))
  // const alarmPanelContainerStyle = useAnimatedStyle(() => ({
  //   ...styles.panel,
  //   height: alarmPanelHeight.value
  // }))

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.start_time)
  }, [schedule.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.end_time)
  }, [schedule.end_time])

  const endDate = React.useMemo(() => {
    return schedule.end_date !== '9999-12-31' ? schedule.end_date : '없음'
  }, [schedule.end_date])

  // const isActiveAlarm = React.useMemo(() => {
  //   return schedule.alarm !== 0
  // }, [schedule.alarm])

  const startDatePanelItemHeaderWrapperStyle = React.useMemo(() => {
    return [styles.panelItemButton, dateFlag === RANGE_FLAG.START && styles.panelItemActiveButton]
  }, [dateFlag])
  const startDatePanelItemHeaderTextStyle = React.useMemo(() => {
    return [styles.panelItemButtonText, dateFlag === RANGE_FLAG.START && styles.panelItemActiveButtonText]
  }, [dateFlag])
  const endDatePanelItemHeaderWrapperStyle = React.useMemo(() => {
    return [styles.panelItemButton, dateFlag === RANGE_FLAG.END && styles.panelItemActiveButton]
  }, [dateFlag])
  const endDatePanelItemHeaderTextStyle = React.useMemo(() => {
    return [styles.panelItemButtonText, dateFlag === RANGE_FLAG.END && styles.panelItemActiveButtonText]
  }, [dateFlag])

  const closeAllPanel = () => {
    setActiveColorPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveAlarmPanel(false)
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
    setActiveAlarmPanel(false)
  }, [activeColorPanel])
  const handleColorPanelItem = React.useCallback(
    (flag: 'background' | 'text') => () => {
      setColorFlag(flag)
    },
    []
  )

  const handleTimePanel = React.useCallback(() => {
    setShowTimeWheelModal(true)
    closeAllPanel()
  }, [setShowTimeWheelModal])

  const handleDatePanel = React.useCallback(() => {
    setActiveColorPanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveDatePanel(!activeDatePanel)
    setActiveAlarmPanel(false)
  }, [activeDatePanel])

  const handleDayOfWeekPanel = React.useCallback(() => {
    setActiveColorPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(!activeDayOfWeekPanel)
    setActiveAlarmPanel(false)
  }, [activeDayOfWeekPanel])

  // const handleAlarmPanel = React.useCallback(() => {
  //   setActiveDatePanel(false)
  //   setActiveDayOfWeekPanel(false)
  //   if (isActiveAlarm) {
  //     setActiveAlarmPanel(!activeAlarmPanel)
  //   }
  // }, [isActiveAlarm, activeAlarmPanel])
  const handleStartDatePanel = React.useCallback(() => {
    if (schedule.schedule_id) {
      return
    }

    setDateFlag(RANGE_FLAG.START)
  }, [schedule.schedule_id])
  const handleEndDatePanel = React.useCallback(() => {
    setDateFlag(RANGE_FLAG.END)
  }, [])

  const getDayOfWeekTitleStyle = React.useCallback((flag: string) => {
    let dayOfWeekTitleStyle: TextStyle[] = [styles.panelHeaderTitle, styles.disableDayOfWeekText]

    if (flag === '1') {
      dayOfWeekTitleStyle = [...dayOfWeekTitleStyle, styles.activeDayOfWeekText]
    }

    return dayOfWeekTitleStyle
  }, [])

  const getDayOfWeekSelectButtonStyle = React.useCallback((flag: string) => {
    let dayOfWeekSelectButtonStyle: ViewStyle[] = [styles.dayOfWeek]

    if (flag === '1') {
      dayOfWeekSelectButtonStyle = [...dayOfWeekSelectButtonStyle, styles.activeDayOfWeek]
    }

    return dayOfWeekSelectButtonStyle
  }, [])

  const getDayOfWeekSelectButtonTextStyle = React.useCallback(
    (flag: string, index: number) => {
      let dayOfWeekSelectButtonTextStyle: TextStyle[] = [styles.dayofWeekText]

      if (flag === '1') {
        dayOfWeekSelectButtonTextStyle = [...dayOfWeekSelectButtonTextStyle, styles.activeDayOfWeekText]
      }

      if (index === scheduleDayOfWeekIndex) {
        dayOfWeekSelectButtonTextStyle.push({fontFamily: 'Pretendard-Bold'})
      }

      return dayOfWeekSelectButtonTextStyle
    },
    [scheduleDayOfWeekIndex]
  )

  const focusTitleInput = React.useCallback(() => {
    bottomSheetRef.current?.collapse()
    setIsInputMode(true)
  }, [setIsInputMode])

  const changeBackgroundColor = React.useCallback(
    (color: returnedResults) => {
      setSchedule(prevState => ({
        ...prevState,
        background_color: color.hex
      }))
    },
    [setSchedule]
  )

  const changeTextColor = React.useCallback(
    (color: returnedResults) => {
      setSchedule(prevState => ({
        ...prevState,
        text_color: color.hex
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

  const changeDayOfWeek = React.useCallback(
    (key: DAY_OF_WEEK, index: number) => () => {
      if (index === scheduleDayOfWeekIndex) {
        return
      }

      const flag = schedule[key] === '1' ? '0' : '1'

      setSchedule(prevState => ({...prevState, [key]: flag}))
    },
    [scheduleDayOfWeekIndex, schedule, setSchedule]
  )

  // const changeAlarm = React.useCallback(
  //   (index: number) => {
  //     setSchedule(prevState => ({...prevState, alarm: (index + 1) * 5}))
  //   },
  //   [setSchedule]
  // )
  //
  // const changeAlarmSwitch = React.useCallback(
  //   (value: boolean) => {
  //     if (value) {
  //       setActiveDatePanel(false)
  //       setActiveDayOfWeekPanel(false)
  //
  //       changeAlarm(alarmWheelIndex)
  //     } else {
  //       setSchedule(prevState => ({...prevState, alarm: 0}))
  //     }
  //
  //     setActiveAlarmPanel(value)
  //   },
  //   [alarmWheelIndex]
  // )

  // const setDailyNotification = async (data: Schedule) => {
  //   let time = getTime(setMinutes(startOfToday(), schedule.start_time - schedule.alarm))
  //   const currentTime = new Date().getTime()

  //   if (time < currentTime) {
  //     time += 1000 * 60 * 60 * 24 // 1 day after
  //   }

  //   const trigger: TimestampTrigger = {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: time,
  //     repeatFrequency: RepeatFrequency.DAILY
  //   }

  //   await notifee.createTriggerNotification(
  //     {
  //       id: `${data.schedule_id}`,
  //       title: '델리',
  //       body: data.title,
  //       android: {
  //         channelId: 'schedule'
  //       }
  //     },
  //     trigger
  //   )
  // }

  // const setWeeklyNotification = async (data: Schedule, alarmList: string[]) => {
  //   const time = getTime(setMinutes(startOfToday(), schedule.start_time - schedule.alarm))

  //   let today = new Date().getDay() - 1
  //   if (today === -1) {
  //     // 일요일
  //     today = 6
  //   }

  //   const day = 1000 * 60 * 60 * 24

  //   await Promise.all(
  //     alarmList
  //       .filter(item => item === '1')
  //       .map(async (item, index) => {
  //         let newTime = time

  //         if (index < today) {
  //           newTime += day * 7
  //         } else if (index > today) {
  //           newTime += (index - today) * day
  //         }

  //         const trigger: TimestampTrigger = {
  //           type: TriggerType.TIMESTAMP,
  //           timestamp: newTime,
  //           repeatFrequency: RepeatFrequency.WEEKLY
  //         }

  //         await notifee.createTriggerNotification(
  //           {
  //             id: `${data.schedule_id}-${index}`,
  //             title: '델리',
  //             body: data.title,
  //             android: {
  //               channelId: 'schedule'
  //             }
  //           },
  //           trigger
  //         )
  //       })
  //   )
  // }

  // const handleNotification = React.useCallback(async () => {
  //   try {
  //     await notifee.requestPermission()

  //     const isChannel = await notifee.getChannel('schedule')

  //     if (!isChannel) {
  //       await notifee.createChannel({
  //         id: 'schedule',
  //         name: 'schedule'
  //       })
  //     }

  //     const alarmList = [
  //       schedule.mon,
  //       schedule.thu,
  //       schedule.wed,
  //       schedule.thu,
  //       schedule.fri,
  //       schedule.sat,
  //       schedule.sun
  //     ]

  //     let triggerNotificationIds = await notifee.getTriggerNotificationIds()
  //     triggerNotificationIds.filter(item => item.includes(String(schedule.schedule_id)))

  //     const isWeekly = alarmList.some(item => item === '0')

  //     if (isWeekly) {
  //       await setWeeklyNotification(schedule, alarmList)
  //     } else {
  //       await setDailyNotification(schedule)
  //     }
  //   } catch (e) {
  //     throw e
  //   }
  // }, [
  //   schedule.alarm,
  //   schedule.schedule_id,
  //   schedule.start_time,
  //   schedule.title,
  //   setDailyNotification,
  //   setWeeklyNotification
  // ])

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

  // React.useEffect(() => {
  //   if (schedule.alarm > 0) {
  //     setAlarmWheelIndex(schedule.alarm / 5 - 1)
  //   }
  // }, [schedule.alarm])

  React.useEffect(() => {
    // open panel
    if (activeColorPanel) {
      colorPanelHeight.value = withTiming(defaultPanelHeight + defaultItemPanelHeight + defaultFullColorPanelItemHeight)
    }
    if (activeDatePanel) {
      datePanelHeight.value = withTiming(
        defaultPanelHeight + defaultItemPanelHeight + defaultFullDateItemPanelHeight + 3
      )
    }
    if (activeDayOfWeekPanel) {
      dayOfWeekPanelHeight.value = withTiming(defaultPanelHeight + 77)
    }
    if (activeAlarmPanel) {
      alarmPanelHeight.value = withTiming(defaultPanelHeight + 160)
    }

    // close panel
    if (!activeColorPanel) {
      colorPanelHeight.value = withTiming(defaultPanelHeight)
    }
    if (!activeDatePanel) {
      datePanelHeight.value = withTiming(defaultPanelHeight)
    }
    if (!activeDayOfWeekPanel) {
      dayOfWeekPanelHeight.value = withTiming(defaultPanelHeight)
    }
    if (!activeAlarmPanel) {
      alarmPanelHeight.value = withTiming(defaultPanelHeight)
    }
  }, [activeColorPanel, activeDatePanel, activeDayOfWeekPanel, activeAlarmPanel])

  React.useEffect(() => {
    if (schedule.schedule_id) {
      setDateFlag(RANGE_FLAG.END)
    }
  }, [schedule.schedule_id])

  React.useEffect(() => {
    if (colorFlag === 'background') {
      backgroundColorPanelHeight.value = withTiming(defaultFullColorPanelItemHeight)
      textColorPanelHeight.value = withTiming(defaultItemPanelHeight)
    } else if (colorFlag === 'text') {
      backgroundColorPanelHeight.value = withTiming(defaultItemPanelHeight)
      textColorPanelHeight.value = withTiming(defaultFullColorPanelItemHeight)
    }
  }, [colorFlag])

  React.useEffect(() => {
    if (dateFlag === RANGE_FLAG.END) {
      dateStartPanelHeight.value = withTiming(defaultItemPanelHeight)
      dateEndPanelHeight.value = withTiming(defaultFullDateItemPanelHeight)
    } else if (dateFlag === RANGE_FLAG.START) {
      dateStartPanelHeight.value = withTiming(defaultFullDateItemPanelHeight)
      dateEndPanelHeight.value = withTiming(defaultItemPanelHeight)
    }
  }, [dateFlag])

  if (editScheduleListSnapPoint.length === 0) {
    return <></>
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={editScheduleListSnapPoint}
      handleComponent={BottomSheetShadowHandler}
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
        <Animated.View style={colorPanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleColorPanel}>
            <View style={styles.panelHeaderBox}>
              <Text style={styles.panelHeaderLabel}>색상</Text>
              <View style={{paddingVertical: 5, paddingHorizontal: 12, borderRadius: 7, backgroundColor: '#1E90FF'}}>
                <Text style={[styles.panelHeaderTitle, {fontFamily: 'Pretendard-Medium', color: '#fff'}]}>일정명</Text>
              </View>
            </View>

            {activeColorPanel ? <ArrowDownIcon stroke="#424242" /> : <ArrowUpIcon stroke="#424242" />}
          </Pressable>

          <View style={styles.panelItemContainer}>
            <Animated.View style={backgroundColorPanelItemStyle}>
              <Pressable style={panelItemHeaderContainerStyle} onPress={handleColorPanelItem('background')}>
                <Text style={styles.panelItemLabel}>배경색</Text>
              </Pressable>

              <ColorPicker value={schedule.background_color} onChange={changeBackgroundColor} />
            </Animated.View>

            <Animated.View style={textColorPanelItemStyle}>
              <Pressable style={panelItemHeaderContainerStyle} onPress={handleColorPanelItem('text')}>
                <Text style={styles.panelItemLabel}>글자색</Text>
              </Pressable>

              <ColorPicker value={schedule.text_color} onChange={changeTextColor} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* 시간 */}
        <View style={timePanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleTimePanel}>
            <View style={styles.panelHeaderTextBox}>
              <Text style={styles.panelHeaderLabel}>시간</Text>
              <Text style={styles.panelHeaderTitle}>
                {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분 ~ ${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
              </Text>
            </View>

            <ArrowRightIcon stroke="#424242" strokeWidth={3} width={16} height={16} />
          </Pressable>
        </View>

        {/* 기간 */}
        <Animated.View style={datePanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleDatePanel}>
            <View style={styles.panelHeaderTextBox}>
              <Text style={styles.panelHeaderLabel}>기간</Text>
              <Text style={styles.panelHeaderTitle}>{`${schedule.start_date} ~ ${endDate}`}</Text>
            </View>

            {activeDatePanel ? <ArrowDownIcon stroke="#424242" /> : <ArrowUpIcon stroke="#424242" />}
          </Pressable>

          <View style={styles.panelItemContainer}>
            <Animated.View style={startDatePanelItemStyle}>
              <View style={panelItemHeaderContainerStyle}>
                <Text style={styles.panelItemLabel}>시작일</Text>

                <Pressable style={startDatePanelItemHeaderWrapperStyle} onPress={handleStartDatePanel}>
                  <Text style={startDatePanelItemHeaderTextStyle}>{schedule.start_date}</Text>
                </Pressable>
              </View>

              <View style={styles.panelItemContents}>
                <DatePicker value={schedule.start_date} onChange={changeStartDate} />
              </View>
            </Animated.View>

            <Animated.View style={endDatePanelItemStyle}>
              <View style={panelItemHeaderContainerStyle}>
                <Text style={styles.panelItemLabel}>종료일</Text>

                <Pressable style={endDatePanelItemHeaderWrapperStyle} onPress={handleEndDatePanel}>
                  <Text style={endDatePanelItemHeaderTextStyle}>{endDate}</Text>
                </Pressable>
              </View>

              <View style={styles.panelItemContents}>
                <DatePicker
                  value={schedule.end_date}
                  hasNull
                  disableDate={schedule.start_date}
                  onChange={changeEndDate}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* 요일 */}
        <Animated.View style={dayOfWeekPanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleDayOfWeekPanel}>
            <View style={styles.panelHeaderTextBox}>
              <Text style={styles.panelHeaderLabel}>요일</Text>
              <View style={styles.dateOfWeekTitleContainer}>
                <Text style={getDayOfWeekTitleStyle(schedule.mon)}>월</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.tue)}>화</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.wed)}>수</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.thu)}>목</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.fri)}>금</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.sat)}>토</Text>
                <Text style={getDayOfWeekTitleStyle(schedule.sun)}>일</Text>
              </View>
            </View>

            {activeDayOfWeekPanel ? <ArrowDownIcon stroke="#424242" /> : <ArrowUpIcon stroke="#424242" />}
          </Pressable>

          <View style={styles.dayOfWeekContainer}>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.mon)} onPress={changeDayOfWeek('mon', 0)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.mon, 0)}>월</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.tue)} onPress={changeDayOfWeek('tue', 1)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.tue, 1)}>화</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.wed)} onPress={changeDayOfWeek('wed', 2)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.wed, 2)}>수</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.thu)} onPress={changeDayOfWeek('thu', 3)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.thu, 3)}>목</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.fri)} onPress={changeDayOfWeek('fri', 4)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.fri, 4)}>금</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.sat)} onPress={changeDayOfWeek('sat', 5)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.sat, 5)}>토</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.sun)} onPress={changeDayOfWeek('sun', 6)}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.sun, 6)}>일</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* 알람 */}
        {/* <Animated.View style={alarmPanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleAlarmPanel}>
            <View style={styles.panelHeaderTextBox}>
              <Text style={styles.panelHeaderLabel}>알람</Text>
              <Text style={styles.panelHeaderTitle}>{isActiveAlarm ? `${schedule.alarm}분 전` : '없음'}</Text>
            </View>

            <Switch value={isActiveAlarm} onChange={changeAlarmSwitch} />
          </Pressable>

          <View style={styles.panelItemContainer}>
            <WheelPicker
              options={alarmWheelTimeList}
              selectedIndex={alarmWheelIndex}
              visibleRest={1}
              containerStyle={styles.alarmWheelContainer}
              selectedIndicatorStyle={styles.alarmWheelSelectedWrapper}
              itemTextStyle={styles.alarmWheelText}
              onChange={changeAlarm}
            />
          </View>
        </Animated.View> */}
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
  panel: {
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    overflow: 'hidden'
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  panelHeaderBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16
  },
  panelHeaderTextBox: {
    gap: 5
  },
  panelHeaderLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Light',
    color: '#424242'
  },
  panelHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  panelItemContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eeeded'
  },
  panelItemWrapper: {
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  panelItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  panelItemContents: {
    paddingTop: 20
  },
  panelItemLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  panelItemButton: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#f5f6f8'
  },
  panelItemButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#7c8698',
    textAlign: 'center'
  },
  panelItemActiveButton: {
    backgroundColor: '#1E90FF',
    borderWidth: 0
  },
  panelItemActiveButtonText: {
    color: '#fff'
  },

  dateOfWeekTitleContainer: {
    flexDirection: 'row',
    gap: 5
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeded',
    paddingTop: 20
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 36,
    height: 36
  },
  dayofWeekText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#babfc5'
  },
  activeDayOfWeekText: {
    color: '#1E90FF'
  },
  disableDayOfWeekText: {
    color: '#babfc5'
  },
  activeDayOfWeek: {
    borderColor: '#424242'
  },
  alarmWheelContainer: {
    marginTop: 20,
    marginHorizontal: 16
  },
  alarmWheelSelectedWrapper: {
    backgroundColor: '#f5f6f8',
    borderRadius: 10
  },
  alarmWheelText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#7c8698'
  }
})

const titleTextStyle = StyleSheet.compose(styles.titleText, styles.titlePlaceHoldText)
const panelHeaderStyle = StyleSheet.compose(styles.panelHeader, {height: defaultPanelHeight})
const panelItemHeaderContainerStyle = StyleSheet.compose(styles.panelItemHeader, {height: defaultItemPanelHeight})

export default EditScheduleBottomSheet
