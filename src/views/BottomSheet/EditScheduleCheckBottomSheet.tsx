import React from 'react'
import {Platform, StyleSheet, View, Pressable, Text, Image} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {Shadow} from 'react-native-shadow-2'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {disableScheduleListState, existScheduleListState, scheduleState} from '@/store/schedule'
import {isEditState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'

import {getTimeOfMinute} from '@/utils/helper'
import {scheduleRepository} from '@/repository'

import CheckCircleIcon from '@/assets/icons/check_circle.svg'

interface Props {
  refetchScheduleList: Function
}
interface ItemProps {
  item: ExistSchedule
}

const shadowOffset: [number, number] = [0, 1]

const Item = ({item}: ItemProps) => {
  const getTimeText = (time: number) => {
    const timeInfo = getTimeOfMinute(time)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }

  const getDayOfWeekTextStyle = (dayOfweek: string) => {
    return [itemStyles.dayOfWeekText, dayOfweek === '1' && itemStyles.activeDayOfWeekText]
  }

  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.infoWrapper}>
        <CheckCircleIcon width={14} height={14} fill="#ffb86c" />
        <Text style={itemStyles.infoText}>{/*변경전*/}수정됨</Text>
      </View>

      <Shadow startColor="#00000010" distance={5} offset={shadowOffset} stretch>
        <View style={itemStyles.item}>
          <Text style={itemStyles.titleText}>{item.title}</Text>

          {/* TODO 변경된 종료일 강조 */}
          <View style={itemStyles.contentsSection}>
            <Image
              source={require('@/assets/icons/calendar.png')}
              width={16}
              height={16}
              style={{width: 16, height: 16}}
            />
            <Text style={itemStyles.contentsText}>
              {`${item.start_date} ~ ${item.end_date === '9999-12-31' ? '없음' : item.end_date}`}
            </Text>
          </View>

          <View style={itemStyles.contentsSection}>
            <Image source={require('@/assets/icons/time.png')} width={16} height={16} style={{width: 16, height: 16}} />
            <Text style={itemStyles.contentsText}>
              {`${getTimeText(item.start_time)} ~ ${getTimeText(item.end_time)}`}
            </Text>
          </View>

          <View style={itemStyles.dayOfWeekContainer}>
            <Text style={getDayOfWeekTextStyle(item.mon)}>월</Text>
            <Text style={getDayOfWeekTextStyle(item.tue)}>화</Text>
            <Text style={getDayOfWeekTextStyle(item.wed)}>수</Text>
            <Text style={getDayOfWeekTextStyle(item.thu)}>목</Text>
            <Text style={getDayOfWeekTextStyle(item.fri)}>금</Text>
            <Text style={getDayOfWeekTextStyle(item.sat)}>토</Text>
            <Text style={getDayOfWeekTextStyle(item.sun)}>일</Text>
          </View>
        </View>
      </Shadow>

      <View style={itemStyles.buttonWrapper}>
        <Pressable style={cancelButton}>
          <Text style={cancelButtonText}>삭제</Text>
        </Pressable>
        <Pressable style={editButton}>
          <Text style={itemStyles.buttonText}>수정</Text>
        </Pressable>
      </View>
    </View>
  )
}

const EditScheduleCheckBottomSheet = ({refetchScheduleList}: Props) => {
  const [showEditScheduleCheckBottomSheet, setShowEditScheduleCheckBottomSheet] = useRecoilState(
    showEditScheduleCheckBottomSheetState
  )
  const disableScheduleList = useRecoilValue(disableScheduleListState)
  const existScheduleList = useRecoilValue(existScheduleListState)
  const schedule = useRecoilValue(scheduleState)
  const setIsEdit = useSetRecoilState(isEditState)

  const editScheduleCheckBottomSheet = React.useRef<BottomSheetModal>(null)

  const snapPoints = React.useMemo(() => {
    return ['90%']
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
        <View style={headerStyles.subTitleWrapper}>
          <Text style={headerStyles.scheduleTitleText}>"{schedule.title}" </Text>
          <Text style={headerStyles.subTitleText}>일정과 겹치는 일정을 변경해야 해요</Text>
        </View>
      </View>
    )
  }, [schedule.title])

  const footer = React.useCallback(() => {
    return (
      <Pressable style={footerStyles.button}>
        <Text style={footerStyles.buttonText}>등록하기</Text>
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
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}>
      <BottomSheetFlatList
        data={list}
        keyExtractor={getKeyExtractor}
        renderItem={Item}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.container}
        ListFooterComponentStyle={footerStyles.container}
      />
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9'
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
  subTitleWrapper: {
    flexDirection: 'row'
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
    gap: 15,
    backgroundColor: '#fff'
  },
  infoWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  infoText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffb86c'
  },
  item: {
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  titleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  contentsSection: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  contentsText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#424242'
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 3
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 11,
    color: '#babfc5'
  },
  activeDayOfWeekText: {
    color: '#1E90FF'
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#fff'
  }
})

const cancelButton = StyleSheet.compose(itemStyles.button, {backgroundColor: '#ff4b82'})
const cancelButtonText = StyleSheet.compose(itemStyles.buttonText, {color: '#ffffff'})
const editButton = StyleSheet.compose(itemStyles.button, {backgroundColor: '#ffb86c'})

export default EditScheduleCheckBottomSheet
