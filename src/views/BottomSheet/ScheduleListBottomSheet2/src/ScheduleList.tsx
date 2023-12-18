import React from 'react'
import {StyleSheet, Text} from 'react-native'
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
    // let prevScheduleEndTime = data[0].end_time
    console.log('data.length', data.length)
    for (let i = 0; i < data.length - 1; i++) {
      let currentSchedule = {
        ...data[i],
        display_type: ''
      }
      const nextScheduleStartTime = data[i + 1].start_time

      if (currentSchedule.end_time === nextScheduleStartTime) {
        currentSchedule.display_type = SCHEDULE_DISPLAY_TYPE.CONTINUE
      }
      result.push(currentSchedule)

      if (currentSchedule.end_time !== nextScheduleStartTime) {
        const defaultSchedule = {
          schedule_id: null,
          timetable_category_id: null,
          start_date: '',
          end_date: '9999-12-31',
          start_time: 300,
          end_time: 500,
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
          alram: false,
          background_color: '#ffffff',
          text_color: '#000000'
        }

        const gapSchedule = {
          ...defaultSchedule,
          start_time: currentSchedule.end_time,
          end_time: nextScheduleStartTime,
          display_type: 'gap'
        }

        result.push(gapSchedule)
      }
      // [todo] 계획 시간과 완료 시간이 다르면 display_type = '', result.push
    }

    const lastSchedule = {...data[data.length - 1], dispay_type: ''}
    result.push(lastSchedule)

    return result
  }, [data])

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['20%', '77%']} handleComponent={BottomSheetShadowHandler}>
      {/* <Text
        style={{
          paddingHorizontal: 16,
          // paddingVertical: 20,
          paddingTop: 10,
          paddingBottom: 30,
          fontSize: 18,
          fontFamily: 'Pretendard-Bold'
        }}>
        일정 목록
      </Text> */}
      <BottomSheetFlatList
        data={list}
        keyExtractor={(_, index) => String(index)}
        style={styles.container}
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
    paddingHorizontal: 16
  }
})

export default ScheduleList
