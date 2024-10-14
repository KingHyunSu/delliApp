import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable, Image, Alert} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {format} from 'date-fns'
import AppBar from '@/components/AppBar'
import Panel from '@/components/Panel'
import Switch from '@/components/Swtich'
import DatePicker from '@/components/DatePicker'
import EditGoalScheduleItem from '../components/EditGoalScheduleItem'
import TotalActivityLabels from '../components/TotalActivityLabels'
import PushPineIcon from '@/assets/icons/pushpin.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {bottomSafeAreaColorState, alertState} from '@/store/system'
import {searchScheduleResultListState} from '@/store/schedule'

import {useMutation, useQueryClient} from '@tanstack/react-query'
import {goalRepository} from '@/apis/local'
import {DeleteGoalDetailRequest, SetGoalDetailParams} from '@/apis/local/types/goal'
import {EditGoalScreenProps} from '@/types/navigation'
import {Goal, GoalSchedule} from '@/@types/goal'
import type {SearchSchedule} from '@/views/SearchSchedule'

const EditGoal = ({navigation, route}: EditGoalScreenProps) => {
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()

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
  const [selectGoalScheduleList, setSelectGoalScheduleList] = useState<GoalSchedule[]>([])
  const [deletedList, setDeletedList] = useState<GoalSchedule[]>([])

  const [searchScheduleResultList, setSearchScheduleResultList] = useRecoilState(searchScheduleResultListState)
  const setBottomSafeAreaColor = useSetRecoilState(bottomSafeAreaColorState)
  const alert = useSetRecoilState(alertState)

  const {mutate: setGoalDetailMutate} = useMutation({
    mutationFn: (params: SetGoalDetailParams) => {
      if (isUpdate) {
        return goalRepository.updateGoalDetail(params)
      }
      return goalRepository.setGoalDetail(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goalList']})
      navigation.navigate('MainTabs', {screen: 'Sprout'})
    }
  })

  const {mutate: deleteGoalDetailMutate} = useMutation({
    mutationFn: (params: DeleteGoalDetailRequest) => {
      return goalRepository.deleteGoalDetail(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['goalList']})
      navigation.navigate('MainTabs', {screen: 'Sprout'})
    }
  })

  useEffect(() => {
    const {data} = route.params

    if (data) {
      setForm(data)

      const _searchScheduleResultList: SearchSchedule[] = data.scheduleList.map(item => {
        return {
          schedule_id: item.schedule_id!,
          schedule_category_id: item.schedule_category_id || null,
          title: item.title,
          start_time: item.start_time,
          end_time: item.end_time,
          mon: item.mon,
          tue: item.tue,
          wed: item.wed,
          thu: item.thu,
          fri: item.fri,
          sat: item.sat,
          sun: item.sun,
          start_date: item.start_date,
          end_date: item.end_date
        }
      })

      setSearchScheduleResultList(_searchScheduleResultList)
    }
  }, [route.params, setForm, setSearchScheduleResultList])

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

  const totalActivityValues = useMemo(() => {
    let totalCompleteCount = 0
    let totalFocusTime = 0

    if (selectGoalScheduleList.length > 0) {
      selectGoalScheduleList.forEach(item => {
        totalCompleteCount += item.total_complete_count || 0
        totalFocusTime += item.total_focus_time || 0
      })
    }

    return {
      totalCompleteCount,
      totalFocusTime
    }
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

      const newSearchScheduleResultList = searchScheduleResultList.filter(
        item => item.schedule_id !== value.schedule_id
      )
      setSearchScheduleResultList(newSearchScheduleResultList)
    },
    [form.scheduleList, searchScheduleResultList, setSearchScheduleResultList]
  )

  const moveSearchSchedule = useCallback(() => {
    navigation.navigate('SearchSchedule', {options: {multiple: true}})
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
  }, [alert, form.goal_id, deleteGoalDetailMutate])

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
        if (
          targetItem.total_focus_time !== item.total_focus_time ||
          targetItem.total_complete_count !== item.total_complete_count
        ) {
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
    if (searchScheduleResultList.length > 0) {
      const newSelectGoalScheduleList: GoalSchedule[] = searchScheduleResultList.map(item => {
        const savedGaolSchedule = form.scheduleList.find(sItem => sItem.schedule_id === item.schedule_id)

        return {
          ...item,
          goal_schedule_id: savedGaolSchedule ? savedGaolSchedule.goal_schedule_id : null,
          total_focus_time: savedGaolSchedule ? savedGaolSchedule.total_focus_time : null,
          total_complete_count: savedGaolSchedule ? savedGaolSchedule.total_complete_count : null,
          activity_focus_time: savedGaolSchedule ? savedGaolSchedule.activity_focus_time : null,
          activity_complete_count: savedGaolSchedule ? savedGaolSchedule.activity_complete_count : null
        }
      })

      setSelectGoalScheduleList(newSelectGoalScheduleList)
    }
  }, [form.scheduleList, searchScheduleResultList, setSelectGoalScheduleList])

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
          {/* 목표명 */}
          <TextInput
            value={form.title}
            placeholder="새로운 목표"
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
                  <PushPineIcon width={24} height={24} />

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
                <TotalActivityLabels
                  totalCompleteCount={totalActivityValues.totalCompleteCount}
                  totalFocusTime={totalActivityValues.totalFocusTime}
                />
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
    color: '#ff4160'
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
