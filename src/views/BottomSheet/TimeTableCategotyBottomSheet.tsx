import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
// types
import {TimeTableCategory} from '@/types/timetable'
const tempData: TimeTableCategory[] = [{timetable_id: 1, title: '할 일'}]

interface TimeTableCategoryProps {
  item: TimeTableCategory
}
const TimeTableCategoryItem = ({item}: TimeTableCategoryProps) => {
  return (
    <View style={timeTableCategoryItemStyles.container}>
      <Text style={timeTableCategoryItemStyles.titleText}>{item.title}</Text>
    </View>
  )
}

const timeTableCategoryItemStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f6f8'
  },
  titleText: {
    fontSize: 18,
    color: '#7c8698'
  },
  activeText: {
    color: '#555'
  }
})
interface Props {
  // value: ScheduleCategory[]
  // isShow: boolean
  isShow: boolean
  onClose: Function
}
const TimeTableCategoryBottomSheet = ({isShow, onClose}: Props) => {
  const timeTableCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => ['75%'], [])

  const onDismiss = () => {
    onClose()
  }

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
        return <BottomSheetBackdrop props={props} />
      }}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <BottomSheetFlatList
        data={tempData}
        keyExtractor={(item, index) => String(index)}
        renderItem={TimeTableCategoryItem}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({})

export default TimeTableCategoryBottomSheet
