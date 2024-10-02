import {useState, useMemo, useCallback, useEffect} from 'react'
import {StyleSheet, ScrollView, View, Text, Pressable} from 'react-native'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'

import {getRepeatTypeString, getRepeatCountString} from '../util'

import {useQuery} from '@tanstack/react-query'
import {routineRepository} from '@/repository'
import {RoutineDetailScreenProps} from '@/types/navigation'

const RoutineDetail = ({navigation, route}: RoutineDetailScreenProps) => {
  const {data: detail} = useQuery({
    queryKey: ['routineDetail', route.params.id],
    queryFn: () => {
      return routineRepository.getRoutineDetail({routine_id: route.params.id})
    },
    initialData: null,
    enabled: !!route.params.id
  })

  if (!detail) {
    return <></>
  }

  return (
    <View style={styles.container}>
      <AppBar backPress />

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.section}>
          <View style={styles.titleWrapper}>
            <Text style={styles.subTitle}>
              {getRepeatTypeString(detail.routine_type)} {getRepeatCountString(detail.routine_count)}{' '}
            </Text>
            <Text style={styles.title}>{detail.title}</Text>
          </View>

          <ScheduleItem
            title={detail.schedule_title}
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

        <View style={styles.section}>
          <View />
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
  listContainer: {
    flex: 1,
    gap: 10
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
    backgroundColor: '#ffffff'
  },
  titleWrapper: {
    flexDirection: 'row'
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  subTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  }
})

export default RoutineDetail
