import React from 'react'
import {StyleSheet, ViewStyle, ScrollView, TextStyle, View, Text, Pressable, TextInput} from 'react-native'
import Switch from '@/components/Swtich'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import TimeWheelPicker from '@/components/TimeWheelPicker'
import DatePicker from '@/components/DatePicker'
import WheelPicker from 'react-native-wheely'

import {useMutation} from '@tanstack/react-query'
import * as scheduleApi from '@/apis/schedule'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {scheduleState, disableScheduleListState, existScheduleListState} from '@/store/schedule'

import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import {getTimeOfMinute} from '@/utils/helper'
import {isAfter} from 'date-fns'
// import {getTime, startOfToday, setMinutes} from 'date-fns'
// import notifee, {TimestampTrigger, TriggerType, RepeatFrequency} from '@notifee/react-native'

import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

import {RANGE_FLAG} from '@/utils/types'
import {DAY_OF_WEEK} from '@/types/common'

interface Props {
  scheduleList: Schedule[]
  refetchScheduleList: Function
  titleInputRef: React.RefObject<TextInput>
}

const defaultPanelHeight = 74
const defaultItemPanelHeight = 56
const defaultFullTimeItemPanelHeight = 216
const defaultFullDateItemPanelHeight = 426
const alarmWheelTimeList = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']

const EditScheduleBottomSheet = React.memo(({scheduleList, refetchScheduleList, titleInputRef}: Props) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetScrollViewRef = React.useRef<ScrollView>(null)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const setShowEditScheduleCheckBottomSheet = useSetRecoilState(showEditScheduleCheckBottomSheetState)
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const setExistScheduleList = useSetRecoilState(existScheduleListState)

  const [activeTimePanel, setActiveTimePanel] = React.useState(false)
  const [activeDatePanel, setActiveDatePanel] = React.useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = React.useState(false)
  const [activeAlarmPanel, setActiveAlarmPanel] = React.useState(false)
  const [timeFlag, setTimeFlag] = React.useState(0)
  const [dateFlag, setDateFlag] = React.useState<RANGE_FLAG>(RANGE_FLAG.START)
  const [alarmWheelIndex, setAlarmWheelIndex] = React.useState(1)

  const timePanelHeight = useSharedValue(defaultPanelHeight)
  const datePanelHeight = useSharedValue(defaultPanelHeight)
  const dayOfWeekPanelHeight = useSharedValue(defaultPanelHeight)
  const alarmPanelHeight = useSharedValue(defaultPanelHeight)
  const timeStartPanelHeight = useSharedValue(defaultFullTimeItemPanelHeight)
  const timeEndPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dateStartPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dateEndPanelHeight = useSharedValue(defaultItemPanelHeight)

  const timePanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: timePanelHeight.value
  }))
  const datePanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: datePanelHeight.value
  }))
  const dayOfWeekPanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: dayOfWeekPanelHeight.value
  }))
  const alarmPanelContainerStyle = useAnimatedStyle(() => ({
    ...styles.panel,
    height: alarmPanelHeight.value
  }))
  const startTimePanelItemStyle = useAnimatedStyle(() => ({
    ...styles.panelItemWrapper,
    height: timeStartPanelHeight.value
  }))
  const endTimePanelItemHeightStyle = useAnimatedStyle(() => ({
    height: timeEndPanelHeight.value
  }))
  const endTimePanelItemStyle = React.useMemo(() => {
    return [
      styles.panelItemWrapper,
      endTimePanelItemHeightStyle,
      timeFlag === 0 && {borderTopWidth: 1, borderTopColor: '#eeeded'}
    ]
  }, [timeFlag])
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

  const snapPoints = React.useMemo(() => {
    return ['35%', '93%']
  }, [])

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.start_time)
  }, [schedule.start_time])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(schedule.end_time)
  }, [schedule.end_time])

  const wheelStartTime = React.useMemo(() => {
    if (activeTimePanel) {
      return schedule.start_time
    }
    return null
  }, [activeTimePanel, schedule.start_time])

  const wheelEndTime = React.useMemo(() => {
    if (activeTimePanel) {
      return schedule.end_time
    }
    return null
  }, [activeTimePanel, schedule.end_time])

  const endDate = React.useMemo(() => {
    return schedule.end_date !== '9999-12-31' ? schedule.end_date : '없음'
  }, [schedule.end_date])

  const isActiveAlarm = React.useMemo(() => {
    return schedule.alarm !== 0
  }, [schedule.alarm])

  const startTimePanelItemHeaderWrapperStyle = React.useMemo(() => {
    return [styles.panelItemButton, timeFlag === 0 && styles.panelItemActiveButton]
  }, [timeFlag])
  const startTimePanelItemHeaderTextStyle = React.useMemo(() => {
    return [styles.panelItemButtonText, timeFlag === 0 && styles.panelItemActiveButtonText]
  }, [timeFlag])
  const endTimePanelItemHeaderWrapperStyle = React.useMemo(() => {
    return [styles.panelItemButton, timeFlag === 1 && styles.panelItemActiveButton]
  }, [timeFlag])
  const endTimePanelItemHeaderTextStyle = React.useMemo(() => {
    return [styles.panelItemButtonText, timeFlag === 1 && styles.panelItemActiveButtonText]
  }, [timeFlag])

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

  const handleBottomSheetChanged = React.useCallback((index: number) => {
    if (index === 0) {
      setActiveTimePanel(false)
      setActiveDatePanel(false)
      setActiveDayOfWeekPanel(false)
      setActiveAlarmPanel(false)
    }
  }, [])

  const handleTimePanel = React.useCallback(() => {
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveAlarmPanel(false)
    setActiveTimePanel(!activeTimePanel)
  }, [activeTimePanel])
  const handleDatePanel = React.useCallback(() => {
    setActiveTimePanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveAlarmPanel(false)
    setActiveDatePanel(!activeDatePanel)
  }, [activeDatePanel])
  const handleDayOfWeekPanel = React.useCallback(() => {
    setActiveTimePanel(false)
    setActiveAlarmPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(!activeDayOfWeekPanel)
  }, [activeDayOfWeekPanel])
  const handleAlarmPanel = React.useCallback(() => {
    setActiveTimePanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
    if (isActiveAlarm) {
      setActiveAlarmPanel(!activeAlarmPanel)
    }
  }, [isActiveAlarm, activeAlarmPanel])
  const handleStartTimePanel = React.useCallback(() => {
    setTimeFlag(0)

    timeEndPanelHeight.value = withTiming(defaultItemPanelHeight)
    timeStartPanelHeight.value = withTiming(defaultFullTimeItemPanelHeight)
  }, [timeEndPanelHeight, timeStartPanelHeight])
  const handleEndTimePanel = React.useCallback(() => {
    setTimeFlag(1)

    timeStartPanelHeight.value = withTiming(defaultItemPanelHeight)
    timeEndPanelHeight.value = withTiming(defaultFullTimeItemPanelHeight)
  }, [timeEndPanelHeight, timeStartPanelHeight])
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

  const getDayOfWeekSelectButtonTextStyle = React.useCallback((flag: string) => {
    let dayOfWeekSelectButtonTextStyle: TextStyle[] = [styles.dayofWeekText]

    if (flag === '1') {
      dayOfWeekSelectButtonTextStyle = [...dayOfWeekSelectButtonTextStyle, styles.activeDayOfWeekText]
    }

    return dayOfWeekSelectButtonTextStyle
  }, [])

  const activeSubmit = React.useMemo(() => {
    const dayOfWeekList = [
      schedule.mon,
      schedule.tue,
      schedule.wed,
      schedule.thu,
      schedule.fri,
      schedule.sat,
      schedule.sun
    ]

    return !!(schedule.title && dayOfWeekList.some(item => item === '1'))
  }, [schedule.title, schedule.mon, schedule.tue, schedule.wed, schedule.thu, schedule.fri, schedule.sat, schedule.sun])

  const submitButtonStyle = React.useMemo(() => {
    return [styles.submitButton, activeSubmit && styles.activeSubmitBtn]
  }, [activeSubmit])

  const submitTextStyle = React.useMemo(() => {
    return [styles.submitText, activeSubmit && styles.activeSubmitText]
  }, [activeSubmit])

  const focusTitleInput = React.useCallback(() => {
    if (titleInputRef && titleInputRef.current && bottomSheetRef && bottomSheetRef.current) {
      bottomSheetRef.current?.collapse()
      titleInputRef.current.focus()
    }
  }, [titleInputRef])

  const changeTime = React.useCallback(
    (time: number) => {
      if (timeFlag === 0) {
        setSchedule(prevState => ({
          ...prevState,
          start_time: time
        }))
      } else if (timeFlag === 1) {
        setSchedule(prevState => ({
          ...prevState,
          end_time: time
        }))
      }
    },
    [setSchedule, timeFlag]
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
    (key: DAY_OF_WEEK) => () => {
      const flag = schedule[key] === '1' ? '0' : '1'

      setSchedule(prevState => ({...prevState, [key]: flag}))
    },
    [schedule, setSchedule]
  )

  const changeAlarm = React.useCallback(
    (index: number) => {
      setSchedule(prevState => ({...prevState, alarm: (index + 1) * 5}))
    },
    [setSchedule]
  )

  const changeAlarmSwitch = React.useCallback(
    (value: boolean) => {
      if (value) {
        setActiveTimePanel(false)
        setActiveDatePanel(false)
        setActiveDayOfWeekPanel(false)

        changeAlarm(alarmWheelIndex)
      } else {
        setSchedule(prevState => ({...prevState, alarm: 0}))
      }

      setActiveAlarmPanel(value)
    },
    [alarmWheelIndex]
  )

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

  const {mutateAsync: getExistScheduleListMutateAsync} = useMutation({
    mutationFn: async () => {
      const params = {
        ...schedule
      }

      const result = await scheduleApi.getExistScheduleList(params)

      return result.data
    }
  })

  const {mutate: setScheduleMutate} = useMutation({
    mutationFn: async () => {
      const params = {
        schedule,
        disableScheduleIdList: []
      }

      return await scheduleApi.setSchedule(params)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      setIsEdit(false)
    }
  })

  const handleSubmit = React.useCallback(async () => {
    const existScheduleList = await getExistScheduleListMutateAsync()

    setExistScheduleList(existScheduleList)

    if (existScheduleList.length > 0 || disableScheduleList.length > 0) {
      setShowEditScheduleCheckBottomSheet(true)
      return
    }

    setScheduleMutate()
  }, [
    getExistScheduleListMutateAsync,
    setScheduleMutate,
    setExistScheduleList,
    setShowEditScheduleCheckBottomSheet,
    disableScheduleList.length
  ])

  // const setScheduleMutation = useMutation({
  //   mutationFn: async (params: SetScheduleRequest) => {
  //     return await scheduleApi.setSchedule(params)
  //   }
  // })

  // const handleSubmit = React.useCallback(async () => {
  //   try {
  //     // if (isActiveAlarm) {
  //     //   await handleNotification()
  //     // } else {
  //     //   await notifee.cancelNotification(String(schedule.schedule_id))
  //     // }

  //     const params = {
  //       schedule,
  //       disableScheduleList
  //     }

  //     await setScheduleMutation.mutateAsync(params)

  //     await refetchScheduleList()
  //     setIsEdit(false)
  //   } catch (e) {
  //     console.error('e', e)
  //   }
  // }, [schedule, disableScheduleList, setScheduleMutation])

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
        setActiveTimePanel(false)
        setActiveDatePanel(false)
        setActiveDayOfWeekPanel(false)
        setActiveAlarmPanel(false)
      }
    }
  }, [isEdit])

  React.useEffect(() => {
    if (schedule.alarm > 0) {
      setAlarmWheelIndex(schedule.alarm / 5 - 1)
    }
  }, [schedule.alarm])

  React.useEffect(() => {
    if (activeTimePanel) {
      timePanelHeight.value = withTiming(
        defaultPanelHeight + defaultItemPanelHeight + defaultFullTimeItemPanelHeight + 3
      )
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

    if (!activeTimePanel) {
      timePanelHeight.value = withTiming(defaultPanelHeight)
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
  }, [activeTimePanel, activeDatePanel, activeDayOfWeekPanel, activeAlarmPanel])

  React.useEffect(() => {
    if (schedule.schedule_id) {
      setDateFlag(RANGE_FLAG.END)
    }
  }, [schedule.schedule_id])

  React.useEffect(() => {
    if (dateFlag === RANGE_FLAG.END) {
      dateStartPanelHeight.value = withTiming(defaultItemPanelHeight)
      dateEndPanelHeight.value = withTiming(defaultFullDateItemPanelHeight)
    } else if (dateFlag === RANGE_FLAG.START) {
      dateStartPanelHeight.value = withTiming(defaultFullDateItemPanelHeight)
      dateEndPanelHeight.value = withTiming(defaultItemPanelHeight)
    }
  }, [dateFlag])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
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

        {/* 시간 */}
        <Animated.View style={timePanelContainerStyle}>
          <Pressable style={panelHeaderStyle} onPress={handleTimePanel}>
            <View style={styles.panelHeaderTextBox}>
              <Text style={styles.panelHeaderLabel}>시간</Text>
              <Text style={styles.panelHeaderTitle}>
                {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분 ~ ${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}{' '}
              </Text>
            </View>

            {activeTimePanel ? <ArrowDownIcon stroke="#424242" /> : <ArrowUpIcon stroke="#424242" />}
          </Pressable>

          <View style={styles.panelItemContainer}>
            <Animated.View style={startTimePanelItemStyle}>
              <View style={panelItemHeaderContainerStyle}>
                <Text style={styles.panelItemLabel}>시작 시간</Text>

                <Pressable style={startTimePanelItemHeaderWrapperStyle} onPress={handleStartTimePanel}>
                  <Text style={startTimePanelItemHeaderTextStyle}>
                    {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}
                  </Text>
                </Pressable>
              </View>

              <View style={timePanelItemContentsStyle}>
                <TimeWheelPicker initValue={wheelStartTime} visibleRest={1} onChange={changeTime} />
              </View>
            </Animated.View>

            <Animated.View style={endTimePanelItemStyle}>
              <View style={panelItemHeaderContainerStyle}>
                <Text style={styles.panelItemLabel}>종료 시간</Text>

                <Pressable style={endTimePanelItemHeaderWrapperStyle} onPress={handleEndTimePanel}>
                  <Text style={endTimePanelItemHeaderTextStyle}>
                    {`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
                  </Text>
                </Pressable>
              </View>

              <View style={timePanelItemContentsStyle}>
                <TimeWheelPicker initValue={wheelEndTime} visibleRest={1} onChange={changeTime} />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

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
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.mon)} onPress={changeDayOfWeek('mon')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.mon)}>월</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.tue)} onPress={changeDayOfWeek('tue')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.tue)}>화</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.wed)} onPress={changeDayOfWeek('wed')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.wed)}>수</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.thu)} onPress={changeDayOfWeek('thu')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.thu)}>목</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.fri)} onPress={changeDayOfWeek('fri')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.fri)}>금</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.sat)} onPress={changeDayOfWeek('sat')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.sat)}>토</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(schedule.sun)} onPress={changeDayOfWeek('sun')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(schedule.sun)}>일</Text>
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

        <Pressable style={submitButtonStyle} onPress={handleSubmit}>
          <Text style={submitTextStyle}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>
        </Pressable>
      </BottomSheetScrollView>
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
  },

  submitButton: {
    height: 48,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f5f6f8'
  },
  submitText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#babfc5'
  },
  activeSubmitBtn: {
    backgroundColor: '#1E90FF'
  },
  activeSubmitText: {
    color: '#fff'
  }
})

const titleTextStyle = StyleSheet.compose(styles.titleText, styles.titlePlaceHoldText)
const panelHeaderStyle = StyleSheet.compose(styles.panelHeader, {height: defaultPanelHeight})
const panelItemHeaderContainerStyle = StyleSheet.compose(styles.panelItemHeader, {height: defaultItemPanelHeight})
const timePanelItemContentsStyle = StyleSheet.compose(styles.panelItemContents, {
  height: defaultFullTimeItemPanelHeight
})

export default EditScheduleBottomSheet
