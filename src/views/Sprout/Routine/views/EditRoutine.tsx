import {useState, useMemo, useCallback} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import RepeatCountSelectorBottomSheet from '@/components/bottomSheet/RepeatCountSelectorBottomSheet'
import type {Count} from '@/components/bottomSheet/RepeatCountSelectorBottomSheet'
import AppBar from '@/components/AppBar'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import {useSetRecoilState} from 'recoil'
import {showRepeatCountSelectorBottomSheetState} from '@/store/bottomSheet'
import {SetRoutine} from '@/repository/types/todo'

const RepeatCompleteType = {DAILY: 1, TWO_DAYS: 2, WEEK: 3} as const
const EditRoutine = () => {
  const [form, setForm] = useState<SetRoutine>({
    title: '',
    repeat_complete_type: 1,
    repeat_complete_count: 1,
    schedule_id: null
  })

  const setShowRepeatCountSelectorBottomSheet = useSetRecoilState(showRepeatCountSelectorBottomSheetState)

  const disabledChangeRepeatCount = useMemo(() => {
    return form.repeat_complete_type !== RepeatCompleteType.WEEK
  }, [form.repeat_complete_type])

  const getRepeatTypeButtonStyle = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => {
      if (type === form.repeat_complete_type) {
        return activeRepeatTypeButtonStyle
      }

      return styles.repeatTypeButton
    },
    [form.repeat_complete_type]
  )

  const getRepeatTypeButtonTextStyle = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => {
      if (type === form.repeat_complete_type) {
        return activeRepeatTypeButtonTextStyle
      }

      return styles.repeatTypeButtonText
    },
    [form.repeat_complete_type]
  )

  const repeatCountButtonTextStyle = useMemo(() => {
    if (disabledChangeRepeatCount) {
      return disabledRepeatCountButtonTextStyle
    }

    return styles.repeatCountButtonText
  }, [disabledChangeRepeatCount])

  const getRepeatCountString = useCallback((value: Count) => {
    switch (value) {
      case 1:
        return '한 번'
      case 2:
        return '두 번'
      case 3:
        return '세 번'
      case 4:
        return '네 번'
      case 5:
        return '다섯 번'
      case 6:
        return '여섯 번'
      default:
        return ''
    }
  }, [])

  const changeRepeatType = useCallback(
    (type: (typeof RepeatCompleteType)[keyof typeof RepeatCompleteType]) => () => {
      const repeatCompleteCount = type !== RepeatCompleteType.WEEK ? 1 : form.repeat_complete_count

      setForm(prevState => ({
        ...prevState,
        repeat_complete_type: type,
        repeat_complete_count: repeatCompleteCount
      }))
    },
    [form.repeat_complete_count, setForm]
  )

  const changeRepeatCount = useCallback(
    (value: Count) => {
      setForm(prevState => ({
        ...prevState,
        repeat_complete_count: value
      }))
    },
    [setForm]
  )

  const showRepeatCountSelectorBottomSheet = useCallback(() => {
    setShowRepeatCountSelectorBottomSheet(true)
  }, [setShowRepeatCountSelectorBottomSheet])

  return (
    <View style={styles.container}>
      <AppBar backPress />
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* 루틴명 */}
          <TextInput
            placeholder="새로운 루틴"
            placeholderTextColor="#c3c5cc"
            style={styles.input}
            onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
          />

          <View style={styles.repeatContainer}>
            <Text style={styles.repeatContainerLabel}>반복</Text>

            <View style={styles.repeatTypeWrapper}>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.DAILY)}
                onPress={changeRepeatType(RepeatCompleteType.DAILY)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.DAILY)}>매일</Text>
              </Pressable>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.TWO_DAYS)}
                onPress={changeRepeatType(RepeatCompleteType.TWO_DAYS)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.TWO_DAYS)}>이틀</Text>
              </Pressable>
              <Pressable
                style={getRepeatTypeButtonStyle(RepeatCompleteType.WEEK)}
                onPress={changeRepeatType(RepeatCompleteType.WEEK)}>
                <Text style={getRepeatTypeButtonTextStyle(RepeatCompleteType.WEEK)}>일주일</Text>
              </Pressable>
            </View>

            <View style={styles.repeatCountWrapper}>
              <Text style={styles.repeatContainerLabel}>횟수</Text>

              <Pressable
                style={styles.repeatCountButton}
                disabled={disabledChangeRepeatCount}
                onPress={showRepeatCountSelectorBottomSheet}>
                <Text style={repeatCountButtonTextStyle}>{getRepeatCountString(form.repeat_complete_count)}</Text>

                <ArrowDownIcon stroke={disabledChangeRepeatCount ? '#c3c5cc' : '#424242'} />
              </Pressable>
            </View>
          </View>

          <View>
            <Pressable style={styles.addScheduleButton}>
              <Text>일정 연결하기</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <RepeatCountSelectorBottomSheet value={form.repeat_complete_count} onChange={changeRepeatCount} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  listContainer: {
    paddingBottom: 80
  },
  wrapper: {
    paddingHorizontal: 16,
    gap: 20,
    marginBottom: 20
  },
  input: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  repeatContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  repeatContainerLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#c3c5cc'
  },
  repeatTypeWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 20
  },
  repeatTypeButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  repeatTypeButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  repeatCountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  repeatCountButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 38,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  repeatCountButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242',
    paddingHorizontal: 15
  },
  addScheduleButton: {
    height: 157,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const activeRepeatTypeButtonStyle = StyleSheet.compose(styles.repeatTypeButton, {backgroundColor: '#1E90FF'})
const activeRepeatTypeButtonTextStyle = StyleSheet.compose(styles.repeatTypeButtonText, {
  fontFamily: 'Pretendard-SemiBold',
  color: '#ffffff'
})

const disabledRepeatCountButtonTextStyle = StyleSheet.compose(styles.repeatCountButtonText, {color: '#c3c5cc'})

export default EditRoutine
