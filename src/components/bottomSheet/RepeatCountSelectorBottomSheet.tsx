import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {showRepeatCountSelectorBottomSheetState} from '@/store/bottomSheet'
import {useRecoilState} from 'recoil'

export type Count = 1 | 2 | 3 | 4 | 5 | 6
interface Props {
  value: Count
  onChange: (value: Count) => void
}
const RepeatCountSelectorBottomSheet = ({value, onChange}: Props) => {
  const repeatCountSelectorModalRef = useRef<BottomSheetModal>(null)

  const [showRepeatCountSelectorBottomSheet, setShowRepeatCountSelectorBottomSheet] = useRecoilState(
    showRepeatCountSelectorBottomSheetState
  )

  const handleDismiss = useCallback(() => {
    setShowRepeatCountSelectorBottomSheet(false)
  }, [setShowRepeatCountSelectorBottomSheet])

  const changeValue = useCallback(
    (val: Count) => () => {
      onChange(val)
      handleDismiss()
    },
    [onChange, handleDismiss]
  )

  useEffect(() => {
    if (showRepeatCountSelectorBottomSheet) {
      repeatCountSelectorModalRef.current?.present()
    } else {
      repeatCountSelectorModalRef.current?.dismiss()
    }
  }, [showRepeatCountSelectorBottomSheet])

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

  const countListComponent = useMemo(() => {
    const values = [
      {title: '한 번', value: 1},
      {title: '두 번', value: 2},
      {title: '세 번', value: 3},
      {title: '네 번', value: 4},
      {title: '다섯 번', value: 5},
      {title: '여섯 번', value: 6}
    ]

    return values.map(item => {
      return (
        <Pressable key={item.value} style={styles.item} onPress={changeValue(item.value as Count)}>
          <View style={value === item.value ? activeItemSelectIconStyle : styles.itemSelectIcon}>
            <View style={styles.itemSelectInnerIcon} />
          </View>

          <Text style={styles.itemTitle}>{item.title}</Text>
        </Pressable>
      )
    })
  }, [value, changeValue])

  return (
    <BottomSheetModal
      name="repeatCountSelectorModal"
      ref={repeatCountSelectorModalRef}
      backdropComponent={getBackdropComponent}
      handleComponent={getHandleComponent}
      index={0}
      snapPoints={[450]}
      onDismiss={handleDismiss}>
      <View style={styles.container}>{countListComponent}</View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 10
  },
  item: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  itemSelectIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#eeeded',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemSelectInnerIcon: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ffffff'
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  }
})

const activeItemSelectIconStyle = StyleSheet.compose(styles.itemSelectIcon, {backgroundColor: '#1E90FF'})

export default RepeatCountSelectorBottomSheet
