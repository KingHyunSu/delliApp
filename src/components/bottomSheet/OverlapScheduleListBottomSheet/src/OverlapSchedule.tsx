import {useMemo, useCallback, useState} from 'react'
import {Platform, StyleSheet, Text, View, Pressable} from 'react-native'
import ScheduleItem from '@/components/ScheduleItem'
import {trigger} from 'react-native-haptic-feedback'
import {GetOverlapScheduleListResponse} from '@/apis/types/schedule'

type ButtonType = 'OVERLAP' | 'DELETE'
interface Props {
  schedule: GetOverlapScheduleListResponse
  activeTheme: ActiveTheme
  onDelete: (schedule: GetOverlapScheduleListResponse) => void
  onCancelDeleted: (schedule: GetOverlapScheduleListResponse) => void
}

const OverlapSchedule = ({schedule, activeTheme, onDelete, onCancelDeleted}: Props) => {
  const [activeButtonType, setActiveButtonType] = useState<ButtonType>('OVERLAP')

  const getButtonStyle = useCallback(
    (type: ButtonType) => {
      const backgroundColor = activeButtonType === type ? activeTheme.color5 : activeTheme.color2

      return [styles.button, {backgroundColor}]
    },
    [activeButtonType, activeTheme.color2, activeTheme.color5]
  )

  const getButtonTextStyle = useCallback(
    (type: ButtonType) => {
      const fontFamily = activeButtonType === type ? 'Pretendard-SemiBold' : 'Pretendard-Regular'

      return [styles.buttonText, {color: activeTheme.color3, fontFamily}]
    },
    [activeButtonType, activeTheme.color3]
  )

  const descText = useMemo(() => {
    switch (activeButtonType) {
      case 'OVERLAP':
        return '생활계획표에 일정이 겹쳐서 보여요'
      case 'DELETE':
        return '일정이 바로 삭제돼요'
      default:
        return ''
    }
  }, [activeButtonType])

  const changeButtonType = useCallback(
    (type: ButtonType) => () => {
      if (type === activeButtonType) {
        return
      }

      const triggerType = Platform.OS === 'android' ? 'effectClick' : 'impactMedium'

      trigger(triggerType, {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      })

      setActiveButtonType(type)

      if (type === 'OVERLAP') {
        onCancelDeleted(schedule)
      } else if (type === 'DELETE') {
        onDelete(schedule)
      }
    },
    [activeButtonType, onDelete, onCancelDeleted]
  )

  return (
    <View style={[styles.container, {backgroundColor: activeTheme.color5}]}>
      <Text style={[styles.descText, {color: activeTheme.color3}]}>{descText}</Text>

      <ScheduleItem
        activeTheme={activeTheme}
        title={schedule.title}
        time={{startTime: schedule.start_time, endTime: schedule.end_time}}
        date={{startDate: schedule.start_date, endDate: schedule.end_date}}
        dayOfWeek={{
          mon: schedule.mon,
          tue: schedule.tue,
          wed: schedule.wed,
          thu: schedule.thu,
          fri: schedule.fri,
          sat: schedule.sat,
          sun: schedule.sun
        }}
      />

      <View style={[styles.buttonContainer, {backgroundColor: activeTheme.color2}]}>
        <Pressable style={getButtonStyle('OVERLAP')} onPress={changeButtonType('OVERLAP')}>
          <Text style={getButtonTextStyle('OVERLAP')}>겹치기</Text>
        </Pressable>
        <Pressable style={getButtonStyle('DELETE')} onPress={changeButtonType('DELETE')}>
          <Text style={getButtonTextStyle('DELETE')}>삭제하기</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    gap: 15
  },
  descText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    marginBottom: 5
  },

  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  }
})

export default OverlapSchedule
