import React from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {BottomSheetBackdropProps, BottomSheetHandleProps, BottomSheetModal} from '@gorhom/bottom-sheet'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Shadow} from 'react-native-shadow-2'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {useRecoilState} from 'recoil'
import {showScheduleCategoryBottomSheetState} from '@/store/bottomSheet'

const shadowOffset: [number, number] = [0, -1]
const ScheduleCategoryBottomSheet = () => {
  const [showScheduleCategoryBottomSheet, setShowScheduleCategoryBottomSheet] = useRecoilState(
    showScheduleCategoryBottomSheetState
  )
  const scheduleCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)

  React.useEffect(() => {
    if (showScheduleCategoryBottomSheet) {
      scheduleCategoryBottomSheetRef.current?.present()
    } else {
      scheduleCategoryBottomSheetRef.current?.dismiss()
    }
  }, [showScheduleCategoryBottomSheet])

  const handleDismiss = React.useCallback(() => {
    setShowScheduleCategoryBottomSheet(false)
  }, [])
  // components
  const bottomSheetBackdrop = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

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
      snapPoints={['50%']}
      onDismiss={handleDismiss}>
      <KeyboardAwareScrollView style={styles.container}>
        <TextInput style={styles.input} placeholder="일정 카테고리명" placeholderTextColor="#c3c5cc" />

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
          containerStyle={styles.confirmButtonWrapper}
          stretch>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>추가하기</Text>
          </Pressable>
        </Shadow>
      </KeyboardAwareScrollView>
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
    bottom: 20,
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
