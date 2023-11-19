import React from 'react'
import {useWindowDimensions, StyleSheet, FlatList, View, Text, Pressable} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetShadowHandler from '@/components/BottomSheetShadowHandler'

import {useRecoilState} from 'recoil'
import {showColorPickerBottomSheetState} from '@/store/bottomSheet'

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

const ColorPickerBottomSheet = () => {
  const [isShow, setIsShow] = useRecoilState(showColorPickerBottomSheetState)

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
        return <BottomSheetBackdrop props={props} opacity={0} />
      }}
      handleComponent={BottomSheetShadowHandler}
      index={0}
      snapPoints={['35%']}
      onDismiss={() => setIsShow(false)}>
      <BottomSheetScrollView style={styles.container} scrollEnabled={false}>
        <Text style={styles.title}>배경색 선택하기</Text>
        <FlatList
          data={defaultColorList}
          keyExtractor={item => item}
          numColumns={5}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({item}) => <ColorItem item={item} wrapperSize={itemWidth} />}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  columnWrapper: {
    paddingHorizontal: 16,
    marginBottom: 20
  },
  title: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    paddingLeft: 16,
    marginBottom: 30
  },
  label: {
    fontFamily: 'GmarketSansTTFMedium',
    fontSize: 18,
    paddingLeft: 16,
    marginBottom: 20
  },
  item: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#f5f6f8'
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 20
  },
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  closebutton: {
    flex: 1,
    backgroundColor: '#BABABA'
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2d8cec'
  },
  buttonText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default ColorPickerBottomSheet
