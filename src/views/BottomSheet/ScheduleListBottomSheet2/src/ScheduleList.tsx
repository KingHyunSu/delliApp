import React from 'react'
import {StyleSheet} from 'react-native'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'
import ScheduleListItem from './ScheduleListItem'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  onClick: (value: Schedule) => void
}
const ScheduleList = ({data, onClick}: Props) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['20%', '77%']} handleComponent={BottomSheetShadowHandler}>
      <BottomSheetFlatList
        data={data}
        keyExtractor={(_, index) => String(index)}
        style={styles.container}
        renderItem={({item, index}) => {
          return <ScheduleListItem item={item} index={index} list={data} onClick={onClick} />
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
