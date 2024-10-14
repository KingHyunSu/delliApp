import {useRef, useState, useMemo, useCallback, useEffect} from 'react'
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetHandleProps,
  BottomSheetModal
} from '@gorhom/bottom-sheet'
import OverlapSchedule from './src/OverlapSchedule'

import {useRecoilState, useRecoilValue} from 'recoil'
import {showOverlapScheduleListBottomSheetState} from '@/store/bottomSheet'
import {disableScheduleListState, existScheduleListState} from '@/store/schedule'
import {safeAreaInsetsState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'
import {scheduleRepository} from '@/apis/local'
import {UpdateScheduleDeleted, UpdateScheduleDisable} from '@/apis/local/types/schedule'

interface Props {
  setScheduleMutate: Function
}
const OverlapScheduleListBottomSheet = ({setScheduleMutate}: Props) => {
  const [showOverlapScheduleListBottomSheet, setShowOverlapScheduleListBottomSheet] = useRecoilState(
    showOverlapScheduleListBottomSheetState
  )
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const existScheduleList = useRecoilValue(existScheduleListState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const editScheduleCheckBottomSheet = useRef<BottomSheetModal>(null)

  const [disabledScheduleIdList, setDisabledScheduleIdList] = useState<UpdateScheduleDisable[]>([])
  const [deletedScheduleIdList, setDeletedScheduleIdList] = useState<UpdateScheduleDeleted[]>([])

  const snapPoints = useMemo(() => {
    return ['90%']
  }, [])

  const bottomSafeArea = useMemo(() => {
    if (Platform.OS === 'ios') {
      return safeAreaInsets.bottom
    }

    return 0
  }, [safeAreaInsets.bottom])

  const containerStyle = useMemo(() => {
    return {paddingBottom: bottomSafeArea + 88}
  }, [bottomSafeArea])

  const footerButtonStyle = useMemo(() => {
    return [footerStyles.button, {marginBottom: bottomSafeArea}]
  }, [bottomSafeArea])

  const list = useMemo(() => {
    const allList = [...disableScheduleList, ...existScheduleList]

    return allList.reduce<ExistSchedule[]>((acc, cur) => {
      if (acc.findIndex(item => item.schedule_id === cur.schedule_id) === -1) {
        acc.push(cur)
      }
      return acc
    }, [])
  }, [disableScheduleList, existScheduleList])

  const handleDismiss = useCallback(() => {
    setShowOverlapScheduleListBottomSheet(false)
  }, [setShowOverlapScheduleListBottomSheet])

  const disabledSchedule = useCallback(
    (schedule: ExistSchedule) => {
      setDisabledScheduleIdList([...disabledScheduleIdList, {schedule_id: schedule.schedule_id}])
    },
    [disabledScheduleIdList]
  )

  useEffect(() => {}, [disabledScheduleIdList])

  const deleteSchedule = useCallback(
    (schedule: ExistSchedule) => {
      setDeletedScheduleIdList([...deletedScheduleIdList, {schedule_id: schedule.schedule_id}])
    },
    [deletedScheduleIdList]
  )

  const cancelScheduleDisabled = useCallback(
    (schedule: ExistSchedule) => {
      const target = disabledScheduleIdList.find(item => item.schedule_id === schedule.schedule_id)

      if (target) {
        const newDisabledScheduleIdList = disabledScheduleIdList.filter(item => item.schedule_id !== target.schedule_id)
        setDisabledScheduleIdList(newDisabledScheduleIdList)
      }
    },
    [disabledScheduleIdList]
  )

  const cancelScheduleDeleted = useCallback(
    (schedule: ExistSchedule) => {
      const target = deletedScheduleIdList.find(item => item.schedule_id === schedule.schedule_id)

      if (target) {
        const newDeletedScheduleIdList = deletedScheduleIdList.filter(item => item.schedule_id !== target.schedule_id)
        setDeletedScheduleIdList(newDeletedScheduleIdList)
      }
    },
    [deletedScheduleIdList]
  )

  const {mutate: setOverlapScheduleMutate} = useMutation({
    mutationFn: async () => {
      return Promise.all(
        list.map(item => {
          const params = {schedule_id: item.schedule_id}
          const isDeleted = deletedScheduleIdList.some(sItem => sItem.schedule_id === item.schedule_id)
          const isDisabled = disabledScheduleIdList.some(sItem => sItem.schedule_id === item.schedule_id)

          if (isDeleted) {
            // deleted
            return scheduleRepository.updateScheduleDeleted(params)
          } else if (isDisabled) {
            // disabled
            return scheduleRepository.updateScheduleDisable(params)
          }
        })
      )
    },
    onSuccess: () => {
      handleDismiss()
      setScheduleMutate()
    },
    onError: error => {
      console.error('error', error)
    }
  })

  const handleSubmit = useCallback(() => {
    setOverlapScheduleMutate()
  }, [setOverlapScheduleMutate])

  const getKeyExtractor = useCallback((item: ExistSchedule) => {
    return String(item.schedule_id)
  }, [])

  // components
  const bottomSheetBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

  const bottomSheetHandler = useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const header = useCallback(() => {
    return (
      <View style={headerStyles.container}>
        <Text style={headerStyles.titleText}>겹치는 일정이 있어요</Text>
        <Text style={headerStyles.subTitleText}>겹치는 일정들을 어떻게 할지 확인해 주세요</Text>
      </View>
    )
  }, [])

  type RenderItem = {item: ExistSchedule}
  const renderItem = useCallback(
    ({item}: RenderItem) => {
      return (
        <OverlapSchedule
          schedule={item}
          disabledScheduleIdList={disabledScheduleIdList}
          deletedScheduleIdList={deletedScheduleIdList}
          onDisabled={disabledSchedule}
          onDelete={deleteSchedule}
          onCancelDisabled={cancelScheduleDisabled}
          onCancelDeleted={cancelScheduleDeleted}
        />
      )
    },
    [
      deletedScheduleIdList,
      disabledScheduleIdList,
      disabledSchedule,
      deleteSchedule,
      cancelScheduleDisabled,
      cancelScheduleDeleted
    ]
  )

  useEffect(() => {
    if (showOverlapScheduleListBottomSheet) {
      editScheduleCheckBottomSheet.current?.present()
    } else {
      editScheduleCheckBottomSheet.current?.dismiss()
    }
  }, [showOverlapScheduleListBottomSheet])

  return (
    <BottomSheetModal
      name="editScheduleCheck"
      ref={editScheduleCheckBottomSheet}
      backgroundStyle={styles.background}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <BottomSheetFlatList
        data={list}
        bounces={false}
        keyExtractor={getKeyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={containerStyle}
      />

      <Pressable style={footerButtonStyle} onPress={handleSubmit}>
        <Text style={footerStyles.buttonText}>적용하기</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#f5f6f8' // #ebf0f3
  }
})

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242',
    marginBottom: 5
  },
  scheduleTitleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  subTitleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#7c8698'
  }
})

const footerStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 16,

    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1E90FF',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 2
      }
    })
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default OverlapScheduleListBottomSheet
