import React from 'react'
import {Platform, StyleSheet, View, Pressable, Text} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import ScheduleItem from '@/components/ScheduleItem'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {disableScheduleListState, existScheduleListState, scheduleState} from '@/store/schedule'
import {isEditState, safeAreaInsetsState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'

import DeleteIcon from '@/assets/icons/trash.svg'

interface Props {
  refetchScheduleList: Function
}
interface ItemProps {
  item: ExistSchedule
  onDelete: () => void
}

const Item = ({item, onDelete}: ItemProps) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.header}>
        <View style={itemStyles.infoWrapper}>
          <View style={disabledIconWrapper}>
            <View style={itemStyles.disabledIcon} />
          </View>
          <Text style={disabledText}>비활성화</Text>
          {/*<View style={deleteIconWrapper}>*/}
          {/*  <DeleteIcon width={12} height={12} fill="#fff" />*/}
          {/*</View>*/}
          {/*<Text style={deleteText}>삭제</Text>*/}
          {/*<CheckCircleIcon width={14} height={14} fill="#9aa0a4" />*/}
        </View>

        <Pressable style={itemStyles.deleteButton} onPress={onDelete}>
          <Text style={itemStyles.deleteButtonText}>삭제하기</Text>
        </Pressable>
      </View>

      <ScheduleItem item={item as Schedule} backgroundColor="#f9f9f9" />
    </View>
  )
}

const EditScheduleCheckBottomSheet = ({refetchScheduleList}: Props) => {
  const [showEditScheduleCheckBottomSheet, setShowEditScheduleCheckBottomSheet] = useRecoilState(
    showEditScheduleCheckBottomSheetState
  )
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const existScheduleList = useRecoilValue(existScheduleListState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)
  const schedule = useRecoilValue(scheduleState)
  const setIsEdit = useSetRecoilState(isEditState)

  const editScheduleCheckBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['90%']
  }, [])

  const containerStyle = React.useMemo(() => {
    let marginBottom = 0

    if (Platform.OS === 'ios') {
      marginBottom = safeAreaInsets.bottom
    }

    return {marginBottom}
  }, [])

  const list = React.useMemo(() => {
    const mergeList = [...disableScheduleList, ...existScheduleList]

    return mergeList.reduce<ExistSchedule[]>((acc, cur) => {
      if (acc.findIndex(item => item.schedule_id === cur.schedule_id) === -1) {
        acc.push(cur)
      }
      return acc
    }, [])
  }, [disableScheduleList, existScheduleList])

  const handleDismiss = React.useCallback(() => {
    setShowEditScheduleCheckBottomSheet(false)
  }, [setShowEditScheduleCheckBottomSheet])

  const deleteSchedule = () => {}

  const {mutate: setScheduleMutate} = useMutation({
    mutationFn: async () => {
      // const disableScheduleIdList = list.map(item => {
      //   return {schedule_id: item.schedule_id}
      // })
      //
      // if (schedule.schedule_id) {
      //   disableScheduleIdList.push({schedule_id: schedule.schedule_id})
      // }
      //
      // const params = {
      //   schedule,
      //   disableScheduleIdList
      // }
      //
      // await scheduleRepository.setSchedule(params)
    },
    onSuccess: async () => {
      await refetchScheduleList()
      handleDismiss()
      setIsEdit(false)
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
  const renderItem = React.useCallback(({item}: RenderItem) => {
    return <Item item={item} onDelete={deleteSchedule} />
  }, [])

  const footer = React.useCallback(() => {
    return (
      <Pressable style={footerStyles.button}>
        <Text style={footerStyles.buttonText}>적용하기</Text>
      </Pressable>
    )
  }, [])

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
      backgroundStyle={{backgroundColor: '#f5f6f8'}} // #ebf0f3
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
        ListFooterComponent={footer}
        style={containerStyle}
        contentContainerStyle={styles.container}
        ListFooterComponentStyle={footerStyles.container}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
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
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 20,
    paddingHorizontal: 16
  },
  button: {
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
  deleteButton: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#f12d22'
  }
})

const disabledIconWrapper = StyleSheet.compose(itemStyles.infoIcon, {backgroundColor: '#9aa0a4'})
const disabledText = StyleSheet.compose(itemStyles.infoText, {color: '#9aa0a4'})
const deleteIconWrapper = StyleSheet.compose(itemStyles.infoIcon, {backgroundColor: '#FD4672'})
const deleteText = StyleSheet.compose(itemStyles.infoText, {color: '#FD4672'})

export default EditScheduleCheckBottomSheet
