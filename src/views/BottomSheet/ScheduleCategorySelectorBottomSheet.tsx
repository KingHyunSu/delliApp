import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {ListRenderItem, StyleSheet, View, Text, Pressable, Image, Platform} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetFlatList
} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showScheduleCategorySelectorBottomSheetState} from '@/store/bottomSheet'
import {safeAreaInsetsState} from '@/store/system'
import {scheduleCategoryListState, scheduleState} from '@/store/schedule'

const shadowOffset: [number, number] = [0, -1]

const ScheduleCategorySelectorBottomSheet = () => {
  const scheduleCategorySelectorBottomSheetRef = useRef<BottomSheetModal>(null)

  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory | null>(null)

  const snapPoints = useMemo(() => ['50%'], [])

  const [showScheduleCategorySelectorBottomSheet, setShowScheduleCategorySelectorBottomSheet] = useRecoilState(
    showScheduleCategorySelectorBottomSheetState
  )
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const confirmButtonWrapperStyle = useMemo(() => {
    const bottom = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20

    return [styles.confirmButtonWrapper, {bottom}]
  }, [safeAreaInsets.bottom])

  const handleDismiss = useCallback(() => {
    setShowScheduleCategorySelectorBottomSheet(false)
  }, [setShowScheduleCategorySelectorBottomSheet])

  const handleConfirm = useCallback(async () => {
    let schedule_category_id: number | null = null
    let schedule_category_title = ''

    if (selectedCategory) {
      schedule_category_id = selectedCategory.schedule_category_id
      schedule_category_title = selectedCategory.title
    }

    setSchedule(prevState => ({
      ...prevState,
      schedule_category_id,
      schedule_category_title
    }))

    handleDismiss()
  }, [selectedCategory, setSchedule, handleDismiss])

  const clear = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  const selectScheduleCategory = useCallback(
    (item: ScheduleCategory) => () => {
      if (selectedCategory?.schedule_category_id === item.schedule_category_id) {
        clear()
        return
      }

      setSelectedCategory(item)
    },
    [selectedCategory, clear]
  )

  const getKeyExtractor = useCallback((item: ScheduleCategory, index: number) => {
    return index.toString()
  }, [])

  useEffect(() => {
    if (showScheduleCategorySelectorBottomSheet) {
      if (schedule.schedule_category_id) {
        const activeCategory = scheduleCategoryList.find(
          item => item.schedule_category_id === schedule.schedule_category_id
        )

        if (activeCategory) {
          setSelectedCategory(activeCategory)
        }
      }

      scheduleCategorySelectorBottomSheetRef.current?.present()
    } else {
      scheduleCategorySelectorBottomSheetRef.current?.dismiss()
      clear()
    }
  }, [schedule.schedule_category_id, schedule.schedule_category_title, showScheduleCategorySelectorBottomSheet, clear])

  // components
  const getBackdropComponent = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const getHandleComponent = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const getRenderItem: ListRenderItem<ScheduleCategory> = useCallback(
    ({item}) => {
      const image = item.image ? item.image : require('@/assets/icons/3d/minus.png')
      const isSelected = selectedCategory?.schedule_category_id === item.schedule_category_id
      const borderColor = isSelected ? '#777777' : '#f5f6f8'

      return (
        <Pressable style={[itemStyles.container, {borderColor}]} onPress={selectScheduleCategory(item)}>
          <View style={[itemStyles.iconWrapper, {backgroundColor: `${item.color}30`}]}>
            <Image source={image} style={itemStyles.icon} />
          </View>

          <Text style={itemStyles.title}>{item.title}</Text>
        </Pressable>
      )
    },
    [selectedCategory]
  )

  return (
    <BottomSheetModal
      name="scheduleCategoryModal"
      ref={scheduleCategorySelectorBottomSheetRef}
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>카테고리 선택하기</Text>

        <BottomSheetFlatList
          data={scheduleCategoryList}
          keyExtractor={getKeyExtractor}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.listColumnWrapper}
          renderItem={getRenderItem}
          numColumns={3}
        />
        <Shadow
          startColor="#ffffff"
          distance={20}
          offset={shadowOffset}
          containerStyle={confirmButtonWrapperStyle}
          stretch>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>선택하기</Text>
          </Pressable>
        </Shadow>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    paddingVertical: 10,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    textAlign: 'center'
  },
  listContainer: {
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 16
  },
  listColumnWrapper: {
    gap: 10
  },
  confirmButtonWrapper: {
    position: 'absolute',
    left: 16,
    right: 16
  },
  confirmButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 10
  },
  confirmButtonText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#ffffff'
  }
})

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 3
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 24,
    height: 24
  },
  title: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  }
})

export default ScheduleCategorySelectorBottomSheet
