import React from 'react'
import {StyleSheet, View, Text, Pressable, TextInput} from 'react-native'
import Switch from '@/components/Swtich'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import TimeWheelPicker from '@/components/TimeWheelPicker'
import DatePicker from '@/components/DatePicker'
import WheelPicker from 'react-native-wheely'

import {useMutation} from '@tanstack/react-query'
import * as API from '@/apis/schedule'

import {useRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {scheduleState, editStartAngleState, editEndAngleState} from '@/store/schedule'

import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import {getTimeOfMinute} from '@/utils/helper'
import {getTime, startOfToday, setMinutes} from 'date-fns'

import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

import {RANGE_FLAG} from '@/utils/types'
import {DAY_OF_WEEK} from '@/types/common'

import notifee, {TimestampTrigger, TriggerType, RepeatFrequency} from '@notifee/react-native'

interface Props {
  scheduleList: Schedule[]
  refetchScheduleList: Function
  titleInputRef: React.RefObject<TextInput>
}
const EditScheduleBottomSheet = ({scheduleList, refetchScheduleList, titleInputRef}: Props) => {
  const defaultPanelHeight = 74
  const defaultItemPanelHeight = 56
  const defaultFullTimeItemPanelHeight = 216
  const defaultFullDateItemPanelHeight = 426

  const alarmWheelTimeList = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']

  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const [isEdit, setIsEdit] = useRecoilState(isEditState)
  const [editStartAngle, setEditStartAngle] = useRecoilState(editStartAngleState)
  const [editEndAngle, setEditEndAngle] = useRecoilState(editEndAngleState)
  const [schedule, setSchedule] = useRecoilState(scheduleState)

  const [activeTimePanel, setActiveTimePanel] = React.useState(false)
  const [activeDatePanel, setActiveDatePanel] = React.useState(false)
  const [activeDayOfWeekPanel, setActiveDayOfWeekPanel] = React.useState(false)
  const [activeAlarmPanel, setActiveAlarmPanel] = React.useState(false)
  const [timeFlag, setTimeFlag] = React.useState(0)
  const [dateFlag, setDateFlag] = React.useState<RANGE_FLAG>(RANGE_FLAG.START)
  const [alarmWheelIndex, setAlarmWheelIndex] = React.useState(1)

  const startTime = React.useMemo(() => {
    return getTimeOfMinute(editStartAngle * 4)
  }, [editStartAngle])

  const endTime = React.useMemo(() => {
    return getTimeOfMinute(editEndAngle * 4)
  }, [editEndAngle])

  const endDate = React.useMemo(() => {
    return schedule.end_date !== '9999-12-31' ? schedule.end_date : '없음'
  }, [schedule.end_date])

  const isActiveAlarm = React.useMemo(() => {
    return schedule.alarm !== 0
  }, [schedule.alarm])

  const timePanelHeight = useSharedValue(defaultPanelHeight)
  const datePanelHeight = useSharedValue(defaultPanelHeight)
  const dayOfWeekPanelHeight = useSharedValue(defaultPanelHeight)
  const alarmPanelHeight = useSharedValue(defaultPanelHeight)
  const timeStartPanelHeight = useSharedValue(defaultFullTimeItemPanelHeight)
  const timeEndPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dateStartPanelHeight = useSharedValue(defaultItemPanelHeight)
  const dateEndPanelHeight = useSharedValue(defaultItemPanelHeight)

  const timePanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: timePanelHeight.value
  }))
  const datePanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: datePanelHeight.value
  }))
  const dayOfWeekPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: dayOfWeekPanelHeight.value
  }))
  const alarmPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: alarmPanelHeight.value
  }))
  const timeStartPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: timeStartPanelHeight.value
  }))
  const timeEndPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: timeEndPanelHeight.value
  }))
  const dateStartPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: dateStartPanelHeight.value
  }))
  const dateEndPanelHeightAnimatedStyle = useAnimatedStyle(() => ({
    height: dateEndPanelHeight.value
  }))

  const handleTimePanel = () => {
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveAlarmPanel(false)
    setActiveTimePanel(!activeTimePanel)
  }
  const handleDatePanel = () => {
    setActiveTimePanel(false)
    setActiveDayOfWeekPanel(false)
    setActiveAlarmPanel(false)
    setActiveDatePanel(!activeDatePanel)
  }
  const handleDayOfWeekPanel = () => {
    setActiveTimePanel(false)
    setActiveAlarmPanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(!activeDayOfWeekPanel)
  }
  const handleAlarmPanel = () => {
    setActiveTimePanel(false)
    setActiveDatePanel(false)
    setActiveDayOfWeekPanel(false)
    if (isActiveAlarm) {
      setActiveAlarmPanel(!activeAlarmPanel)
    }
  }
  const handleStartTimePanel = () => {
    setTimeFlag(0)

    timeEndPanelHeight.value = withTiming(defaultItemPanelHeight)
    timeStartPanelHeight.value = withTiming(defaultFullTimeItemPanelHeight)
  }
  const handleEndTimePanel = () => {
    setTimeFlag(1)

    timeStartPanelHeight.value = withTiming(defaultItemPanelHeight)
    timeEndPanelHeight.value = withTiming(defaultFullTimeItemPanelHeight)
  }

  const handleStartDatePanel = () => {
    if (schedule.schedule_id) {
      return
    }

    setDateFlag(RANGE_FLAG.START)
  }
  const handleEndDatePanel = () => {
    setDateFlag(RANGE_FLAG.END)
  }

  const focusTitleInput = () => {
    if (titleInputRef && titleInputRef.current && bottomSheetRef && bottomSheetRef.current) {
      bottomSheetRef.current?.collapse()
      titleInputRef.current.focus()
    }
  }

  const changeTime = (time: number, flag: RANGE_FLAG) => {
    if (flag === RANGE_FLAG.START) {
      setSchedule(prevState => ({
        ...prevState,
        start_time: time
      }))
      setEditStartAngle(time * 0.25)
    } else if (flag === RANGE_FLAG.END) {
      setSchedule(prevState => ({
        ...prevState,
        end_time: time
      }))
      setEditEndAngle(time * 0.25)
    }
  }

  const changeDate = (date: string, flag: RANGE_FLAG) => {
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
  }

  const changeDayOfWeek = (key: DAY_OF_WEEK) => {
    const flag = schedule[key] === '1' ? '0' : '1'

    setSchedule(prevState => ({...prevState, [key]: flag}))
  }

  const changeAlarm = (index: number) => {
    setSchedule(prevState => ({...prevState, alarm: (index + 1) * 5}))
  }

  const changeAlarmSwitch = (value: boolean) => {
    if (value) {
      setActiveTimePanel(false)
      setActiveDatePanel(false)
      setActiveDayOfWeekPanel(false)

      changeAlarm(alarmWheelIndex)
    } else {
      setSchedule(prevState => ({...prevState, alarm: 0}))
    }

    setActiveAlarmPanel(value)
  }

  const registNotification = async () => {
    try {
      await notifee.requestPermission()

      const isChannel = await notifee.getChannel('schedule')

      if (!isChannel) {
        await notifee.createChannel({
          id: 'schedule',
          name: 'schedule'
        })
      }

      let alarmTime = getTime(setMinutes(startOfToday(), schedule.start_time - schedule.alarm))
      const currentTime = new Date().getTime()

      if (alarmTime < currentTime) {
        alarmTime += 1000 * 60 * 60 * 24 // 1 day after
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: alarmTime,
        repeatFrequency: RepeatFrequency.DAILY
      }

      if (schedule.schedule_id) {
        await notifee.createTriggerNotification(
          {
            id: String(schedule.schedule_id),
            title: '델리',
            body: schedule.title,
            android: {
              channelId: 'schedule'
            }
          },
          trigger
        )
      }
    } catch (e) {
      throw e
    }
  }

  const getDisableScheduleIdList = () => {
    const {start_time, end_time} = schedule

    const disableScheduleIdList: number[] = []

    scheduleList.forEach(item => {
      const isOverlapAll =
        item.start_time >= start_time &&
        item.start_time < end_time &&
        item.end_time <= end_time &&
        item.end_time > start_time

      const isOverlapLeft = item.start_time >= start_time && item.end_time > end_time && item.start_time < end_time

      const isOverlapRight = item.start_time < start_time && item.end_time <= end_time && item.end_time > start_time

      const isOverlapCenter =
        item.start_time < start_time &&
        item.end_time > end_time &&
        item.start_time < end_time &&
        item.end_time > start_time

      if (isOverlapAll || isOverlapLeft || isOverlapRight || isOverlapCenter) {
        if (item.schedule_id && item.schedule_id !== schedule.schedule_id) {
          disableScheduleIdList.push(item.schedule_id)
        }
      }
    })

    return disableScheduleIdList
  }

  const setScheduleMutation = useMutation({
    mutationFn: async (params: API.SetScheduleParam) => {
      return await API.setSchedule(params)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      setIsEdit(false)
    }
  })

  const handleSubmit = async () => {
    try {
      if (isActiveAlarm) {
        await registNotification()
      } else {
        await notifee.cancelNotification(String(schedule.schedule_id))
      }

      const params = {
        schedule,
        disableScheduleIdList: getDisableScheduleIdList()
      }

      setScheduleMutation.mutateAsync(params)
    } catch (e) {
      console.error('e', e)
    }
  }

  React.useEffect(() => {
    if (bottomSheetRef.current) {
      if (isEdit) {
        bottomSheetRef.current.snapToIndex(0)
      } else {
        bottomSheetRef.current.close()
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
    <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['35%', '93%']} handleComponent={BottomSheetShadowHandler}>
      <BottomSheetScrollView contentContainerStyle={styles.container}>
        {/* 일정명 */}
        <Pressable style={styles.titleButton} onPress={focusTitleInput}>
          {schedule.title ? (
            <Text style={styles.titleText}>{schedule.title}</Text>
          ) : (
            <Text style={[styles.titleText, styles.titlePlaceHoldText]}>일정명을 입력해주세요</Text>
          )}
        </Pressable>

        {/* 시간 */}
        <Animated.View style={[timePanelHeightAnimatedStyle, styles.expansionPanel]}>
          <Pressable style={[styles.expansionPanelHeader, {height: defaultPanelHeight}]} onPress={handleTimePanel}>
            <View style={styles.expansionPanelHeaderTextBox}>
              <Text style={styles.expansionPanelHeaderLabel}>시간</Text>
              <Text style={styles.expansionPanelHeaderTitle}>
                {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분 ~ ${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}{' '}
              </Text>
            </View>

            {activeTimePanel ? <ArrowDownIcon stroke="#000" /> : <ArrowUpIcon stroke="#000" />}
          </Pressable>

          <View style={styles.expansionPanelContents}>
            <Animated.View style={[timeStartPanelHeightAnimatedStyle, styles.expansionPanelItemContainer]}>
              <View style={[styles.expansionPanelItemHeader, {height: defaultItemPanelHeight}]}>
                <Text style={styles.expansionPanelItemLabel}>시작 시간</Text>

                <Pressable
                  style={[styles.expansionPanelItemButton, timeFlag === 0 && styles.expansionPanelItemActiveButton]}
                  onPress={handleStartTimePanel}>
                  <Text
                    style={[
                      styles.expansionPanelItemButtonText,
                      timeFlag === 0 && styles.expansionPanelItemActiveButtonText
                    ]}>
                    {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}
                  </Text>
                </Pressable>
              </View>

              <View style={[styles.expansionPanelItemContents, {height: defaultFullTimeItemPanelHeight}]}>
                <TimeWheelPicker
                  initValue={schedule.start_time}
                  visibleRest={1}
                  onChange={(time: number) => changeTime(time, RANGE_FLAG.START)}
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                timeEndPanelHeightAnimatedStyle,
                styles.expansionPanelItemContainer,
                timeFlag === 0 && {borderTopWidth: 1, borderTopColor: '#eeeded'}
              ]}>
              <View style={[styles.expansionPanelItemHeader, {height: defaultItemPanelHeight}]}>
                <Text style={styles.expansionPanelItemLabel}>종료 시간</Text>

                <Pressable
                  style={[styles.expansionPanelItemButton, timeFlag === 1 && styles.expansionPanelItemActiveButton]}
                  onPress={handleEndTimePanel}>
                  <Text
                    style={[
                      styles.expansionPanelItemButtonText,
                      timeFlag === 1 && styles.expansionPanelItemActiveButtonText
                    ]}>
                    {`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
                  </Text>
                </Pressable>
              </View>

              <View style={[styles.expansionPanelItemContents, {height: defaultFullTimeItemPanelHeight}]}>
                <TimeWheelPicker
                  initValue={schedule.end_time}
                  visibleRest={1}
                  onChange={(time: number) => changeTime(time, RANGE_FLAG.END)}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* 기간 */}
        <Animated.View style={[datePanelHeightAnimatedStyle, styles.expansionPanel]}>
          <Pressable style={[styles.expansionPanelHeader, {height: defaultPanelHeight}]} onPress={handleDatePanel}>
            <View style={styles.expansionPanelHeaderTextBox}>
              <Text style={styles.expansionPanelHeaderLabel}>기간</Text>
              <Text style={styles.expansionPanelHeaderTitle}>{`${schedule.start_date} ~ ${endDate}`}</Text>
            </View>

            {activeDatePanel ? <ArrowDownIcon stroke="#000" /> : <ArrowUpIcon stroke="#000" />}
          </Pressable>

          <View style={styles.expansionPanelContents}>
            <Animated.View style={[dateStartPanelHeightAnimatedStyle, styles.expansionPanelItemContainer]}>
              <View style={[styles.expansionPanelItemHeader, {height: defaultItemPanelHeight}]}>
                <Text style={styles.expansionPanelItemLabel}>시작일</Text>

                <Pressable
                  style={[
                    styles.expansionPanelItemButton,
                    dateFlag === RANGE_FLAG.START && styles.expansionPanelItemActiveButton
                  ]}
                  onPress={handleStartDatePanel}>
                  <Text
                    style={[
                      styles.expansionPanelItemButtonText,
                      dateFlag === RANGE_FLAG.START && styles.expansionPanelItemActiveButtonText
                    ]}>
                    {schedule.start_date}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.expansionPanelItemContents}>
                <DatePicker
                  value={schedule.start_date}
                  onChange={(date: string) => changeDate(date, RANGE_FLAG.START)}
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                dateEndPanelHeightAnimatedStyle,
                styles.expansionPanelItemContainer,
                dateFlag === RANGE_FLAG.START && {borderTopWidth: 1, borderTopColor: '#eeeded'}
              ]}>
              <View style={[styles.expansionPanelItemHeader, {height: defaultItemPanelHeight}]}>
                <Text style={styles.expansionPanelItemLabel}>종료일</Text>

                <Pressable
                  style={[
                    styles.expansionPanelItemButton,
                    dateFlag === RANGE_FLAG.END && styles.expansionPanelItemActiveButton
                  ]}
                  onPress={handleEndDatePanel}>
                  <Text
                    style={[
                      styles.expansionPanelItemButtonText,
                      dateFlag === RANGE_FLAG.END && styles.expansionPanelItemActiveButtonText
                    ]}>
                    {endDate}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.expansionPanelItemContents}>
                <DatePicker
                  value={schedule.end_date}
                  hasNull
                  onChange={(date: string) => changeDate(date, RANGE_FLAG.END)}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* 요일 */}
        <Animated.View style={[dayOfWeekPanelHeightAnimatedStyle, styles.expansionPanel]}>
          <Pressable style={[styles.expansionPanelHeader, {height: defaultPanelHeight}]} onPress={handleDayOfWeekPanel}>
            <View style={styles.expansionPanelHeaderTextBox}>
              <Text style={styles.expansionPanelHeaderLabel}>요일</Text>
              <View style={styles.dateOfWeekTitleContainer}>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.mon === '1' && styles.activeDayOfWeekText
                  ]}>
                  월
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.tue === '1' && styles.activeDayOfWeekText
                  ]}>
                  화
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.wed === '1' && styles.activeDayOfWeekText
                  ]}>
                  수
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.thu === '1' && styles.activeDayOfWeekText
                  ]}>
                  목
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.fri === '1' && styles.activeDayOfWeekText
                  ]}>
                  금
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.sat === '1' && styles.activeDayOfWeekText
                  ]}>
                  토
                </Text>
                <Text
                  style={[
                    styles.expansionPanelHeaderTitle,
                    styles.disableDayOfWeekText,
                    schedule.sun === '1' && styles.activeDayOfWeekText
                  ]}>
                  일
                </Text>
              </View>
            </View>

            {activeDayOfWeekPanel ? <ArrowDownIcon stroke="#000" /> : <ArrowUpIcon stroke="#000" />}
          </Pressable>

          <View style={styles.dayOfWeekContainer}>
            <Pressable
              style={[styles.dayOfWeek, schedule.mon === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('mon')}>
              <Text style={[styles.dayofWeekText, schedule.mon === '1' && styles.activeDayOfWeekText]}>월</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.tue === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('tue')}>
              <Text style={[styles.dayofWeekText, schedule.tue === '1' && styles.activeDayOfWeekText]}>화</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.wed === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('wed')}>
              <Text style={[styles.dayofWeekText, schedule.wed === '1' && styles.activeDayOfWeekText]}>수</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.thu === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('thu')}>
              <Text style={[styles.dayofWeekText, schedule.thu === '1' && styles.activeDayOfWeekText]}>목</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.fri === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('fri')}>
              <Text style={[styles.dayofWeekText, schedule.fri === '1' && styles.activeDayOfWeekText]}>금</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.sat === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('sat')}>
              <Text style={[styles.dayofWeekText, schedule.sat === '1' && styles.activeDayOfWeekText]}>토</Text>
            </Pressable>
            <Pressable
              style={[styles.dayOfWeek, schedule.sun === '1' && styles.activeDayOfWeek]}
              onPress={() => changeDayOfWeek('sun')}>
              <Text style={[styles.dayofWeekText, schedule.sun === '1' && styles.activeDayOfWeekText]}>일</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* 알람 */}
        <Animated.View style={[alarmPanelHeightAnimatedStyle, styles.expansionPanel]}>
          <Pressable style={[styles.expansionPanelHeader, {height: defaultPanelHeight}]} onPress={handleAlarmPanel}>
            <View style={styles.expansionPanelHeaderTextBox}>
              <Text style={styles.expansionPanelHeaderLabel}>알람</Text>
              <Text style={styles.expansionPanelHeaderTitle}>{isActiveAlarm ? `${schedule.alarm}분 전` : '없음'}</Text>
            </View>

            <Switch value={isActiveAlarm} onChange={changeAlarmSwitch} />
          </Pressable>

          <View style={styles.expansionPanelContents}>
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
        </Animated.View>

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>{schedule.schedule_id ? '수정하기' : '등록하기'}</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

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
  expansionPanel: {
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    overflow: 'hidden'
  },
  expansionPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  expansionPanelHeaderTextBox: {
    gap: 5
  },
  expansionPanelHeaderLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Light',
    color: '#424242'
  },
  expansionPanelHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  expansionPanelContents: {
    borderTopWidth: 1,
    borderTopColor: '#eeeded'
  },
  expansionPanelItemContainer: {
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  expansionPanelItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  expansionPanelItemContents: {
    paddingTop: 20
  },
  expansionPanelItemLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#424242'
  },
  expansionPanelItemButton: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 7,
    backgroundColor: '#f5f6f8'
  },
  expansionPanelItemButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#7c8698',
    textAlign: 'center'
  },
  expansionPanelItemActiveButton: {
    backgroundColor: '#1E90FF'
  },
  expansionPanelItemActiveButtonText: {
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
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#c3c5cc'
  },
  dayofWeekText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#c3c5cc'
  },
  activeDayOfWeekText: {
    color: '#424242'
  },
  disableDayOfWeekText: {
    color: '#c3c5cc'
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

  submitBtn: {
    height: 48,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1E90FF'
    // backgroundColor: '#2d8cec'
  },
  submitText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})

export default EditScheduleBottomSheet
