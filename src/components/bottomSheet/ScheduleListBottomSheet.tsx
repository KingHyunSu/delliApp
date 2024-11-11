import React from 'react'
import {ListRenderItem, StyleSheet, View, Text, Pressable} from 'react-native'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleItem from '@/components/ScheduleItem'
import TimerIcon from '@/assets/icons/timer.svg'
import LottieView from 'lottie-react-native'

import {useRecoilValue} from 'recoil'
import {scheduleListSnapPointState, isEditState, activeThemeState} from '@/store/system'
import {focusModeInfoState, scheduleDateState} from '@/store/schedule'

import {getFocusTimeText} from '@/utils/helper'

interface Props {
  data: Schedule[]
  onAnimate: (fromIndex: number, toIndex: number) => void
  onClick: (value: Schedule) => void
}
const ScheduleListBottomSheet = ({data, onClick, onAnimate}: Props) => {
  const activeTheme = useRecoilValue(activeThemeState)
  const scheduleListSnapPoint = useRecoilValue(scheduleListSnapPointState)
  const isEdit = useRecoilValue(isEditState)
  const scheduleDate = useRecoilValue(scheduleDateState)
  const focusModeInfo = useRecoilValue(focusModeInfoState)

  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const bottomSheetFlatListRef = React.useRef<BottomSheetFlatListMethods>(null)

  const keyExtractor = React.useCallback((item: Schedule, index: number) => {
    return String(index)
  }, [])

  const handleClick = React.useCallback(
    (value: Schedule) => () => {
      onClick(value)
    },
    [onClick]
  )

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

  // components
  const itemHeaderComponent = React.useCallback(
    (item: Schedule) => {
      const isFocusMode = focusModeInfo?.schedule_id === item.schedule_id

      return (
        <View style={itemStyles.badgeContainer}>
          <View style={itemStyles.badgeWrapper}>
            {isFocusMode && (
              <View style={activeFocusModeBadgeStyle}>
                <TimerIcon width={13} height={13} fill="#ffffff" />
                <Text style={itemStyles.focusTimeText}>집중 중이에요</Text>
              </View>
            )}

            {!isFocusMode && !!item.active_time && (
              <View style={focusModeBadgeStyle}>
                <TimerIcon width={13} height={13} fill="#ffffff" />
                <Text style={itemStyles.focusTimeText}>{getFocusTimeText(item.active_time)}</Text>
              </View>
            )}
          </View>
        </View>
      )
    },
    [focusModeInfo]
  )

  const renderItem: ListRenderItem<Schedule> = React.useCallback(
    ({item}) => {
      return (
        <Pressable onPress={handleClick(item)}>
          <ScheduleItem
            title={item.title}
            categoryId={item.schedule_category_id}
            time={{startTime: item.start_time, endTime: item.end_time}}
            date={{startDate: item.start_date, endDate: item.end_date}}
            routineList={item.routine_list}
            todoList={item.todo_list}
            headerComponent={itemHeaderComponent(item)}
            activeTheme={activeTheme}
          />
        </Pressable>
      )
    },
    [activeTheme, itemHeaderComponent, handleClick]
  )

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
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={{backgroundColor: activeTheme.color5}}
      index={0}
      snapPoints={scheduleListSnapPoint}
      handleComponent={bottomSheetHandler}
      onAnimate={onAnimate}>
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
    gap: 15
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

const itemStyles = StyleSheet.create({
  badgeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badgeWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginBottom: 7
  },
  focusTimeText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#ffffff'
  }
})

const focusModeBadgeStyle = StyleSheet.compose(itemStyles.badge, {
  backgroundColor: '#FF6B6B',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3
})
const activeFocusModeBadgeStyle = StyleSheet.compose(itemStyles.badge, {
  backgroundColor: '#FF7043',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3
})

export default ScheduleListBottomSheet
