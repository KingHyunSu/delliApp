import React from 'react'
import {StyleSheet, View, Text, ListRenderItem, Pressable} from 'react-native'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleListItem from '@/components/ScheduleItem'

import LottieView from 'lottie-react-native'

import {useRecoilValue} from 'recoil'
import {scheduleListSnapPointState, isEditState} from '@/store/system'
import {scheduleDateState} from '@/store/schedule'

interface Props {
  data: Schedule[]
  onClick: (value: Schedule) => void
}
const ScheduleList = ({data, onClick}: Props) => {
  const scheduleListSnapPoint = useRecoilValue(scheduleListSnapPointState)
  const isEdit = useRecoilValue(isEditState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetFlatListRef = React.useRef<BottomSheetFlatListMethods>(null)

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

  const keyExtractor = React.useCallback((item: Schedule, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<Schedule> = React.useCallback(
    ({item}) => {
      return <ScheduleListItem item={item} backgroundColor="#f9f9f9" onClick={onClick} />
    },
    [onClick]
  )

  // components
  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  if (scheduleListSnapPoint.length === 0) {
    return <></>
  }

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={scheduleListSnapPoint} handleComponent={bottomSheetHandler}>
      {data && data.length > 0 ? (
        <BottomSheetFlatList
          ref={bottomSheetFlatListRef}
          data={data}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          renderItem={renderItem}
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
    paddingVertical: 20,
    gap: 20
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
