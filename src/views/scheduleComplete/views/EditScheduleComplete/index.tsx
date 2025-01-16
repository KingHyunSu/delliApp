import {useRef, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetHandleProps,
  BottomSheetBackdropProps,
  BottomSheetFooterProps
} from '@gorhom/bottom-sheet'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import EditScheduleCompleteBackdrop from './components/Backdrop'
import EditScheduleCompleteFooter from './components/Footer'

import {useUpdateScheduleComplete} from '@/apis/hooks/useScheduleComplete'
import {useRecoilState, useRecoilValue} from 'recoil'
import {activeThemeState, safeAreaInsetsState, windowDimensionsState} from '@/store/system'
import {editScheduleCompleteCacheListState, editScheduleCompleteFormState} from '@/store/scheduleComplete'
import {getTimeOfMinute} from '@/utils/helper'
import {EditScheduleCompleteScreenProps} from '@/types/navigation'

const EditScheduleComplete = ({navigation}: EditScheduleCompleteScreenProps) => {
  const {mutateAsync: updateScheduleCompleteMutateAsync} = useUpdateScheduleComplete()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const [editScheduleCompleteForm, setEditScheduleCompleteForm] = useRecoilState(editScheduleCompleteFormState)
  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const activeTheme = useRecoilValue(activeThemeState)

  const imageHeight = useMemo(() => {
    return windowDimensions.height * 0.4
  }, [windowDimensions.height])

  const snapPoints = useMemo(() => {
    const minSnapPoint = windowDimensions.height - safeAreaInsets.top - safeAreaInsets.bottom - (imageHeight + 48) + 20
    const maxSnapPoint = windowDimensions.height - safeAreaInsets.top - safeAreaInsets.bottom - 48

    return [minSnapPoint, maxSnapPoint]
  }, [windowDimensions.height, safeAreaInsets.top, safeAreaInsets.bottom, imageHeight])

  const getTimeText = useCallback((value: number) => {
    const timeInfo = getTimeOfMinute(value)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }, [])

  const changeMemo = useCallback(
    (value: string) => {
      setEditScheduleCompleteForm(prevState => (prevState ? {...prevState, memo: value} : prevState))
    },
    [setEditScheduleCompleteForm]
  )

  const doSubmit = useCallback(async () => {
    if (!editScheduleCompleteForm) {
      return
    }

    const response = await updateScheduleCompleteMutateAsync({
      schedule_complete_id: editScheduleCompleteForm.schedule_complete_id,
      memo: editScheduleCompleteForm.memo || '',
      image_name: ''
    })

    // TODO - response 에서 이미지 url 가져오기
    if (response.result) {
      const newEditScheduleCompleteCacheList = editScheduleCompleteCacheList.map(item => {
        if (editScheduleCompleteForm.schedule_complete_id === item.schedule_complete_id) {
          return {
            ...item,
            memo: editScheduleCompleteForm.memo,
            image_url: ''
          }
        }
        return item
      })

      setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {scheduleUpdated: false}
      })
    }
  }, [
    editScheduleCompleteForm,
    editScheduleCompleteCacheList,
    updateScheduleCompleteMutateAsync,
    navigation,
    setEditScheduleCompleteCacheList
  ])

  const getBackdropComponent = useCallback((props: BottomSheetBackdropProps) => {
    return <EditScheduleCompleteBackdrop props={props} imageHeight={imageHeight} />
  }, [])

  const getBottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        maxSnapIndex={2}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const getFooterComponent = useCallback(
    (props: BottomSheetFooterProps) => {
      return <EditScheduleCompleteFooter props={props} onSubmit={doSubmit} />
    },
    [doSubmit]
  )

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableOverDrag={false}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
      backdropComponent={getBackdropComponent}
      handleComponent={getBottomSheetHandler}
      footerComponent={getFooterComponent}>
      {editScheduleCompleteForm && (
        <BottomSheetScrollView
          style={styles.container}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{editScheduleCompleteForm.schedule_title}</Text>

            <View style={styles.infoWrapper}>
              <View style={styles.dateWrapper}>
                <Text style={styles.dateText}>{editScheduleCompleteForm.complete_date}</Text>
                <Text style={styles.dateText}>
                  {`${getTimeText(editScheduleCompleteForm.start_time)} ~ ${getTimeText(
                    editScheduleCompleteForm.end_time
                  )}`}
                </Text>
              </View>
              <Text style={styles.countText}>{editScheduleCompleteForm.complete_count}번 완료</Text>
            </View>
          </View>

          <BottomSheetTextInput
            value={editScheduleCompleteForm.memo || ''}
            style={[styles.textInput, {borderColor: activeTheme.color2}]}
            multiline
            scrollEnabled={false}
            placeholder="기록을 남겨주세요"
            placeholderTextColor="#c3c5cc"
            onChangeText={changeMemo}
          />
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    flex: 1
  },
  infoContainer: {
    backgroundColor: '#f5f6f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  dateWrapper: {
    gap: 3
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242',
    marginBottom: 5
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Pretendard-regular',
    color: '#424242'
  },
  countText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#000'
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
    minHeight: 200,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  }
})

export default EditScheduleComplete
