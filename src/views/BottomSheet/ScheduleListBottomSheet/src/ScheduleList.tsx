import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import BottomSheet, {BottomSheetFlatList, BottomSheetFlatListMethods} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import ScheduleListItem from './ScheduleListItem'

import LottieView from 'lottie-react-native'

import {useRecoilValue} from 'recoil'
import {scheduleDateState} from '@/store/schedule'
import {isEditState} from '@/store/system'

interface Props {
  data: Schedule[]
  openEditScheduleBottomSheet: (value?: Schedule) => void
  onClick: (value: Schedule) => void
}
const ScheduleList = ({data, openEditScheduleBottomSheet, onClick}: Props) => {
  const scheduleDate = useRecoilValue(scheduleDateState)
  const isEdit = useRecoilValue(isEditState)

  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetFlatListRef = React.useRef<BottomSheetFlatListMethods>(null)

  const list = React.useMemo(() => {
    const SCHEDULE_DISPLAY_TYPE = {CONTINUE: 'continue', GAP: 'gap'}

    if (data.length === 0) {
      return []
    }

    let result = []

    for (let i = 0; i < data.length - 1; i++) {
      let currentSchedule = {...data[i], display_type: ''}
      const nextSchedule = data[i + 1]

      // 연결된 일정
      if (currentSchedule.end_time === nextSchedule.start_time) {
        currentSchedule.display_type = SCHEDULE_DISPLAY_TYPE.CONTINUE
      }

      result.push(currentSchedule)

      // 공백 일정
      if (currentSchedule.end_time !== nextSchedule.start_time) {
        const schedule = {
          schedule_id: null,
          timetable_category_id: currentSchedule.timetable_category_id,
          start_date: currentSchedule.start_date,
          end_date: '9999-12-31',
          start_time: currentSchedule.end_time,
          end_time: nextSchedule.start_time,
          title: '',
          mon: '1',
          tue: '1',
          wed: '1',
          thu: '1',
          fri: '1',
          sat: '1',
          sun: '1',
          memo: '',
          disable: '0',
          state: '0',
          title_x: 0,
          title_y: 0,
          title_rotate: 0,
          alarm: 0,
          background_color: '#ffffff',
          text_color: '#000000',
          display_type: SCHEDULE_DISPLAY_TYPE.GAP,
          todo_list: []
        }

        result.push(schedule)
      }
    }

    // 마지막 일정 추가
    result.push({...data[data.length - 1], dispay_type: ''})

    return result
  }, [data])

  React.useEffect(() => {
    if (bottomSheetRef.current) {
      if (isEdit) {
        bottomSheetRef.current.close()
      } else {
        bottomSheetRef.current.snapToIndex(0)
      }
    }
  }, [isEdit])

  React.useEffect(() => {
    bottomSheetFlatListRef.current?.scrollToIndex({index: 0})
  }, [scheduleDate, isEdit])

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['20%', '77%']} handleComponent={BottomSheetShadowHandler}>
      {list && list.length > 0 ? (
        <BottomSheetFlatList
          ref={bottomSheetFlatListRef}
          data={list}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={styles.container}
          renderItem={({item, index}) => {
            return (
              <ScheduleListItem
                item={item}
                index={index}
                openEditScheduleBottomSheet={openEditScheduleBottomSheet}
                onClick={onClick}
              />
            )
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <LottieView style={styles.emptyIcon} source={require('@/assets/lottie/empty.json')} autoPlay loop />
          <Text style={styles.emptyText}>일정이 없어요</Text>
        </View>
      )}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  emptyContainer: {
    flex: 1
  },
  emptyIcon: {
    height: '20%'
  },
  emptyText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#babfc5',
    textAlign: 'center'
  }
})

export default ScheduleList
