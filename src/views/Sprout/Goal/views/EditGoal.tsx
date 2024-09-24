import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable} from 'react-native'
import {format} from 'date-fns'
import AppBar from '@/components/AppBar'
import Panel from '@/components/Panel'
import Switch from '@/components/Swtich'
import DatePicker from '@/components/DatePicker'
import PushpineIcon from '@/assets/icons/pushpin.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

import {useRecoilValue} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

import {useQuery} from '@tanstack/react-query'
import {goalRepository} from '@/repository'
import {EditGoalScreenProps} from '@/types/navigation'
import {Goal} from '@/@types/goal'
import EditGoalScheduleItem from '@/views/Sprout/Goal/components/EditGoalScheduleItem'
import {GetGoalScheduleListResponse} from '@/repository/types/goal'

const EditGoal = ({navigation, route}: EditGoalScreenProps) => {
  const [expandDDayPanel, setExpandDDayPanel] = useState(false)
  const [activeDDay, setActiveDDay] = useState(false)
  const [form, setForm] = useState<Goal>({
    goal_id: null,
    title: '',
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: [
      {
        complete_count: null,
        end_date: '9999-12-31',
        end_time: 1280,
        focus_time: 212,
        fri: '1',
        mon: '1',
        sat: '1',
        schedule_category_id: 3,
        schedule_id: 16,
        start_date: '2024-09-15',
        start_time: 1100,
        sun: '1',
        thu: '1',
        title: '13',
        tue: '1',
        wed: '1'
      },
      {
        complete_count: null,
        end_date: '9999-12-31',
        end_time: 1110,
        focus_time: null,
        fri: '1',
        mon: '1',
        sat: '1',
        schedule_category_id: null,
        schedule_id: 17,
        start_date: '2024-09-18',
        start_time: 770,
        sun: '1',
        thu: '1',
        title: 'Aaa',
        tue: '1',
        wed: '1'
      }
    ]
  })

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

  useEffect(() => {
    if (goalDetail) {
      setForm(goalDetail)
    }
  }, [goalDetail])

  const stickyHeaderIndices = useMemo(() => [1], [])

  const activityGoalText = useMemo(() => {
    let totalFocusTime = 0
    let totalCompleteCount = 0

    form.scheduleList.forEach(item => {
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
  }, [form.scheduleList])

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
    (value: GetGoalScheduleListResponse, index: number) => {
      const newScheduleList = [...form.scheduleList]
      newScheduleList[index] = value

      setForm(prevState => ({
        ...prevState,
        scheduleList: newScheduleList
      }))
    },
    [form.scheduleList]
  )

  const moveSearchSchedule = useCallback(() => {
    navigation.navigate('SearchEditGoalSchedule')
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
          {form.scheduleList.map((item, index) => {
            return <EditGoalScheduleItem key={index} item={item} index={index} onChange={changeItemValue} />
          })}
        </View>
      </ScrollView>
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
