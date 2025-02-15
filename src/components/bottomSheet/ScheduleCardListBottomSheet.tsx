import {useRef, useCallback, useMemo} from 'react'
import {ListRenderItem, StyleSheet, View, Text, Pressable} from 'react-native'
import BottomSheet, {BottomSheetFlatList, BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
import {useRecoilValue} from 'recoil'
import {activeThemeState, displayModeState, windowDimensionsState} from '@/store/system'
import {GetScheduleCompleteCardListResponse} from '@/apis/types/scheduleComplete'

interface Props {
  value: GetScheduleCompleteCardListResponse[]
  total: number
  onPress: (item: GetScheduleCompleteCardListResponse, completeCount: number) => void
  onPaging: () => void
}
const ScheduleCardListBottomSheet = ({value, total, onPress, onPaging}: Props) => {
  const domain = process.env.CDN_URL

  const bottomSheetRef = useRef<BottomSheet>(null)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const activeTheme = useRecoilValue(activeThemeState)
  const displayMode = useRecoilValue(displayModeState)

  const wrapperStyle = useMemo(() => {
    const backgroundColor = displayMode === 1 ? '#e0e0e0' : '#494949'
    return [styles.wrapper, {backgroundColor}]
  }, [displayMode])

  const itemWidth = useMemo(() => {
    return (windowDimensions.width - 20) / 3
  }, [windowDimensions.width])

  const handlePress = useCallback(
    (item: GetScheduleCompleteCardListResponse, index: number) => {
      onPress(item, index)
      bottomSheetRef.current?.collapse()
    },
    [onPress]
  )

  const getBottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const getRenderItem: ListRenderItem<GetScheduleCompleteCardListResponse> = useCallback(
    ({item, index}) => {
      if (item.thumb_path || item.record) {
        const url = item.thumb_path ? domain + '/' + item.thumb_path : null
        const completeCount = index + 1

        return (
          <View style={styles.itemContainer}>
            <Pressable style={styles.cardWrapper} onPress={() => handlePress(item, completeCount)}>
              <ScheduleCompleteCard
                type="thumb"
                imageUrl={url}
                record={item.record}
                completeCount={completeCount}
                shadowColor="#efefef"
                shadowDistance={5}
              />
            </Pressable>
          </View>
        )
      }

      return <></>
    },
    [domain, handlePress]
  )

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={[90, '100%']}
      enableDynamicSizing={false}
      backgroundStyle={{backgroundColor: activeTheme.color1, borderTopLeftRadius: 40, borderTopRightRadius: 40}}
      handleComponent={getBottomSheetHandler}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: activeTheme.color3}]}>완료 카드</Text>
          <Text style={[styles.countText, {color: activeTheme.color3}]}>총 {total}개</Text>
        </View>

        <View style={wrapperStyle}>
          <BottomSheetFlatList
            data={value}
            renderItem={getRenderItem}
            numColumns={3}
            bounces={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{width: itemWidth}}
            contentContainerStyle={styles.listContainer}
            onEndReached={onPaging}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000'
  },
  countText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#555'
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  itemContainer: {
    padding: 10
  },
  cardWrapper: {
    width: '100%',
    aspectRatio: 0.8
  }
})

export default ScheduleCardListBottomSheet
