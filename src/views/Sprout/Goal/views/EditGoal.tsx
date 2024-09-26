import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable, Image, Alert} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {format} from 'date-fns'
import AppBar from '@/components/AppBar'
import Panel from '@/components/Panel'
import Switch from '@/components/Swtich'
import DatePicker from '@/components/DatePicker'
import EditGoalScheduleItem from '@/views/Sprout/Goal/components/EditGoalScheduleItem'
import PushpineIcon from '@/assets/icons/pushpin.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {bottomSafeAreaColorState, alertState} from '@/store/system'
import {selectGoalScheduleListState} from '@/store/goal'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {goalRepository} from '@/repository'
import {DeleteGoalDetailRequest, SetGoalDetailParams} from '@/repository/types/goal'
import {EditGoalScreenProps} from '@/types/navigation'
import {Goal, GoalSchedule} from '@/@types/goal'

const EditGoal = ({navigation, route}: EditGoalScreenProps) => {
  const isFocused = useIsFocused()

  const [expandStartDatePanel, setExpandStartDatePanel] = useState(false)
  const [expandEndDatePanel, setExpandEndDatePanel] = useState(false)
  const [form, setForm] = useState<Goal>({
    goal_id: null,
    title: '',
    start_date: null,
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: []
  })
  const [deletedList, setDeletedList] = useState<GoalSchedule[]>([])
  const alert = useSetRecoilState(alertState)

  const [selectGoalScheduleList, setSelectGoalScheduleList] = useRecoilState(selectGoalScheduleListState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)

  const queryClient = useQueryClient()

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
    mutationFn: (params: SetGoalDetailParams) => {
      if (isUpdate) {
        return goalRepository.updateGoalDetail(params)
      }
      return goalRepository.setGoalDetail(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goalList']})
      navigation.goBack()
    }
  })

  const {mutate: deleteGoalDetailMutate} = useMutation({
    mutationFn: (params: DeleteGoalDetailRequest) => {
      return goalRepository.deleteGoalDetail(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goalList']})
      navigation.goBack()
    }
  })

  useEffect(() => {
    if (goalDetail) {
      setForm(goalDetail)
      setSelectGoalScheduleList(goalDetail.scheduleList)
    }
  }, [goalDetail, setForm, setSelectGoalScheduleList])

  const isUpdate = useMemo(() => {
    return !!form.goal_id
  }, [form.goal_id])

  const activeSubmit = useMemo(() => {
    return !!form.title
  }, [form.title])

  const submitButtonStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButton : styles.submitButton
  }, [activeSubmit])

  const submitButtonTextStyle = useMemo(() => {
    return activeSubmit ? activeSubmitButtonText : styles.submitButtonText
  }, [activeSubmit])

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

    return `총 ${totalCompleteCount}회 / ${timeStr}`
  }, [selectGoalScheduleList])

  const handleExpandStartDatePanel = useCallback(() => {
    setExpandStartDatePanel(!expandStartDatePanel)
    setExpandEndDatePanel(false)
  }, [expandStartDatePanel, setExpandStartDatePanel, setExpandEndDatePanel])

  const handleExpandEndDatePanel = useCallback(() => {
    setExpandStartDatePanel(false)
    setExpandEndDatePanel(!expandEndDatePanel)
  }, [expandEndDatePanel, setExpandStartDatePanel, setExpandEndDatePanel])

  const changeStartDate = useCallback((date: string) => {
    setForm(prevState => ({
      ...prevState,
      start_date: date === '9999-12-31' ? null : date
    }))
  }, [])

  const changeEndDate = useCallback((date: string) => {
    setForm(prevState => ({
      ...prevState,
      end_date: date === '9999-12-31' ? null : date
    }))
  }, [])

  const changeActiveEndDate = useCallback(() => {
    const newActiveEndDate = form.active_end_date === 1 ? 0 : 1

    setForm(prevState => ({
      ...prevState,
      active_end_date: newActiveEndDate
    }))

    if (newActiveEndDate === 1) {
      setExpandEndDatePanel(true)

      if (!form.end_date) {
        changeEndDate(format(new Date(), 'yyyy-MM-dd'))
      }
    }
  }, [form.active_end_date, form.end_date, changeEndDate])

  const changeItemValue = useCallback(
    (value: GoalSchedule, index: number) => {
      const newScheduleList = [...selectGoalScheduleList]
      newScheduleList[index] = value

      setSelectGoalScheduleList(newScheduleList)
    },
    [selectGoalScheduleList, setSelectGoalScheduleList]
  )

  const deleteItem = useCallback(
    (value: GoalSchedule) => {
      const targetItem = form.scheduleList.find(item => item.schedule_id === value.schedule_id)

      if (targetItem) {
        setDeletedList(prevState => [...prevState, targetItem])
      }

      const newSelectGoalScheduleList = selectGoalScheduleList.filter(item => item.schedule_id !== value.schedule_id)
      setSelectGoalScheduleList(newSelectGoalScheduleList)
    },
    [form.scheduleList, selectGoalScheduleList, setSelectGoalScheduleList]
  )

  const moveSearchSchedule = useCallback(() => {
    navigation.navigate('SearchEditGoalSchedule')
  }, [navigation])

  const deleteGoal = useCallback(() => {
    alert({
      type: 'danger',
      title: '목표를 삭제할까요?',
      confirmButtonText: '삭제하기',
      confirmFn: () => {
        if (form.goal_id) {
          deleteGoalDetailMutate({goal_id: form.goal_id})
        }
      }
    })
  }, [form.goal_id, deleteGoalDetailMutate])

  const handleConfirm = useCallback(() => {
    const insertedList: GoalSchedule[] = []
    const updatedList: GoalSchedule[] = []

    for (let i = 0; i < selectGoalScheduleList.length; i++) {
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
      }
    }

    const params: SetGoalDetailParams = {
      goal_id: form.goal_id,
      title: form.title,
      start_date: form.start_date,
      end_date: form.end_date,
      active_end_date: form.active_end_date,
      insertedList,
      updatedList,
      deletedList
    }

    setGoalDetailMutate(params)
  }, [form, selectGoalScheduleList, deletedList, setGoalDetailMutate])

  useEffect(() => {
    if (isFocused) {
      if (activeSubmit) {
        setBottomSafeAreaColor('#1E90FF')
      } else {
        setBottomSafeAreaColor('#f5f6f8')
      }
    }
  }, [isFocused, activeSubmit, setBottomSafeAreaColor])

  return (
    <View style={styles.container}>
      <AppBar backPress>
        {isUpdate && (
          <Pressable style={styles.deleteButton} onPress={deleteGoal}>
            <Text style={styles.deleteButtonText}>삭제하기</Text>
          </Pressable>
        )}
      </AppBar>

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

          {/* 시작일 */}
          <Panel
            type="container"
            value={expandStartDatePanel}
            contentsHeight={390}
            handleExpansion={handleExpandStartDatePanel}
            headerComponent={
              <View style={styles.panelHeaderContainer}>
                <View style={styles.panelHeaderWrapper}>
                  <Image source={require('@/assets/icons/calendar.png')} style={{width: 24, height: 24}} />

                  <View style={styles.panelHeaderInfoWrapper}>
                    <Text style={styles.panelHeaderLabelText}>시작일</Text>
                    <Text style={styles.panelHeaderValueText}>{form.start_date || '없음'}</Text>
                  </View>
                </View>
              </View>
            }
            contentsComponent={
              <View style={styles.panelDateContentsWrapper}>
                <DatePicker
                  value={form.start_date}
                  hasNull
                  disableDate={format(new Date(), 'yyyy-MM-dd')}
                  onChange={changeStartDate}
                />
              </View>
            }
          />

          {/* 디데이 */}
          <Panel
            type="container"
            value={expandEndDatePanel}
            contentsHeight={390}
            handleExpansion={handleExpandEndDatePanel}
            headerComponent={
              <View style={styles.panelHeaderContainer}>
                <View style={styles.panelHeaderWrapper}>
                  <PushpineIcon width={24} height={24} />

                  <View style={styles.panelHeaderInfoWrapper}>
                    <Text style={styles.panelHeaderLabelText}>디데이</Text>
                    <Text style={styles.panelHeaderValueText}>{form.end_date || '없음'}</Text>
                  </View>
                </View>

                <Switch value={!!form.active_end_date} onChange={changeActiveEndDate} />
              </View>
            }
            contentsComponent={
              <View style={styles.panelDateContentsWrapper}>
                <DatePicker
                  value={form.end_date}
                  hasNull
                  disableDate={format(new Date(), 'yyyy-MM-dd')}
                  onChange={changeEndDate}
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
            <View style={scheduleListStyle.headerLabelWrapper}>
              <Text style={scheduleListStyle.headerLabel}>포함된 일정 목록</Text>
              <Text style={scheduleListStyle.headerCountLabel}>{selectGoalScheduleList.length}</Text>
            </View>

            <Pressable style={scheduleListStyle.addButton} onPress={moveSearchSchedule}>
              <Text style={scheduleListStyle.addButtonText}>일정 추가하기</Text>
            </Pressable>
          </View>
        </View>

        <View style={scheduleListStyle.listContainer}>
          {selectGoalScheduleList.map((item, index) => {
            return (
              <EditGoalScheduleItem
                key={index}
                item={item}
                index={index}
                onChange={changeItemValue}
                onDelete={deleteItem}
              />
            )
          })}
        </View>
      </ScrollView>

      <Pressable style={submitButtonStyle} onPress={handleConfirm}>
        <Text style={submitButtonTextStyle}>{form.goal_id ? '수정하기' : '등록하기'}</Text>
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
    paddingBottom: 80
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
  },
  deleteButton: {
    height: 42,
    justifyContent: 'center'
  },
  deleteButtonText: {
    paddingHorizontal: 16,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fe5267' // #ff5050
  },
  submitButton: {
    height: 56,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#babfc5'
  }
})

const activeSubmitButton = StyleSheet.compose(styles.submitButton, {backgroundColor: '#1E90FF'})
const activeSubmitButtonText = StyleSheet.compose(styles.submitButtonText, {color: '#ffffff'})

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
  headerLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  headerLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  headerCountLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#babfc5'
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
