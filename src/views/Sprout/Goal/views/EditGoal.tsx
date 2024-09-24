import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {format} from 'date-fns'
import AppBar from '@/components/AppBar'
import Panel from '@/components/Panel'
import Switch from '@/components/Swtich'
import DatePicker from '@/components/DatePicker'
import EditGoalScheduleItem from '@/views/Sprout/Goal/components/EditGoalScheduleItem'
import PushpineIcon from '@/assets/icons/pushpin.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

import {useMutation, useQuery} from '@tanstack/react-query'
import {goalRepository} from '@/repository'
import {EditGoalScreenProps} from '@/types/navigation'
import {Goal, GoalSchedule} from '@/@types/goal'
import {selectGoalScheduleListState} from '@/store/goal'
import {SetGoalDetailParams} from '@/repository/types/goal'

const EditGoal = ({navigation, route}: EditGoalScreenProps) => {
  const [expandDDayPanel, setExpandDDayPanel] = useState(false)
  const [activeDDay, setActiveDDay] = useState(false)
  const [form, setForm] = useState<Goal>({
    goal_id: null,
    title: '',
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: []
  })

  const [selectGoalScheduleList, setSelectGoalScheduleList] = useRecoilState(selectGoalScheduleListState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const {data: goalDetail} = useQuery({
    queryKey: ['goalDetail', route.params.id],
    queryFn: async () => {
      if (route.params.id) {
        const params = {
          goal_id: route.params.id
        }

        return await goalRepository.getGoalDetail(params)
      }

      return null
    },
    initialData: null,
    enabled: !!route.params.id
  })

  const {mutate: setGoalDetailMutate} = useMutation({
    mutationFn: () => {
      const params: SetGoalDetailParams = {
        title: form.title,
        end_date: form.end_date,
        active_end_date: form.active_end_date,
        state: form.state
      }

      return goalRepository.setGoalDetail(params)
    },
    onSuccess: () => {
      console.log('Success!!')
    }
  })

  useEffect(() => {
    if (goalDetail) {
      setForm(goalDetail)
      setSelectGoalScheduleList(goalDetail.scheduleList)
    }
  }, [goalDetail])

  const stickyHeaderIndices = useMemo(() => [1], [])

  const activityGoalText = useMemo(() => {
    let totalFocusTime = 0
    let totalCompleteCount = 0

    selectGoalScheduleList.forEach(item => {
      totalFocusTime += item.focus_time || 0
      totalCompleteCount += item.complete_count || 0
    })

    const hours = Math.floor(totalFocusTime / 60)
    const minutes = Math.floor(totalFocusTime % 60)
    let hoursStr = ''
    let minutesStr = ''

    if (hours > 0) {
      hoursStr = `${hours}시간 `
    }
    if (minutes > 0) {
      minutesStr = `${minutes}분`
    }

    let timeStr = `${hoursStr}${minutesStr}`
    if (hours === 0 && minutes === 0) {
      timeStr = '0분'
    }

    return `총 ${timeStr} / ${totalCompleteCount}회`
  }, [selectGoalScheduleList])

  const handleExpandDatePanel = useCallback(() => {
    setExpandDDayPanel(!expandDDayPanel)
  }, [expandDDayPanel, setExpandDDayPanel])

  const changeActiveDDay = useCallback(() => {
    setActiveDDay(!activeDDay)

    if (!activeDDay) {
      setExpandDDayPanel(true)
    }
  }, [activeDDay, setActiveDDay, setExpandDDayPanel])

  const changeDDay = useCallback((date: string) => {
    setForm(prevState => ({
      ...prevState,
      end_date: date
    }))
  }, [])

  const changeItemValue = useCallback(
    (value: GoalSchedule, index: number) => {
      const newScheduleList = [...selectGoalScheduleList]
      newScheduleList[index] = value

      setSelectGoalScheduleList(newScheduleList)
    },
    [selectGoalScheduleList]
  )

  const moveSearchSchedule = useCallback(() => {
    navigation.navigate('SearchEditGoalSchedule')
  }, [navigation])

  const handleConfirm = useCallback(() => {
    const insertedList = []
    const updatedList = []
    const deletedList = []

    for (let i = 0; selectGoalScheduleList.length; i++) {
      const item = selectGoalScheduleList[i]

      if (!item.goal_schedule_id) {
        insertedList.push(item)
        continue
      }

      const targetItem = form.scheduleList.find(sItem => item.schedule_id === sItem.schedule_id)

      if (targetItem) {
        if (targetItem.focus_time !== item.focus_time || targetItem.complete_count !== item.complete_count) {
          updatedList.push(item)
        }
      } else {
        deletedList.push(item)
      }
    }
    setGoalDetailMutate()
  }, [])

  return (
    <View style={styles.container}>
      <AppBar backPress />

      <ScrollView
        contentContainerStyle={styles.listContainer}
        stickyHeaderIndices={stickyHeaderIndices}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* 목표목 */}
          <TextInput
            value={form.title}
            placeholder="새로운 목표명"
            placeholderTextColor="#c3c5cc"
            style={styles.input}
            onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
          />

          {/* 디데이 */}
          <Panel
            type="container"
            value={expandDDayPanel}
            contentsHeight={390}
            handleExpansion={handleExpandDatePanel}
            headerComponent={
              <View style={styles.panelHeaderContainer}>
                <View style={styles.panelHeaderWrapper}>
                  <PushpineIcon width={24} height={24} />

                  <View style={styles.panelHeaderInfoWrapper}>
                    <Text style={styles.panelHeaderLabelText}>디데이</Text>
                    <Text style={styles.panelHeaderValueText}>{form.end_date || '없음'}</Text>
                  </View>
                </View>

                <Switch value={activeDDay} onChange={changeActiveDDay} />
              </View>
            }
            contentsComponent={
              <View style={styles.panelDateContentsWrapper}>
                <DatePicker
                  value={form.end_date}
                  hasNull
                  disableDate={format(scheduleDate, 'yyyy-MM-dd')}
                  onChange={changeDDay}
                />
              </View>
            }
          />

          <View style={styles.goalBox}>
            <View style={styles.panelHeaderWrapper}>
              <BullseyeIcon width={24} height={24} />

              <View style={styles.panelHeaderInfoWrapper}>
                <Text style={styles.panelHeaderLabelText}>실행 목표</Text>
                <Text>{activityGoalText}</Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <View style={scheduleListStyle.header}>
            <Text style={scheduleListStyle.headerLabel}>포함된 일정 목록</Text>

            <Pressable style={scheduleListStyle.addButton} onPress={moveSearchSchedule}>
              <Text style={scheduleListStyle.addButtonText}>일정 추가하기</Text>
            </Pressable>
          </View>
        </View>

        <View style={scheduleListStyle.listContainer}>
          {selectGoalScheduleList.map((item, index) => {
            return <EditGoalScheduleItem key={index} item={item} index={index} onChange={changeItemValue} />
          })}
        </View>
      </ScrollView>

      <Pressable onPress={handleConfirm}>
        <Text>등록하기</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  listContainer: {
    paddingBottom: 40
  },
  wrapper: {
    paddingHorizontal: 16,
    gap: 20,
    marginBottom: 20
  },
  input: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  goalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    height: 74
  },
  panelHeaderContainer: {
    flex: 1,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  panelHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  panelHeaderInfoWrapper: {
    gap: 5
  },
  panelHeaderLabelText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#7c8698'
  },
  panelHeaderValueText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  },
  panelDateContentsWrapper: {
    paddingTop: 20
  },
  panelFocusTimeDateWrapper: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 10,
    gap: 10
  }
})

const scheduleListStyle = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#f5f6f8',
    borderBottomColor: '#f5f6f8'
  },
  headerLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  addButton: {
    paddingHorizontal: 15,
    backgroundColor: '#1E90FF',
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#ffffff'
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  }
})

export default EditGoal
