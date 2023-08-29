import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

const ScheduleListBottomSheet = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const snapPoints = React.useMemo(() => ['23%', '95%'], [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={BottomSheetShadowHandler}>
      <View style={styles.container}>
        <Text>schedule list</Text>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  }
})

export default ScheduleListBottomSheet
