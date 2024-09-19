import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import AppBar from '@/components/AppBar'
import PieChart from '@/components/Chart/Pie'
import BarChart from '@/components/Chart/Bar'
import HeatMapChart from '@/components/Chart/HeatMap'
import {Shadow} from 'react-native-shadow-2'
import RightArrowIcon from '@/assets/icons/arrow_right.svg'

import {subDays, format, eachDayOfInterval} from 'date-fns'
import {useQuery} from '@tanstack/react-query'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {scheduleCategoryListState} from '@/store/schedule'
import {windowDimensionsState} from '@/store/system'
import {statsRepository} from '@/repository'
import type {CategoryStatsList, ScheduleActivityLog} from '@/@types/stats'
import {StatsScreenProps} from '@/types/navigation'
import {categoryStatsListState, categoryTotalTimeState} from '@/store/stats'

const Stats = ({navigation}: StatsScreenProps) => {
  const [_categoryTotalTime, _setCategoryTotalTime] = React.useState(-1)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const scheduleCategoryList = useRecoilValue(scheduleCategoryListState)
  const setCategoryStatsList = useSetRecoilState(categoryStatsListState)
  const setCategoryTotalTime = useSetRecoilState(categoryTotalTimeState)

  const pieSize = React.useMemo(() => {
    const totalPaddingHorizontal = 72
    return windowDimensions.width / 2 - totalPaddingHorizontal
  }, [windowDimensions.width])

  const chartHeight = React.useMemo(() => {
    return windowDimensions.width / 2 - (32 + 10 + 20)
  }, [windowDimensions.width])

  // 카테고리별 통계용 데이터 조회
  const {data: categoryStatsList} = useQuery({
    queryKey: ['categoryStatsList'],
    queryFn: async () => {
      const categoryStatsList = await statsRepository.getCategoryStatsList()

      let result: CategoryStatsList[] = []
      let _totalTime = 0

      categoryStatsList.forEach(item => {
        const startTime = item.start_time
        const endTime = item.start_time > item.end_time ? item.end_time + 1440 : item.end_time
        const time = endTime - startTime
        _totalTime += time

        const targetPieStatsIndex = result.findIndex(sItem => item.schedule_category_id === sItem.schedule_category_id)

        if (targetPieStatsIndex === -1) {
          const scheduleCategory = scheduleCategoryList.find(
            sItem => item.schedule_category_id === sItem.schedule_category_id
          )

          result.push({
            schedule_category_id: item.schedule_category_id,
            categoryTitle: scheduleCategory ? scheduleCategory.title : '미지정',
            categoryIcon: scheduleCategory && scheduleCategory.icon ? scheduleCategory.icon : null,
            image: scheduleCategory ? scheduleCategory.image : null,
            totalTime: time,
            color: scheduleCategory ? scheduleCategory.color : '#dfdfdf',
            data: [item]
          })
        } else {
          result[targetPieStatsIndex] = {
            ...result[targetPieStatsIndex],
            totalTime: result[targetPieStatsIndex].totalTime + time,
            data: [...result[targetPieStatsIndex].data, item]
          }
        }
      })

      result = result.sort((a, b) => b.totalTime - a.totalTime)

      _setCategoryTotalTime(_totalTime)
      return result
    },
    initialData: []
  })

  // 집중 시간/일정 완료 통계용 데이터 조회
  const {data: scheduleActivityLogList} = useQuery<ScheduleActivityLog[]>({
    queryKey: ['scheduleActivityLogList'],
    queryFn: async () => {
      const today = new Date()
      const startDate = subDays(today, 48)

      const params = {
        startDate: format(startDate, 'yyyy-MM-dd')
      }

      const response = await statsRepository.getScheduleActivityLogList(params)

      return response.reduce((acc: ScheduleActivityLog[], item) => {
        let existingEntry = acc.find(entry => entry.date === item.date)

        if (existingEntry) {
          existingEntry.totalActiveTime += item.active_time
          existingEntry.totalCompleteCount += item.complete_state
          existingEntry.data.push(item)
        } else {
          acc.push({
            date: item.date,
            totalActiveTime: item.active_time,
            totalCompleteCount: item.complete_state,
            data: [item]
          })
        }

        return acc
      }, [])
    },
    initialData: []
  })

  const allDateScheduleActivityLogList = React.useMemo(() => {
    const today = new Date()
    const startDate = subDays(today, 48)

    const dateList = eachDayOfInterval({start: startDate, end: today})

    return dateList.reverse().map(item => {
      const formatDate = format(item, 'yyyy-MM-dd')

      const existDate = scheduleActivityLogList.find(sItem => {
        return formatDate === sItem.date
      })

      if (existDate) {
        return existDate
      }

      return {
        date: formatDate,
        totalActiveTime: 0,
        totalCompleteCount: 0,
        data: []
      }
    })
  }, [scheduleActivityLogList])

  const activeTimeList = React.useMemo(() => {
    return allDateScheduleActivityLogList.slice(0, 7).reverse()
  }, [allDateScheduleActivityLogList])

  const moveDetail = React.useCallback(
    (type: 'category' | 'focusTime') => () => {
      switch (type) {
        case 'category':
          navigation.navigate('CategoryStats')
          break
        default:
          break
      }
    },
    []
  )

  React.useEffect(() => {
    if (categoryStatsList.length > 0) {
      setCategoryStatsList(categoryStatsList)
    }
  }, [categoryStatsList, setCategoryStatsList])

  React.useEffect(() => {
    if (_categoryTotalTime > -1) {
      setCategoryTotalTime(_categoryTotalTime)
    }
  }, [_categoryTotalTime, setCategoryTotalTime])

  // components
  const pieChartItemListComponent = React.useMemo(() => {
    if (categoryStatsList.length === 0) {
      return <></>
    }

    let data = []

    for (let i = 0; i < categoryStatsList.length; i++) {
      if (i > 2 || i > categoryStatsList.length + 1) {
        break
      }

      const item = categoryStatsList[i]
      const percentage = Math.round((item.totalTime / _categoryTotalTime) * 100)

      data.push({...item, percentage})
    }

    return data.map((item, index) => {
      const hour = Math.floor(item.totalTime / 60)
      const minute = item.totalTime % 60
      const time = `총 ${hour}시간` + ' ' + (minute ? `${minute}분` : '')

      return (
        <View key={index} style={pieChartStyles.itemContainer}>
          <View style={pieChartStyles.itemWrapper}>
            <View style={pieChartStyles.itemTitleWrapper}>
              <View style={[pieChartStyles.itemColor, {backgroundColor: item.color}]} />
              <Text style={pieChartStyles.itemText}>{item.categoryTitle}</Text>
              <Text>{item.data.length}</Text>
            </View>

            <Text style={pieChartStyles.itemPercentageText}>{item.percentage}%</Text>
          </View>

          <Text style={pieChartStyles.itemTimeText}>{time}</Text>
        </View>
      )
    })
  }, [categoryStatsList, _categoryTotalTime])

  return (
    <View style={styles.container}>
      <AppBar title="통계" color="#f5f6f8" />

      <View style={styles.wrapper}>
        {/* 카테고리별 통계 */}
        <Shadow style={styles.card} stretch startColor="#00000010" distance={3} offset={[0, 1]}>
          <Pressable style={styles.cardWrapper} onPress={moveDetail('category')}>
            <View style={styles.labelWrapper}>
              <Text style={styles.label}>카테고리별 통계</Text>
              <RightArrowIcon width={18} height={18} strokeWidth={3} stroke="#424242" />
            </View>

            <View style={pieChartStyles.container}>
              <PieChart size={pieSize} totalTime={_categoryTotalTime} data={categoryStatsList} />

              <View style={pieChartStyles.itemListContainer}>{pieChartItemListComponent}</View>
            </View>
          </Pressable>
        </Shadow>

        <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
          <Shadow
            style={styles.card}
            containerStyle={styles.cardContainer}
            stretch
            startColor="#00000010"
            distance={3}
            offset={[0, 1]}>
            <Pressable style={styles.cardWrapper}>
              <View style={styles.labelWrapper}>
                <Text style={styles.label}>집중 시간</Text>
                <RightArrowIcon width={18} height={18} strokeWidth={3} stroke="#424242" />
              </View>

              <BarChart data={activeTimeList} height={chartHeight - 22} />
            </Pressable>
          </Shadow>

          <Shadow
            style={styles.card}
            containerStyle={styles.cardContainer}
            stretch
            startColor="#00000010"
            distance={3}
            offset={[0, 1]}>
            <Pressable style={styles.cardWrapper}>
              <View style={styles.labelWrapper}>
                <Text style={styles.label}>일정 완료</Text>
                <RightArrowIcon width={18} height={18} strokeWidth={3} stroke="#424242" />
              </View>

              <HeatMapChart data={allDateScheduleActivityLogList} height={chartHeight} />
            </Pressable>
          </Shadow>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: '#424242'
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#ffffff'
  },
  cardContainer: {
    flex: 1
  },
  cardWrapper: {
    padding: 20
  },
  labelWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#424242'
  }
})

const pieChartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  itemListContainer: {
    flex: 1,
    paddingLeft: 40,
    paddingVertical: 5
  },
  itemContainer: {
    paddingBottom: 5
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  itemColor: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  itemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#424242'
  },
  itemPercentageText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#424242'
  },
  itemTimeText: {
    textAlign: 'right',
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: '#9E9E9E'
  }
})

export default Stats
