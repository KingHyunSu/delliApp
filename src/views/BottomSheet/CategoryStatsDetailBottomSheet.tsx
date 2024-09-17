import React, {useRef, useEffect, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Image, ListRenderItem} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetHandleProps,
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import type {CategoryStatsList} from '@/@types/stats'
import {GetCategoryStatsListResponse} from '@/repository/types/stats'

interface Props {
  visible: boolean
  data: CategoryStatsList | null
  onClose: () => void
}
const CategoryStatsDetailBottomSheet = ({visible, data, onClose}: Props) => {
  const categoryStatsDetailBottomSheetRef = useRef<BottomSheetModal>(null)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const getKeyExtractor = useCallback((item: GetCategoryStatsListResponse, index: number) => {
    return index.toString()
  }, [])

  useEffect(() => {
    if (visible) {
      console.log('visible', visible)
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
        <View style={styles.titleWrapper}>
          <Image source={image} style={styles.icon} />
          <Text style={styles.title}>{data.categoryTitle}</Text>
        </View>

        <Text>총 {data.data.length}개</Text>
      </View>
    )
  }, [data])

  const renderItem: ListRenderItem<Schedule> = useCallback(({item}) => {
    return (
      <View>
        <Text>item</Text>
      </View>
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
      snapPoints={['80%']}
      onDismiss={handleClose}>
      <View style={styles.container}>
        <BottomSheetFlatList
          data={data.data}
          keyExtractor={getKeyExtractor}
          ListHeaderComponent={listHeaderComponent}
          renderItem={renderItem}
        />
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    paddingVertical: 10,
    gap: 20
  },
  titleWrapper: {
    alignItems: 'center',
    gap: 10
  },
  icon: {
    width: 48,
    height: 48
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
    color: '#424242'
  }
})

export default CategoryStatsDetailBottomSheet
