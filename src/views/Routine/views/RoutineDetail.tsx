import {useState, useMemo, useCallback, useEffect} from 'react'
import {ListRenderItem, StyleSheet, ScrollView, View, Text, Pressable, FlatList} from 'react-native'
import {eachDayOfInterval, startOfMonth, endOfMonth, format, subMonths, addMonths} from 'date-fns'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'

import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {todoRepository} from '@/apis/local'
import {useGetRoutineCompleteList} from '@/apis/hooks/useRoutine'
import {useQuery} from '@tanstack/react-query'
import {RoutineDetailScreenProps} from '@/types/navigation'

const completeItemGap = 10
const RoutineDetail = ({navigation, route}: RoutineDetailScreenProps) => {
  const {mutateAsync: getRoutineCompleteList} = useGetRoutineCompleteList()

  const [targetDate, setTargetDate] = useState(new Date())
  const [completeList, setCompleteList] = useState<TodoComplete[]>([])

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const {data: detail} = useQuery({
    queryKey: ['routineDetail', route.params.id],
    queryFn: () => {
      return todoRepository.getRoutineDetail({todo_id: route.params.id})
    },
    initialData: null,
    enabled: !!route.params.id
  })

  const dateItemSize = useMemo(() => {
    const padding = 50
    return (windowDimensions.width - padding - completeItemGap * 6) / 7
  }, [windowDimensions])

  const currentMonthDateList = useMemo(() => {
    const startDate = startOfMonth(targetDate)
    const endDate = endOfMonth(targetDate)

    return eachDayOfInterval({
      start: startDate,
      end: endDate
    })
  }, [targetDate])

  const completeCountText = useMemo(() => {
    console.log('completeList', completeList)
    return completeList.length === currentMonthDateList.length ? '전체' : `${completeList.length}번`
  }, [completeList.length, currentMonthDateList.length])

  const moveEdit = useCallback(() => {
    navigation.navigate('EditRoutine', {data: detail})
  }, [navigation, detail])

  const handlePrevDate = useCallback(() => {
    const prevMonth = subMonths(targetDate, 1)
    setTargetDate(prevMonth)
  }, [targetDate, setTargetDate])

  const handleNextDate = useCallback(() => {
    const prevMonth = addMonths(targetDate, 1)
    setTargetDate(prevMonth)
  }, [targetDate, setTargetDate])

  useEffect(() => {
    const init = async () => {
      const firstDayOfMonth = startOfMonth(targetDate)
      const formatDate = format(firstDayOfMonth, 'yyyy-MM-dd')

      const params = {
        todo_id: route.params.id,
        start_date: formatDate
      }

      const routineCompleteList = await getRoutineCompleteList(params)
      setCompleteList(routineCompleteList)
    }

    init()
  }, [route.params.id, targetDate, getRoutineCompleteList])

  const getDateItemComponent: ListRenderItem<Date> = useCallback(
    ({item}) => {
      const formatDate = format(item, 'yyyy-MM-dd')
      const isActive = completeList.find(sItem => sItem.complete_date === formatDate)
      const backgroundColor = isActive ? '#FFD54F' : '#f5f6f8'
      const color = isActive ? '#ffffff' : '#c8cdd4'

      return (
        <View
          style={[
            styles.dateItem,
            {backgroundColor, width: dateItemSize, height: dateItemSize, borderRadius: dateItemSize / 3.3}
          ]}>
          <Text style={[styles.dateItemText, {color}]}>{item.getDate()}</Text>
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

      <ScrollView
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}>
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

        <View style={styles.separator} />

        <View style={bottomSectionStyle}>
          <View style={styles.dateHeaderWrapper}>
            <View style={styles.dateTitleWrapper}>
              <Text style={styles.dateTitle}>
                {targetDate.getFullYear()}년 {targetDate.getMonth() + 1}월
              </Text>

              <Text style={styles.dateSubTitle}>{completeCountText} 완료</Text>
            </View>

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
            contentContainerStyle={{gap: completeItemGap}}
            columnWrapperStyle={{gap: completeItemGap}}
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
    backgroundColor: '#ffffff'
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
  listContentContainer: {
    paddingBottom: 40
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff'
  },
  separator: {
    height: 10,
    backgroundColor: '#f5f6f8'
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
  dateHeaderWrapper: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  dateTitleWrapper: {
    gap: 3
  },
  dateTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    color: '#424242'
  },
  dateSubTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#6B727E'
  },
  dateButtonWrapper: {
    flexDirection: 'row',
    gap: 10
  },
  dateButton: {
    width: 34,
    height: 34,
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
    fontSize: 14
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
