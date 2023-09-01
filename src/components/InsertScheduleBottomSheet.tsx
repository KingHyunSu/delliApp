import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilValue} from 'recoil'
import {scheduleState} from '@/store/schedule'

const InsertScheduleBottomSheet = () => {
  const schedule = useRecoilValue(scheduleState)

  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const snapPoints = React.useMemo(() => ['35%', '95%'], [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={BottomSheetShadowHandler}>
      <View style={styles.container}>
        <Text>insert schedule</Text>

        <Text>{schedule.start_time}</Text>
        <Text>{schedule.end_time}</Text>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  }
})

export default InsertScheduleBottomSheet
