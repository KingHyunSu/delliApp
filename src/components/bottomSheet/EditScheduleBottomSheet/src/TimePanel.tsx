import {memo, useCallback, useMemo} from 'react'
import {TextStyle, ViewStyle, StyleSheet, Platform, View, Text, Image, Pressable} from 'react-native'
import Panel from '@/components/Panel'
import {getTimeOfMinute} from '@/utils/helper'
import DateTimePicker, {DateTimePickerAndroid, DateTimePickerEvent} from '@react-native-community/datetimepicker'
import {addMinutes, startOfToday} from 'date-fns'

interface Props {
  value: boolean
  data: Schedule
  activeTheme: ActiveTheme
  itemPanelHeight: number
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  itemHeaderLabelStyle: TextStyle
  handleExpansion: () => void
  changeStartTime: (time: number) => void
  changeEndTime: (time: number) => void
}
const TimePanel = memo(
  ({
    value,
    data,
    activeTheme,
    itemPanelHeight,
    headerContainerStyle,
    headerTitleWrapper,
    headerLabelStyle,
    headerTitleStyle,
    itemHeaderLabelStyle,
    handleExpansion,
    changeStartTime,
    changeEndTime
  }: Props) => {
    const themeVariant = useMemo(() => {
      return activeTheme.display_mode === 0 ? 'light' : 'dark'
    }, [activeTheme.display_mode])

    const startTimeObj = useMemo(() => {
      return getTimeOfMinute(data.start_time)
    }, [data.start_time])

    const endTimeObj = useMemo(() => {
      return getTimeOfMinute(data.end_time)
    }, [data.end_time])

    const startTime = useMemo(() => {
      return addMinutes(startOfToday(), data.start_time)
    }, [data.start_time])

    const endTime = useMemo(() => {
      return addMinutes(startOfToday(), data.end_time)
    }, [data.end_time])

    const _changeStartTime = useCallback(
      (event: DateTimePickerEvent, date: Date | undefined) => {
        if (date) {
          const hour = date.getHours()
          const minutes = date.getMinutes()

          changeStartTime(hour * 60 + minutes)
        }
      },
      [changeStartTime]
    )

    const _changeEndTime = useCallback(
      (event: DateTimePickerEvent, date: Date | undefined) => {
        if (date) {
          const hour = date.getHours()
          const minutes = date.getMinutes()

          changeEndTime(hour * 60 + minutes)
        }
      },
      [changeEndTime]
    )

    const showAndroidStartTimeModal = useCallback(() => {
      DateTimePickerAndroid.open({
        value: startTime,
        mode: 'time',
        display: 'spinner',
        is24Hour: false,
        onChange: _changeStartTime
      })
    }, [startTime, _changeStartTime])

    const showAndroidEndTimeModal = useCallback(() => {
      DateTimePickerAndroid.open({
        value: endTime,
        mode: 'time',
        display: 'spinner',
        is24Hour: false,
        onChange: _changeEndTime
      })
    }, [endTime, _changeEndTime])

    const startTimeButton = useMemo(() => {
      if (Platform.OS === 'ios') {
        return (
          <DateTimePicker
            value={startTime}
            mode="time"
            themeVariant={themeVariant}
            locale="ko"
            display="compact"
            onChange={_changeStartTime}
          />
        )
      }

      return (
        <Pressable style={styles.button} onPress={showAndroidStartTimeModal}>
          <Text style={styles.buttonText}>
            {`${startTimeObj.meridiem} ${startTimeObj.hour}시 ${startTimeObj.minute}분`}
          </Text>
        </Pressable>
      )
    }, [
      startTime,
      startTimeObj.meridiem,
      startTimeObj.hour,
      startTimeObj.minute,
      themeVariant,
      _changeStartTime,
      showAndroidStartTimeModal
    ])

    const endTimeButton = useMemo(() => {
      if (Platform.OS === 'ios') {
        return (
          <DateTimePicker
            value={endTime}
            mode="time"
            themeVariant={themeVariant}
            locale="ko"
            display="compact"
            onChange={_changeEndTime}
          />
        )
      }

      return (
        <Pressable style={styles.button} onPress={showAndroidEndTimeModal}>
          <Text style={styles.buttonText}>{`${endTimeObj.meridiem} ${endTimeObj.hour}시 ${endTimeObj.minute}분`}</Text>
        </Pressable>
      )
    }, [
      endTime,
      endTimeObj.meridiem,
      endTimeObj.hour,
      endTimeObj.minute,
      themeVariant,
      _changeEndTime,
      showAndroidEndTimeModal
    ])

    return (
      <Panel
        type="container"
        value={value}
        contentsHeight={itemPanelHeight * 2 + 3}
        handleExpansion={handleExpansion}
        headerComponent={
          <View style={headerContainerStyle}>
            <Image source={require('@/assets/icons/time.png')} style={{width: 24, height: 24}} />

            <View style={headerTitleWrapper}>
              <Text style={headerLabelStyle}>시간</Text>
              <Text style={headerTitleStyle}>
                {`${startTimeObj.meridiem} ${startTimeObj.hour}시 ${startTimeObj.minute}분 ~ ${endTimeObj.meridiem} ${endTimeObj.hour}시 ${endTimeObj.minute}분`}
              </Text>
            </View>
          </View>
        }
        contentsComponent={
          <View>
            <View style={[styles.itemHeaderContainer, {height: itemPanelHeight, borderTopWidth: 0}]}>
              <Text style={itemHeaderLabelStyle}>시작 시간</Text>

              {startTimeButton}
            </View>

            <View style={[styles.itemHeaderContainer, {height: itemPanelHeight, borderTopColor: activeTheme.color2}]}>
              <Text style={itemHeaderLabelStyle}>종료 시간</Text>

              {endTimeButton}
            </View>
          </View>
        }
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.data.start_time === nextProps.data.start_time &&
      prevProps.data.end_time === nextProps.data.end_time
    )
  }
)

const styles = StyleSheet.create({
  itemHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 2
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    backgroundColor: '#ecedee'
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#000000'
  }
})

export default TimePanel
