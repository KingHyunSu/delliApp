import React, {useCallback} from 'react'
import {Platform, StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetModal, BottomSheetScrollView, BottomSheetBackdropProps} from '@gorhom/bottom-sheet'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'

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
    let targetList = disableScheduleList

    if (existScheduleList.length > 0) {
      targetList = existScheduleList
    }

    return targetList
  }, [disableScheduleList, existScheduleList])

  const backdropComponent = React.useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop props={props} />
  }, [])

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
      const params = {
        schedule,
        disableScheduleIdList: list.map(item => {
          return {schedule_id: item.schedule_id}
        })
      }

      await scheduleRepository.setSchedule(params)
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
      index={0}
      snapPoints={snapPoints}
      onDismiss={dismissEditScheduleCheckBottomSheet}>
      <BottomSheetScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>겹치는 일정이 있어요</Text>
          {/* <Text style={styles.subTitle}>{`겹치는 일정들은 삭제되며,\n삭제된 일정은 "설정 > 휴지통"에 보관됩니다`}</Text> */}
          <Text style={styles.subTitle}>{`등록시 겹치는 일정들은 삭제됩니다`}</Text>

          <View>
            {list.map(item => {
              return (
                <View key={item.schedule_id} style={styles.section}>
                  <View style={timeStyles.container}>
                    <Text style={timeStyles.text}>
                      {`${getTimeText(item.start_time)} ~ ${getTimeText(item.end_time)}`}
                    </Text>
                    <View style={timeStyles.line} />
                  </View>

                  <View style={styles.item}>
                    <Text style={styles.itemTitle}>{item.title}</Text>

                    <Text style={styles.dateText}>
                      {`${item.start_date} ~ ${item.end_date === '9999-12-31' ? '없음' : item.end_date}`}
                    </Text>

                    <View style={styles.dayOfWeekContainer}>
                      <Text style={getDayOfWeekTextStyle(item.mon)}>월</Text>
                      <Text style={getDayOfWeekTextStyle(item.tue)}>화</Text>
                      <Text style={getDayOfWeekTextStyle(item.wed)}>수</Text>
                      <Text style={getDayOfWeekTextStyle(item.thu)}>목</Text>
                      <Text style={getDayOfWeekTextStyle(item.fri)}>금</Text>
                      <Text style={getDayOfWeekTextStyle(item.sat)}>토</Text>
                      <Text style={getDayOfWeekTextStyle(item.sun)}>일</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </BottomSheetScrollView>

      <Pressable style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>등록하기</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242',
    paddingTop: 20,
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

  dateText: {
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

  submitBtn: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 40,
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
        elevation: 3
      }
    })
  },
  submitText: {
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

export default EditScheduleCheckBottomSheet
