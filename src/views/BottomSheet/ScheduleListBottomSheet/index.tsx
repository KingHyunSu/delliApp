import React from 'react'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import Item from './Item'

import {Schedule} from '@/types/schedule'

interface Props {
  data: Schedule[]
  onComplete: Function
}
const ScheduleListBottomSheet = ({data, onComplete}: Props) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const snapPoints = React.useMemo(() => ['20%', '95%'], [])

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints} handleComponent={BottomSheetShadowHandler}>
      <BottomSheetFlatList
        data={data}
        keyExtractor={(_, index) => String(index)}
        renderItem={({item, index}) => {
          return <Item item={item} index={index} onComplete={onComplete} />
        }}
      />
    </BottomSheet>
  )
}

export default ScheduleListBottomSheet
