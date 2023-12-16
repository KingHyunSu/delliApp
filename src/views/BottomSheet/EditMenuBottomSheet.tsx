import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

import {useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState} from 'recoil'
import {isEditState} from '@/store/system'
import {scheduleState} from '@/store/schedule'
import {showScheduleCompleteModalState} from '@/store/modal'
import {showEditMenuBottomSheetState} from '@/store/bottomSheet'

import {trigger} from 'react-native-haptic-feedback'

const EditMenuBottomSheet = () => {
  const [showEditMenuBottomSheet, setShowEditMenuBottomSheet] = useRecoilState(showEditMenuBottomSheetState)
  const setShowScheduleCompleteModal = useSetRecoilState(showScheduleCompleteModalState)
  const setIsEdit = useSetRecoilState(isEditState)
  const schedule = useRecoilValue(scheduleState)
  const resetSchedule = useResetRecoilState(scheduleState)

  const editInfoBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  }
  const haptic = (hapticName: string) => {
    trigger(hapticName, options)
  }

  const openScheduleCompleteModal = () => {
    haptic('impactLight')
    setShowScheduleCompleteModal(true)
  }

  const openEditScheduleBottomSheet = () => {
    setShowEditMenuBottomSheet(false)
    setIsEdit(true)
  }

  React.useEffect(() => {
    if (showEditMenuBottomSheet) {
      haptic('rigid')
      editInfoBottomSheetRef.current?.present()
    } else {
      editInfoBottomSheetRef.current?.dismiss()
    }
  }, [showEditMenuBottomSheet])

  return (
    <BottomSheetModal
      name="editMenu"
      ref={editInfoBottomSheetRef}
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} onPress={() => resetSchedule()} />
      }}
      index={0}
      snapPoints={[350]}
      onDismiss={() => setShowEditMenuBottomSheet(false)}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {/* <Text style={styles.titleText}>
            테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터테스트 데이터
          </Text> */}
          <Text style={styles.titleText}>{schedule.title}</Text>
        </View>

        <Pressable style={[styles.section, styles.completeContainer]} onPress={openScheduleCompleteModal}>
          <Text style={styles.text}>완료하기</Text>

          <View style={styles.completeTimeBox}>
            <Text style={styles.completeTime}>오전 1시 00분</Text>
            <Text style={styles.completeTime}>-</Text>
            <Text style={styles.completeTime}>오전 6시 10분</Text>
          </View>
        </Pressable>
        <Pressable style={styles.section} onPress={openEditScheduleBottomSheet}>
          <Text style={styles.text}>수정하기</Text>
        </Pressable>
        <Pressable style={styles.section}>
          <Text style={styles.text}>삭제하기</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40
  },
  section: {
    marginVertical: 10,
    paddingVertical: 10,
    justifyContent: 'center'
  },
  completeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  completeTimeBox: {
    flexDirection: 'row',
    gap: 5
  },
  completeTime: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    // color: '#1A7BDB'
    color: '#1E90FF'
  },
  titleContainer: {
    height: 50
  },
  titleText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#424242'
  }
})

export default EditMenuBottomSheet
