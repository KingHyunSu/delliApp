import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {FlatList} from 'react-native-gesture-handler'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import Item from './item'

import {TimeTableCategory} from '@/types/timetable'

const tempData: TimeTableCategory[] = [
  {timetable_category_id: 1, title: '할 일'},
  {timetable_category_id: 2, title: '할 일2'}
  // {timetable_category_id: 3, title: '할 일3'},
  // {timetable_category_id: 4, title: '할 일3'},
  // {timetable_category_id: 5, title: '할 일3'},
  // {timetable_category_id: 6, title: '할 일3'},
  // {timetable_category_id: 7, title: '할 일3'},
  // {timetable_category_id: 8, title: '할 일3'},
  // {timetable_category_id: 9, title: '할 일3'},
  // {timetable_category_id: 10, title: '할 일3'}
]

interface Props {
  // value: ScheduleCategory[]
  // isShow: boolean
  isShow: boolean
  onClose: Function
}
const TimetableCategoryBottomSheet = ({isShow, onClose}: Props) => {
  const [category, setCategory] = React.useState<TimeTableCategory | null>(null)
  const [backdropPressBehavior, setBackdropPressBehavior] = React.useState<number | 'close' | 'none' | 'collapse'>(
    'close'
  )

  const timeTableCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => ['80%'], [])

  const onDismiss = () => {
    onClose()
  }

  const addCategory = () => {}

  React.useEffect(() => {
    if (isShow) {
      timeTableCategoryBottomSheetRef.current?.present()
    }
  }, [isShow])

  return (
    <BottomSheetModal
      name="timeTableCategoty"
      ref={timeTableCategoryBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} pressBehavior={backdropPressBehavior} />
      }}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>카테고리</Text>
        <FlatList
          data={tempData}
          contentContainerStyle={{paddingBottom: 90}}
          keyExtractor={(_, index) => String(index)}
          renderItem={({item}) => (
            <Item
              item={item}
              activeCategory={category}
              setActiveCategory={setCategory}
              setBackdropPressBehavior={setBackdropPressBehavior}
            />
          )}
        />

        <Pressable style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addText}>추가하기 {category?.title}</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 20,
    marginVertical: 20,
    marginHorizontal: 16
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2d8cec'
  },
  addText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default TimetableCategoryBottomSheet
