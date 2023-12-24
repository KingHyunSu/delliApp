import React from 'react'
import {StyleSheet} from 'react-native'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import ScheduleListItem from './ScheduleListItem'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  openEditScheduleBottomSheet: (value?: Schedule) => void
  onClick: (value: Schedule) => void
}
const ScheduleList = ({data, openEditScheduleBottomSheet, onClick}: Props) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)

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
          display_type: SCHEDULE_DISPLAY_TYPE.GAP
        }

        result.push(schedule)
      }
    }

    // 마지막 일정 추가
    result.push({...data[data.length - 1], dispay_type: ''})

    return result
  }, [data])

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['20%', '77%']} handleComponent={BottomSheetShadowHandler}>
      <BottomSheetFlatList
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
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20
  }
})

export default ScheduleList
