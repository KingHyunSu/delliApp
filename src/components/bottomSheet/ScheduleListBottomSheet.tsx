import React from 'react'
import {ListRenderItem, StyleSheet, View, Text, Pressable} from 'react-native'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleItem from '@/components/ScheduleItem'

import LottieView from 'lottie-react-native'

import {useRecoilValue} from 'recoil'
import {scheduleListSnapPointState, isEditState} from '@/store/system'
import {focusModeInfoState, scheduleDateState} from '@/store/schedule'

interface Props {
  data: Schedule[]
  onClick: (value: Schedule) => void
}
const ScheduleListBottomSheet = ({data, onClick}: Props) => {
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

  const getFocusTime = React.useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600) // 전체 초에서 시간을 계산
    const minutes = Math.floor((seconds % 3600) / 60) // 남은 초에서 분을 계산
    const secs = seconds % 60 // 남은 초

    const hoursStr = hours === 0 ? '' : String(hours).padStart(2, '0') + ':'
    return `${hoursStr}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  // const

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
  const focusTimeTextComponent = React.useCallback(
    (isFocusMode: boolean, activeTime: number | null) => {
      let focusTimeText = ''

      if (isFocusMode && focusModeInfo) {
        focusTimeText = getFocusTime(focusModeInfo.seconds)
      } else if (activeTime) {
        focusTimeText = getFocusTime(activeTime)
      }

      if (focusTimeText) {
        const color = isFocusMode ? '#FF0000' : '#1E90FF'
        return <Text style={[itemStyles.focusTimeText, {color}]}>{focusTimeText}</Text>
      }

      return ''
    },
    [getFocusTime, focusModeInfo]
  )

  const itemHeaderComponent = React.useCallback(
    (item: Schedule) => {
      const isComplete = !!(item.complete_state && item.complete_state > 0)
      const isFocusMode = focusModeInfo?.schedule_id === item.schedule_id

      return (
        <View style={itemStyles.badgeContainer}>
          <View style={itemStyles.badgeWrapper}>
            {isComplete && (
              <View style={completeBadge}>
                <Text style={completeBadgeText}>완료</Text>
              </View>
            )}
            {isFocusMode && (
              <View style={focusModeBadge}>
                <Text style={{fontSize: 10}}>🔥</Text>
                <Text style={focusModeBadgeText}>집중</Text>
              </View>
            )}
          </View>

          {focusTimeTextComponent(isFocusMode, item.active_time)}
        </View>
      )
    },
    [focusModeInfo?.schedule_id, focusTimeTextComponent]
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
            goal={{title: item.goal_title}}
            routineList={item.routine_list}
            todoList={item.todo_list}
            headerComponent={itemHeaderComponent(item)}
          />
        </Pressable>
      )
    },
    [itemHeaderComponent, handleClick]
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

const itemStyles = StyleSheet.create({
  badgeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  badgeWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium'
  },
  focusTimeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold'
  }
})

const completeBadge = StyleSheet.compose(itemStyles.badge, {backgroundColor: '#32CD3220'})
const completeBadgeText = StyleSheet.compose(itemStyles.badgeText, {color: '#32CD32'})
const focusModeBadge = StyleSheet.compose(itemStyles.badge, {
  backgroundColor: '#FF000015',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3
})
const focusModeBadgeText = StyleSheet.compose(itemStyles.badgeText, {color: '#FF0000'})

export default ScheduleListBottomSheet
