import React from 'react'
import {Keyboard, StyleSheet, ScrollView, View, Text, Pressable} from 'react-native'
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {useRecoilState, useRecoilValue} from 'recoil'
import {showScheduleCategoryBottomSheetState} from '@/store/bottomSheet'
import {safeAreaInsetsState} from '@/store/system'

const shadowOffset: [number, number] = [0, -1]
const ScheduleCategoryBottomSheet = () => {
  const scheduleCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [pressBehavior, setPressBehavior] = React.useState<'close' | 0>('close')

  const [showScheduleCategoryBottomSheet, setShowScheduleCategoryBottomSheet] = useRecoilState(
    showScheduleCategoryBottomSheetState
  )
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const snapPoints = React.useMemo(() => ['50%'], [])

  const confirmButtonWrapperStyle = React.useMemo(() => {
    const bottom = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20

    return [styles.confirmButtonWrapper, {bottom}]
  }, [safeAreaInsets.bottom])

  const handleDismiss = React.useCallback(() => {
    setShowScheduleCategoryBottomSheet(false)
  }, [setShowScheduleCategoryBottomSheet])

  const clickBackdrop = React.useCallback(() => {
    if (pressBehavior === 0) {
      Keyboard.dismiss()
    }
  }, [pressBehavior])

  React.useEffect(() => {
    if (showScheduleCategoryBottomSheet) {
      scheduleCategoryBottomSheetRef.current?.present()
    } else {
      scheduleCategoryBottomSheetRef.current?.dismiss()
    }
  }, [showScheduleCategoryBottomSheet])

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setPressBehavior(0)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setPressBehavior('close')
    })

    // Clean up the event listeners on component unmount
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // components
  const bottomSheetBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => {
      return <BottomSheetBackdrop props={props} pressBehavior={pressBehavior} onPress={clickBackdrop} />
    },
    [pressBehavior, clickBackdrop]
  )

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
        <BottomSheetTextInput style={styles.input} placeholder="일정 카테고리명" placeholderTextColor="#c3c5cc" />

        <ScrollView style={styles.categoryListContainer}>
          <View style={styles.categoryListWrapper}>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>

            <Pressable style={activeScheduleItem}>
              <Text style={activeScheduleItemText}>공부</Text>
            </Pressable>

            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발2222221</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발123123</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발123</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
            <Pressable style={styles.categoryItem}>
              <Text style={styles.categoryItemText}>자기계발</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Shadow
          startColor="#ffffff"
          distance={20}
          offset={shadowOffset}
          containerStyle={confirmButtonWrapperStyle}
          stretch>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>추가하기</Text>
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
  input: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eeeded'
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
  categoryItem: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10
  },
  categoryItemText: {
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

const activeScheduleItem = StyleSheet.compose(styles.categoryItem, {borderColor: '#424242'})
const activeScheduleItemText = StyleSheet.compose(styles.categoryItemText, {color: '#424242'})

export default ScheduleCategoryBottomSheet
