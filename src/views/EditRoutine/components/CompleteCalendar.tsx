import {useCallback, useEffect, useMemo, useState} from 'react'
import {StyleSheet, View, Text, FlatList, Pressable, ListRenderItem} from 'react-native'
import {format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth} from 'date-fns'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import CheckIcon from '@/assets/icons/check.svg'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetRoutineCompleteList} from '@/apis/hooks/useRoutine'

interface Props {
  value: Date
  id: number | null
  openYearMonthPickerModal: () => void
}
const CompleteCalendar = ({value, id, openYearMonthPickerModal}: Props) => {
  const {mutateAsync: getRoutineCompleteListMutateAsync} = useGetRoutineCompleteList()

  const [completeDateList, setCompleteDateList] = useState<RoutineComplete[]>([])

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const contentPadding = useMemo(() => {
    return ((windowDimensions.width - 32) / 7) * 0.27
  }, [windowDimensions.width])

  const dateList = useMemo(() => {
    const monthStart = startOfMonth(value)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const result = []
    let day = startDate

    while (day <= endDate) {
      if (isSameMonth(day, monthStart)) {
        result.push(day)
      } else {
        result.push(null)
      }
      day = addDays(day, 1)
    }

    return result
  }, [value])

  useEffect(() => {
    const init = async () => {
      const firstDayOfMonth = startOfMonth(value)
      const lastDayOfMonth = endOfMonth(value)
      const startDate = format(firstDayOfMonth, 'yyyy-MM-dd')
      const endDate = format(lastDayOfMonth, 'yyyy-MM-dd')

      if (id) {
        const routineCompleteList = await getRoutineCompleteListMutateAsync({
          routine_id: id,
          start_date: startDate,
          end_date: endDate
        })

        setCompleteDateList(routineCompleteList)
      }
    }

    init()
  }, [id, value, setCompleteDateList, getRoutineCompleteListMutateAsync])

  const getRenderItem: ListRenderItem<Date | null> = useCallback(
    ({item, index}) => {
      let isComplete = false

      if (item) {
        const formatDate = format(item, 'yyyy-MM-dd')
        isComplete = completeDateList.some(sItem => sItem.complete_date === formatDate)
      }

      return (
        <View style={[styles.dayContainer, index % 6 === 0 && {borderRightWidth: 1}]}>
          {item && (
            <>
              <Text style={styles.dayText}>{format(item, 'd')}</Text>
              <View style={[styles.dayContent, {padding: contentPadding}]}>
                {isComplete && <CheckIcon width="100%" height="100%" stroke="#FFD54F" strokeWidth={3} />}
              </View>
            </>
          )}
        </View>
      )
    },
    [completeDateList, contentPadding]
  )

  return (
    <View style={styles.container}>
      <Pressable style={styles.navButton} onPress={openYearMonthPickerModal}>
        <Text style={styles.monthText}>{format(value, 'yyyy년 MM월')}</Text>

        <ArrowDownIcon stroke={'#000'} />
      </Pressable>

      {/* weekday */}
      <View style={styles.weekdays}>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <Text key={day} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* days */}
      <FlatList
        data={dateList}
        numColumns={7}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={getRenderItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    height: 48,
    paddingRight: 15,
    marginBottom: 5
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold'
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weekdayText: {
    flex: 1,
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#f5f6f8'
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5f6f8'
  },
  dayText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#000',
    paddingTop: 10
  },
  dayContent: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CompleteCalendar
