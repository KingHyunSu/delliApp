import React from 'react'
import {StyleSheet, ScrollView, View, Text, Pressable, Image} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showScheduleCategoryBottomSheetState} from '@/store/bottomSheet'
import {safeAreaInsetsState} from '@/store/system'
import {scheduleCategoryListState, scheduleState} from '@/store/schedule'

const shadowOffset: [number, number] = [0, -1]
const ScheduleCategoryBottomSheet = () => {
  const scheduleCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [selectedCategory, setSelectedCategory] = React.useState<ScheduleCategory>({
    schedule_category_id: null,
    icon: '',
    title: ''
  })

  const [showScheduleCategoryBottomSheet, setShowScheduleCategoryBottomSheet] = useRecoilState(
    showScheduleCategoryBottomSheetState
  )
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const snapPoints = React.useMemo(() => ['50%'], [])

  const scheduleCategoryTitle = React.useMemo(() => {
    return selectedCategory.schedule_category_id ? selectedCategory.title : '미지정'
  }, [selectedCategory])

  const titleStyle = React.useMemo(() => {
    return selectedCategory.schedule_category_id ? styles.title : emptyTitle
  }, [selectedCategory.schedule_category_id])

  const confirmButtonWrapperStyle = React.useMemo(() => {
    const bottom = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20

    return [styles.confirmButtonWrapper, {bottom}]
  }, [safeAreaInsets.bottom])

  const categoryItemStyle = React.useCallback(
    (item: ScheduleCategory) => {
      return item.schedule_category_id === selectedCategory.schedule_category_id ? activeItem : styles.item
    },
    [selectedCategory.schedule_category_id]
  )

  const categoryItemTextStyle = React.useCallback(
    (item: ScheduleCategory) => {
      return item.schedule_category_id === selectedCategory.schedule_category_id ? activeItemText : styles.itemText
    },
    [selectedCategory.schedule_category_id]
  )

  const handleDismiss = React.useCallback(() => {
    setShowScheduleCategoryBottomSheet(false)
  }, [setShowScheduleCategoryBottomSheet])

  const clear = React.useCallback(() => {
    setSelectedCategory({schedule_category_id: null, icon: '', title: ''})
  }, [])

  const selectScheduleCategory = React.useCallback(
    (item: ScheduleCategory) => () => {
      if (selectedCategory.schedule_category_id === item.schedule_category_id) {
        clear()

        return
      }

      setSelectedCategory(item)
    },
    [selectedCategory, clear]
  )

  const handleConfirm = React.useCallback(async () => {
    setSchedule(prevState => ({
      ...prevState,
      schedule_category_id: selectedCategory.schedule_category_id,
      schedule_category_title: selectedCategory.title
    }))
    handleDismiss()
  }, [selectedCategory, setSchedule, handleDismiss])

  React.useEffect(() => {
    if (showScheduleCategoryBottomSheet) {
      if (schedule.schedule_category_id) {
        const activeCategory = scheduleCategoryList.find(
          item => item.schedule_category_id === schedule.schedule_category_id
        )

        if (activeCategory) {
          setSelectedCategory(activeCategory)
        }
      }
      scheduleCategoryBottomSheetRef.current?.present()
    } else {
      clear()
      scheduleCategoryBottomSheetRef.current?.dismiss()
    }
  }, [schedule.schedule_category_id, schedule.schedule_category_title, showScheduleCategoryBottomSheet, clear])

  // components
  const bottomSheetBackdrop = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const scheduleCategories = React.useMemo(() => {
    return scheduleCategoryList.map((item, index) => (
      <Pressable key={index} style={categoryItemStyle(item)} onPress={selectScheduleCategory(item)}>
        <Text>{item.icon}</Text>
        <Text style={categoryItemTextStyle(item)}>{item.title}</Text>
      </Pressable>
    ))
  }, [scheduleCategoryList, categoryItemStyle, categoryItemTextStyle, selectScheduleCategory])

  return (
    <BottomSheetModal
      name="scheduleCategoryBottomSheet"
      ref={scheduleCategoryBottomSheetRef}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      keyboardBlurBehavior="restore"
      onDismiss={handleDismiss}>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />

          <Text style={titleStyle}>{scheduleCategoryTitle}</Text>
        </View>

        <ScrollView style={styles.categoryListContainer}>
          <View style={styles.categoryListWrapper}>{scheduleCategories}</View>
        </ScrollView>

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
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1
  },
  icon: {
    width: 24,
    height: 24
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eeeded'
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242'
  },
  categoryListContainer: {
    marginTop: 20
  },
  categoryListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 68
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 38,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 30
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#777777'
  },

  confirmButtonWrapper: {
    position: 'absolute',
    left: 16,
    right: 16
  },
  confirmButton: {
    height: 48,
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

const emptyTitle = StyleSheet.compose(styles.title, {color: '#c3c5cc'})
const activeItem = StyleSheet.compose(styles.item, {borderColor: '#424242'})
const activeItemText = StyleSheet.compose(styles.itemText, {color: '#424242', fontFamily: 'Pretendard-Bold'})

export default ScheduleCategoryBottomSheet
