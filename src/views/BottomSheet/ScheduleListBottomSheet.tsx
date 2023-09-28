import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

const ScheduleItem = () => {
  return (
    <View style={scheduleItemStyles.container}>
      <View style={scheduleItemStyles.checkBox} />
      <View style={scheduleItemStyles.textContainer}>
        <Text>test</Text>
        <Text style={scheduleItemStyles.timeText}>08:00 ~ 09:30</Text>
      </View>
    </View>
  )
}

const scheduleItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f6f8'
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1
  },
  textContainer: {
    gap: 5
  },
  timeText: {
    fontSize: 12,
    fontWeight: '200'
  }
})

const ScheduleListBottomSheet = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)

  const snapPoints = React.useMemo(() => ['23%', '95%'], [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleComponent={BottomSheetShadowHandler}>
      <BottomSheetFlatList
        data={[1, 2]}
        keyExtractor={(item, index) => String(index)}
        renderItem={ScheduleItem}
      />
      {/* <View style={styles.container}>
        <Text>schedule list</Text>
      </View> */}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  }
})

export default ScheduleListBottomSheet
