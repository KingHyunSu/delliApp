import React from 'react'
import {Platform, StyleSheet, View, Pressable, Text} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import {trigger} from 'react-native-haptic-feedback'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleItem from '@/components/ScheduleItem'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {disableScheduleListState, existScheduleListState} from '@/store/schedule'
import {isEditState, safeAreaInsetsState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'

import {UpdateScheduleDeleted} from '@/repository/types/schedule'
import DeleteIcon from '@/assets/icons/trash.svg'
import {scheduleRepository} from '@/repository'

import {widgetWithImageUpdatedState} from '@/store/widget'

interface Props {
  invalidScheduleList: Function
}
interface ItemProps {
  schedule: ExistSchedule
  deletedScheduleIdList: UpdateScheduleDeleted[]
  onDelete: (schedule: ExistSchedule) => void
  onCancelDeleted: (schedule: ExistSchedule) => void
}

const Item = ({schedule, deletedScheduleIdList, onDelete, onCancelDeleted}: ItemProps) => {
  const isDeleted = React.useMemo(() => {
    return deletedScheduleIdList.findIndex(sItem => sItem.schedule_id === schedule.schedule_id) !== -1
  }, [schedule.schedule_id, deletedScheduleIdList])

  const handleDeleted = React.useCallback(() => {
    if (isDeleted) {
      onCancelDeleted(schedule)
    } else {
      onDelete(schedule)
    }
  }, [isDeleted, onDelete, onCancelDeleted, schedule])

  // components
  const StateBox = React.useMemo(() => {
    if (isDeleted) {
      return (
        <>
          <View style={deleteIconWrapper}>
            <DeleteIcon width={12} height={12} fill="#fff" />
          </View>
          <Text style={deleteText}>삭제 예정</Text>
        </>
      )
    }

    return (
      <>
        <View style={disabledIconWrapper}>
          <View style={itemStyles.disabledIcon} />
        </View>
        <Text style={disabledText}>비활성화 예정</Text>
      </>
    )
  }, [isDeleted])

  const ChangeStateButton = React.useMemo(() => {
    if (isDeleted) {
      return (
        <Pressable style={itemStyles.button} onPress={handleDeleted}>
          <Text style={disabledButtonText}>비활성화</Text>
        </Pressable>
      )
    }

    return (
      <Pressable style={itemStyles.button} onPress={handleDeleted}>
        <Text style={deleteButtonText}>삭제하기</Text>
      </Pressable>
    )
  }, [isDeleted, handleDeleted])

  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.header}>
        <View style={itemStyles.infoWrapper}>{StateBox}</View>

        {ChangeStateButton}
      </View>

      <ScheduleItem item={schedule as Schedule} backgroundColor="#f9f9f9" />
    </View>
  )
}

const EditScheduleCheckBottomSheet = ({invalidScheduleList}: Props) => {
  const [showEditScheduleCheckBottomSheet, setShowEditScheduleCheckBottomSheet] = useRecoilState(
    showEditScheduleCheckBottomSheetState
  )
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const existScheduleList = useRecoilValue(existScheduleListState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const setIsEdit = useSetRecoilState(isEditState)
  const setWidgetWithImageUpdated = useSetRecoilState(widgetWithImageUpdatedState)

  const editScheduleCheckBottomSheet = React.useRef<BottomSheetModal>(null)

  const [deletedScheduleIdList, setDeletedScheduleIdList] = React.useState<UpdateScheduleDeleted[]>([])

  const snapPoints = React.useMemo(() => {
    return ['90%']
  }, [])

  const bottomSafeArea = React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return safeAreaInsets.bottom
    }

    return 0
  }, [safeAreaInsets.bottom])

  const containerStyle = React.useMemo(() => {
    return {paddingBottom: bottomSafeArea + 88}
  }, [bottomSafeArea])

  const footerButtonStyle = React.useMemo(() => {
    return [footerStyles.button, {marginBottom: bottomSafeArea}]
  }, [bottomSafeArea])

  const list = React.useMemo(() => {
    const allList = [...disableScheduleList, ...existScheduleList]

    return allList.reduce<ExistSchedule[]>((acc, cur) => {
      if (acc.findIndex(item => item.schedule_id === cur.schedule_id) === -1) {
        acc.push(cur)
      }
      return acc
    }, [])
  }, [disableScheduleList, existScheduleList])

  const handleDismiss = React.useCallback(() => {
    setShowEditScheduleCheckBottomSheet(false)
  }, [setShowEditScheduleCheckBottomSheet])

  const deleteSchedule = React.useCallback(
    (schedule: ExistSchedule) => {
      trigger('soft', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      })

      setDeletedScheduleIdList([...deletedScheduleIdList, {schedule_id: schedule.schedule_id}])
    },
    [deletedScheduleIdList]
  )

  const cancelScheduleDeleted = React.useCallback(
    (schedule: ExistSchedule) => {
      trigger('soft', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      })

      const target = deletedScheduleIdList.find(item => item.schedule_id === schedule.schedule_id)

      if (target) {
        const newDeletedScheduleIdList = deletedScheduleIdList.filter(item => item.schedule_id !== target.schedule_id)
        setDeletedScheduleIdList(newDeletedScheduleIdList)
      }
    },
    [deletedScheduleIdList]
  )

  const {mutate: setScheduleMutate} = useMutation({
    mutationFn: async () => {
      return Promise.all(
        list.map(item => {
          const params = {schedule_id: item.schedule_id}
          const isDeleted = deletedScheduleIdList.some(sItem => sItem.schedule_id === item.schedule_id)

          if (isDeleted) {
            // deleted
            return scheduleRepository.updateScheduleDeleted(params)
          }
          // disabled
          return scheduleRepository.updateScheduleDisable(params)
        })
      )
    },
    onSuccess: () => {
      invalidScheduleList()
      handleDismiss()
      setIsEdit(false)

      if (Platform.OS === 'ios') {
        setWidgetWithImageUpdated(true)
      }
    },
    onError: error => {
      console.error('error', error)
    }
  })

  const handleSubmit = React.useCallback(() => {
    setScheduleMutate()
  }, [setScheduleMutate])

  const getKeyExtractor = React.useCallback((item: ExistSchedule) => {
    return String(item.schedule_id)
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

  const header = React.useCallback(() => {
    return (
      <View style={headerStyles.container}>
        <Text style={headerStyles.titleText}>겹치는 일정이 있어요</Text>
        <Text style={headerStyles.subTitleText}>겹치는 일정은 비활성화될 예정이에요</Text>
      </View>
    )
  }, [])

  type RenderItem = {item: ExistSchedule}
  const renderItem = React.useCallback(
    ({item}: RenderItem) => {
      return (
        <Item
          schedule={item}
          deletedScheduleIdList={deletedScheduleIdList}
          onDelete={deleteSchedule}
          onCancelDeleted={cancelScheduleDeleted}
        />
      )
    },
    [deletedScheduleIdList, deleteSchedule, cancelScheduleDeleted]
  )

  React.useEffect(() => {
    if (showEditScheduleCheckBottomSheet) {
      editScheduleCheckBottomSheet.current?.present()
    } else {
      editScheduleCheckBottomSheet.current?.dismiss()
    }
  }, [showEditScheduleCheckBottomSheet])

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

    height: 48,
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

const itemStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 5,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  infoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledIcon: {
    width: 8,
    height: 2,
    backgroundColor: '#fff'
  },
  infoText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  },
  button: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14
  }
})

const disabledIconWrapper = StyleSheet.compose(itemStyles.infoIcon, {backgroundColor: '#9aa0a4'})
const disabledText = StyleSheet.compose(itemStyles.infoText, {color: '#9aa0a4'})
const disabledButtonText = StyleSheet.compose(itemStyles.buttonText, {color: '#9aa0a4'})

const deleteIconWrapper = StyleSheet.compose(itemStyles.infoIcon, {backgroundColor: '#f12d22'})
const deleteText = StyleSheet.compose(itemStyles.infoText, {color: '#f12d22'})
const deleteButtonText = StyleSheet.compose(itemStyles.buttonText, {color: '#f12d22'})

export default EditScheduleCheckBottomSheet
