import React from 'react'
import {useWindowDimensions, StyleSheet, FlatList, View, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

interface ColorItemProps {
  item: string
  wrapperSize: number
}
const ColorItem = ({item, wrapperSize}: ColorItemProps) => {
  return (
    <View style={{width: wrapperSize}}>
      <Pressable style={[styles.item, {backgroundColor: item}]} />
    </View>
  )
}

interface Props {
  isShow: boolean
  onClose: Function
}
const ColorPickerBottomSheet = ({isShow, onClose}: Props) => {
  const {width} = useWindowDimensions()
  const itemWidth = React.useMemo(() => {
    return (width - 32) / 5
  }, [width])

  const colorPickerBottomSheet = React.useRef<BottomSheetModal>(null)

  const defaultColorList = ['#ffffff', '#e53935', '#ffb74d', '#ffee58', '#388e5a', '#42a5f5', '#8756d5']

  React.useEffect(() => {
    if (isShow) {
      colorPickerBottomSheet.current?.present()
    } else {
      colorPickerBottomSheet.current?.dismiss()
    }
  }, [isShow])

  return (
    <BottomSheetModal
      name="colorPicker"
      ref={colorPickerBottomSheet}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} />
      }}
      index={0}
      snapPoints={['30%']}
      onDismiss={() => onClose()}>
      <BottomSheetScrollView style={styles.container} scrollEnabled={false}>
        <FlatList
          data={defaultColorList}
          keyExtractor={item => item}
          numColumns={5}
          scrollEnabled={false}
          style={styles.section}
          columnWrapperStyle={styles.columnWrapper}
          // ListHeaderComponent={() => <Text style={styles.label}>기본</Text>}
          renderItem={({item}) => <ColorItem item={item} wrapperSize={itemWidth} />}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30
  },
  section: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#e4e4ec'
  },
  columnWrapper: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  label: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 18,
    paddingLeft: 16,
    marginBottom: 20
  },
  item: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  }
})

export default ColorPickerBottomSheet
