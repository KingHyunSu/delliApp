import {useRef, useCallback, useMemo} from 'react'
import {ListRenderItem, StyleSheet, FlatList, View, Text, Pressable} from 'react-native'
import BottomSheet, {BottomSheetHandleProps} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
import {useRecoilValue} from 'recoil'
import {activeThemeState, windowDimensionsState} from '@/store/system'
import {GetScheduleCompleteCardListItem, GetScheduleCompleteCardListResponse} from '@/apis/types/scheduleComplete'

interface Props {
  value: GetScheduleCompleteCardListResponse
  onPress: (id: number, completeCount: number) => void
  onPaging: () => void
}
const ScheduleCardListBottomSheet = ({value, onPress, onPaging}: Props) => {
  const domain = process.env.CDN_URL

  const bottomSheetRef = useRef<BottomSheet>(null)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const activeTheme = useRecoilValue(activeThemeState)

  const itemWidth = useMemo(() => {
    return (windowDimensions.width - 20) / 3
  }, [windowDimensions.width])

  const handlePress = useCallback(
    (item: GetScheduleCompleteCardListItem, index: number) => {
      onPress(item.schedule_complete_id, index)
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

  const getRenderItem: ListRenderItem<GetScheduleCompleteCardListItem> = useCallback(
    ({item, index}) => {
      const url = domain + '/' + item.path
      const completeCount = index + 1

      return (
        <View style={styles.itemContainer}>
          <Pressable style={styles.cardWrapper} onPress={() => handlePress(item, completeCount)}>
            <ScheduleCompleteCard
              type="thumb"
              imageUrl={url}
              memo={item.memo}
              completeCount={completeCount}
              shadowColor="#efefef"
              shadowDistance={5}
            />
          </Pressable>
        </View>
      )
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
          <Text style={styles.title}>완료 카드</Text>
          <Text style={styles.countText}>총 {value.total}개</Text>
        </View>

        <FlatList
          data={value.schedule_complete_list}
          renderItem={getRenderItem}
          numColumns={3}
          bounces={false}
          columnWrapperStyle={{width: itemWidth}}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
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
    flex: 1,
    backgroundColor: '#f5f5f5',
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
