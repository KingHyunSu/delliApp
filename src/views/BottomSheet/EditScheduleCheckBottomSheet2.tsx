import React, {useCallback} from 'react'
import {Platform, StyleSheet, View, Pressable, Text} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
  BottomSheetHandleProps
} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'

import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {showEditScheduleCheckBottomSheetState} from '@/store/bottomSheet'
import {disableScheduleListState, existScheduleListState, scheduleState} from '@/store/schedule'
import {isEditState} from '@/store/system'

import {useMutation} from '@tanstack/react-query'

import {getTimeOfMinute} from '@/utils/helper'
import {scheduleRepository} from '@/repository'

interface Props {
  refetchScheduleList: Function
}
interface ExistScheduleByDate {
  startDate: string
  endDate: string
  existScheduleList: ExistSchedule[]
}

const shadowOffset: [number, number] = [0, 2]
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

    return mergeList
      .reduce<ExistSchedule[]>((acc, cur) => {
        if (acc.findIndex(item => item.schedule_id === cur.schedule_id) === -1) {
          acc.push(cur)
        }
        return acc
      }, [])
      .reduce<ExistScheduleByDate[]>((acc, cur) => {
        const targetIndex = acc.findIndex(item => {
          return item.startDate === cur.start_date && item.endDate === cur.end_date
        })

        if (targetIndex === -1) {
          acc.push({
            startDate: cur.start_date,
            endDate: cur.end_date,
            existScheduleList: [cur]
          })
        } else {
          acc[targetIndex].existScheduleList.push(cur)
        }

        return acc
      }, [])
  }, [disableScheduleList, existScheduleList])

  const dismissEditScheduleCheckBottomSheet = React.useCallback(() => {
    setShowEditScheduleCheckBottomSheet(false)
  }, [setShowEditScheduleCheckBottomSheet])

  const getTimeText = React.useCallback((time: number) => {
    const timeInfo = getTimeOfMinute(time)

    return `${timeInfo.meridiem} ${timeInfo.hour}시 ${timeInfo.minute}분`
  }, [])

  const getDayOfWeekTextStyle = React.useCallback((dayOfweek: string) => {
    return [styles.dayOfWeekText, dayOfweek === '1' && styles.activeDayOfWeekText]
  }, [])

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
      dismissEditScheduleCheckBottomSheet()
      setIsEdit(false)
    }
  })

  const handleSubmit = useCallback(() => {
    setScheduleMutate()
  }, [setScheduleMutate])

  // components
  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
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
      backdropComponent={backdropComponent}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      onDismiss={dismissEditScheduleCheckBottomSheet}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>겹치는 일정이 있어요</Text>
          {/* <Text style={styles.subTitle}>{`겹치는 일정들은 삭제되며,\n삭제된 일정은 "설정 > 휴지통"에 보관됩니다`}</Text> */}
          <Text style={styles.subTitle}>{`등록시 겹치는 일정들은 삭제됩니다`}</Text>

          <View>
            {list.map((item, index) => {
              return (
                <View key={index} style={styles.section}>
                  <View style={timeStyles.container}>
                    <Text style={timeStyles.text}>
                      {`${item.startDate} ~ ${item.endDate === '9999-12-31' ? '없음' : item.endDate}`}
                    </Text>
                    <View style={timeStyles.line} />
                  </View>

                  {item.existScheduleList.map((sItem, sIndex) => {
                    return (
                      <View key={sIndex} style={styles.itemWrapper}>
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>{sItem.title}</Text>

                          {/* TODO 변경된 종료일 강조 */}
                          <Text style={styles.itemContentsText}>
                            {`${getTimeText(sItem.start_time)} ~ ${getTimeText(sItem.end_time)}`}
                          </Text>

                          <View style={styles.dayOfWeekContainer}>
                            <Text style={getDayOfWeekTextStyle(sItem.mon)}>월</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.tue)}>화</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.wed)}>수</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.thu)}>목</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.fri)}>금</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.sat)}>토</Text>
                            <Text style={getDayOfWeekTextStyle(sItem.sun)}>일</Text>
                          </View>
                        </View>

                        <View style={styles.itemButtonWrapper}>
                          <Pressable style={cancelButton}>
                            <Text style={cancelButtonText}>삭제</Text>
                          </Pressable>
                          <Pressable style={editButton}>
                            <Text style={styles.itemButtonText}>변경</Text>
                          </Pressable>
                        </View>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </View>
      </BottomSheetScrollView>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>적용하기</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242',
    marginBottom: 5
  },
  subTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#7c8698',
    marginBottom: 40
  },
  section: {
    marginBottom: 15,
    gap: 15
  },
  itemWrapper: {
    gap: 7
  },
  item: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    gap: 10
  },
  itemTitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  itemContentsText: {
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
  itemButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  itemButton: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },
  itemButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#fff'
  },

  submitButton: {
    marginHorizontal: 16,
    marginBottom: 20,
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
  submitButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})

const timeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#eeeded'
  }
})

const cancelButton = StyleSheet.compose(styles.itemButton, {backgroundColor: '#ff4b82'})
const cancelButtonText = StyleSheet.compose(styles.itemButtonText, {color: '#ffffff'})
const editButton = StyleSheet.compose(styles.itemButton, {backgroundColor: '#ffb86c'})

export default EditScheduleCheckBottomSheet
