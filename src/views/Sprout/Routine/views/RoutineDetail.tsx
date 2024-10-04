import {useState, useMemo, useCallback} from 'react'
import {ListRenderItem, StyleSheet, ScrollView, View, Text, Pressable, FlatList} from 'react-native'
import {eachDayOfInterval, startOfMonth, endOfMonth, format, subMonths, addMonths} from 'date-fns'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {todoRepository} from '@/repository'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {RoutineDetailScreenProps} from '@/types/navigation'

const RoutineDetail = ({navigation, route}: RoutineDetailScreenProps) => {
  const queryClient = useQueryClient()

  const [targetDate, setTargetDate] = useState(new Date())
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const {data: detail} = useQuery({
    queryKey: ['routineDetail', route.params.id],
    queryFn: () => {
      return todoRepository.getRoutineDetail({todo_id: route.params.id})
    },
    initialData: null,
    enabled: !!route.params.id
  })

  const {data: completeList} = useQuery({
    queryKey: ['routineCompleteList', route.params.id, targetDate],
    queryFn: () => {
      const firstDayOfMonth = startOfMonth(targetDate)
      const formatDate = format(firstDayOfMonth, 'yyyy-MM-dd')

      const params = {
        todo_id: route.params.id,
        startDate: formatDate
      }

      return todoRepository.getRoutineCompleteList(params)
    },
    initialData: [],
    enabled: !!route.params.id
  })

  const dateItemSize = useMemo(() => {
    const padding = 50
    const gap = 15
    return (windowDimensions.width - padding - gap * 6) / 7
  }, [windowDimensions])

  const currentMonthDateList = useMemo(() => {
    const startDate = startOfMonth(targetDate)
    const endDate = endOfMonth(targetDate)

    return eachDayOfInterval({
      start: startDate,
      end: endDate
    })
  }, [targetDate])

  const moveEdit = useCallback(() => {
    navigation.navigate('EditRoutine', {data: detail})
  }, [detail])

  const handlePrevDate = useCallback(() => {
    const prevMonth = subMonths(targetDate, 1)
    setTargetDate(prevMonth)

    queryClient.invalidateQueries({queryKey: ['routineCompleteList', route.params.id]})
  }, [targetDate, setTargetDate])

  const handleNextDate = useCallback(() => {
    const prevMonth = addMonths(targetDate, 1)
    setTargetDate(prevMonth)

    queryClient.invalidateQueries({queryKey: ['routineCompleteList', route.params.id]})
  }, [targetDate, setTargetDate])

  const getDateItemComponent: ListRenderItem<Date> = useCallback(
    ({item}) => {
      const formatDate = format(item, 'yyyy-MM-dd')
      const isActive = completeList.find(sItem => sItem.complete_date === formatDate)
      const backgroundColor = isActive ? '#76d672' : '#f5f6f8'

      return (
        <View
          style={[
            styles.dateItem,
            {backgroundColor, width: dateItemSize, height: dateItemSize, borderRadius: dateItemSize / 3.3}
          ]}>
          <Text style={[styles.dateItemText, {fontSize: dateItemSize / 2.5}]}>{item.getDate()}</Text>
        </View>
      )
    },
    [dateItemSize, completeList]
  )

  if (!detail) {
    return <></>
  }

  return (
    <View style={styles.container}>
      <AppBar backPress>
        <Pressable style={styles.editButton} onPress={moveEdit}>
          <Text style={styles.editButtonText}>수정하기</Text>
        </Pressable>
      </AppBar>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={topSectionStyle}>
          <Text style={styles.title}>{detail.title}</Text>

          <ScheduleItem
            title={detail.schedule_title!}
            categoryId={detail.schedule_category_id}
            time={{startTime: detail.schedule_start_time!, endTime: detail.schedule_end_time!}}
            date={{startDate: detail.schedule_start_date!, endDate: detail.schedule_end_date!}}
            dayOfWeek={{
              mon: detail.schedule_mon!,
              tue: detail.schedule_tue!,
              wed: detail.schedule_wed!,
              thu: detail.schedule_thu!,
              fri: detail.schedule_fri!,
              sat: detail.schedule_sat!,
              sun: detail.schedule_sun!
            }}
          />
        </View>

        <View style={bottomSectionStyle}>
          <View style={styles.dateTitleWrapper}>
            <Text style={styles.dateTitle}>
              {targetDate.getFullYear()}년 {targetDate.getMonth() + 1}월
            </Text>

            <View style={styles.dateButtonWrapper}>
              <Pressable style={styles.dateButton} onPress={handlePrevDate}>
                <ArrowLeftIcon width={18} height={18} stroke="#424242" strokeWidth={3} />
              </Pressable>

              <Pressable style={styles.dateButton} onPress={handleNextDate}>
                <ArrowRightIcon width={18} height={18} stroke="#424242" strokeWidth={3} />
              </Pressable>
            </View>
          </View>
          <FlatList
            scrollEnabled={false}
            data={currentMonthDateList}
            renderItem={getDateItemComponent}
            contentContainerStyle={{gap: 15}}
            columnWrapperStyle={{gap: 15}}
            numColumns={7}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  editButton: {
    height: 42,
    justifyContent: 'center'
  },
  editButtonText: {
    paddingHorizontal: 16,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#1E90FF'
  },
  listContainer: {
    flex: 1,
    gap: 10
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff'
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B727E'
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  dateTitleWrapper: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  dateTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    color: '#6B727E'
  },
  dateButtonWrapper: {
    flexDirection: 'row',
    gap: 10
  },
  dateButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#eeeded'
  },
  dateItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateItemText: {
    fontFamily: 'Pretendard-Bold',
    color: '#ffffff'
  }
})

const topSectionStyle = StyleSheet.compose(styles.section, {
  gap: 30
})
const bottomSectionStyle = StyleSheet.compose(styles.section, {
  flex: 1,
  gap: 30,
  paddingHorizontal: 25,
  alignItems: 'center'
})

export default RoutineDetail
