import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, TextInput, Pressable, Image} from 'react-native'
import AppBar from '@/components/AppBar'
import Panel from '@/components/Panel'
import Switch from '@/components/Swtich'
import GoalScheduleItem from '@/views/Sprout/Goal/components/GoalScheduleItem'
import PushpineIcon from '@/assets/icons/pushpin.svg'
import BullseyeIcon from '@/assets/icons/bullseye.svg'

import {useSetRecoilState} from 'recoil'
import {selectGoalScheduleListState} from '@/store/goal'

import {useQuery} from '@tanstack/react-query'
import {goalRepository} from '@/repository'
import {getTimeString} from '../util'
import {GoalDetailScreenProps} from '@/types/navigation'
import {Goal} from '@/@types/goal'

const GoalDetail = ({navigation, route}: GoalDetailScreenProps) => {
  const [form, setForm] = useState<Goal>({
    goal_id: null,
    title: '',
    start_date: null,
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: []
  })

  const setSelectGoalScheduleList = useSetRecoilState(selectGoalScheduleListState)

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

    return () => {
      setSelectGoalScheduleList([])
    }
  }, [goalDetail, setForm])

  const activityGoalText = useMemo(() => {
    let totalFocusTime = 0
    let totalCompleteCount = 0

    form.scheduleList.forEach(item => {
      totalFocusTime += item.total_focus_time || 0
      totalCompleteCount += item.total_complete_count || 0
    })

    const timeString = getTimeString(totalFocusTime)

    return `총 ${totalCompleteCount}회 / ${timeString}`
  }, [form.scheduleList])

  const moveEdit = useCallback(() => {
    navigation.navigate('EditGoal', {data: goalDetail})
  }, [navigation, goalDetail])

  return (
    <View style={styles.container}>
      <AppBar backPress>
        <Pressable style={styles.deleteButton} onPress={moveEdit}>
          <Text style={styles.deleteButtonText}>수정하기</Text>
        </Pressable>
      </AppBar>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* 목표목 */}
          <TextInput
            value={form.title}
            placeholder="새로운 목표명"
            placeholderTextColor="#c3c5cc"
            readOnly
            style={styles.input}
            onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
          />

          {/* 시작일 */}
          <Panel
            expandable={false}
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
          />

          {/* 디데이 */}
          <Panel
            expandable={false}
            headerComponent={
              <View style={styles.panelHeaderContainer}>
                <View style={styles.panelHeaderWrapper}>
                  <PushpineIcon width={24} height={24} />

                  <View style={styles.panelHeaderInfoWrapper}>
                    <Text style={styles.panelHeaderLabelText}>디데이</Text>
                    <Text style={styles.panelHeaderValueText}>{form.end_date || '없음'}</Text>
                  </View>
                </View>

                <Switch value={!!form.active_end_date} readonly />
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
              <Text style={scheduleListStyle.headerCountLabel}>{form.scheduleList.length}</Text>
            </View>
          </View>
        </View>

        <View style={scheduleListStyle.listContainer}>
          {form.scheduleList.map((item, index) => {
            return <GoalScheduleItem key={index} item={item} />
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
    paddingBottom: 20
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
    color: '#1E90FF'
  }
})

const scheduleListStyle = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    height: 64,
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
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  }
})

export default GoalDetail
