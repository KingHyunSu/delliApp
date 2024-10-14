import React, {useRef, useEffect, useMemo, useCallback} from 'react'
import {ListRenderItem, StyleSheet, View, Text, Image, Platform} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetHandleProps,
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleItem from '@/components/ScheduleItem'

import type {CategoryStatsList} from '@/@types/stats'
import {GetCategoryStatsListResponse} from '@/apis/local/types/stats'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'

interface Props {
  visible: boolean
  data: CategoryStatsList | null
  onClose: () => void
}
const snapPoint = ['80%']
const CategoryStatsDetailBottomSheet = ({visible, data, onClose}: Props) => {
  const categoryStatsDetailBottomSheetRef = useRef<BottomSheetModal>(null)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const bottomSafeArea = useMemo(() => {
    if (Platform.OS === 'ios') {
      return safeAreaInsets.bottom
    }

    return 0
  }, [safeAreaInsets.bottom])

  const listContainerStyle = useMemo(() => {
    return [styles.listContainer, {paddingBottom: bottomSafeArea + 40}]
  }, [bottomSafeArea])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const getKeyExtractor = useCallback((item: GetCategoryStatsListResponse, index: number) => {
    return index.toString()
  }, [])

  useEffect(() => {
    if (visible) {
      categoryStatsDetailBottomSheetRef.current?.present()
    } else {
      categoryStatsDetailBottomSheetRef.current?.dismiss()
    }
  }, [visible])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const handleComponent = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const listHeaderComponent = useMemo(() => {
    if (!data) {
      return <></>
    }
    const image = data.image ? data.image : require('@/assets/icons/3d/minus.png')

    return (
      <View style={styles.header}>
        <Image source={image} style={styles.icon} />
        <Text style={styles.title}>{data.categoryTitle}</Text>

        <Text style={styles.subTitle}>{data.data.length}개</Text>
      </View>
    )
  }, [data])

  const renderItem: ListRenderItem<GetCategoryStatsListResponse> = useCallback(({item, index}) => {
    return (
      <ScheduleItem
        key={index}
        title={item.title}
        categoryId={item.schedule_category_id}
        time={{startTime: item.start_time, endTime: item.end_time}}
        date={{startDate: item.start_date, endDate: item.end_date}}
        dayOfWeek={{
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun
        }}
      />
    )
  }, [])

  if (!data) {
    return <></>
  }

  return (
    <BottomSheetModal
      name="CategoryStatsDetail"
      ref={categoryStatsDetailBottomSheetRef}
      backdropComponent={backdropComponent}
      handleComponent={handleComponent}
      index={0}
      snapPoints={snapPoint}
      onDismiss={handleClose}>
      <View style={styles.container}>
        {listHeaderComponent}

        <BottomSheetFlatList
          data={data.data}
          keyExtractor={getKeyExtractor}
          contentContainerStyle={listContainerStyle}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 20
  },
  icon: {
    width: 48,
    height: 48
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#424242'
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  },
  listContainer: {
    gap: 20,
    paddingHorizontal: 16
  }
})

export default CategoryStatsDetailBottomSheet
