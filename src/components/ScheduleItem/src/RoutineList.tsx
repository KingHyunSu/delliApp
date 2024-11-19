import {useCallback} from 'react'
import {StyleSheet, FlatList, ListRenderItem, View} from 'react-native'
import RoutineItem from './components/RoutineItem'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleDateState, scheduleListState} from '@/store/schedule'

import {format} from 'date-fns'
import {navigate} from '@/utils/navigation'
import {useSetRoutineComplete, useDeleteRoutineComplete} from '@/apis/hooks/useRoutine'

interface Props {
  data: ScheduleRoutine[]
  activeTheme: ActiveTheme
}

const ScheduleRoutineList = ({data, activeTheme}: Props) => {
  const {mutateAsync: setRoutineCompleteMutateAsync} = useSetRoutineComplete()
  const {mutateAsync: deleteRoutineCompleteMutateAsync} = useDeleteRoutineComplete()

  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const scheduleDate = useRecoilValue(scheduleDateState)

  const moveEdit = useCallback((value: ScheduleRoutine) => {
    navigate('EditRoutine', {scheduleId: value.schedule_id, routineId: value.routine_id})
  }, [])

  const getNewScheduleList = useCallback(
    (newRoutine: ScheduleRoutine) => {
      return scheduleList.map(scheduleItem => {
        if (scheduleItem.schedule_id === newRoutine.schedule_id) {
          const newRoutineList = scheduleItem.routine_list.map(routineItem => {
            if (routineItem.routine_id === newRoutine.routine_id) {
              return newRoutine
            }

            return routineItem
          })

          return {...scheduleItem, routine_list: newRoutineList}
        }

        return scheduleItem
      })
    },
    [scheduleList]
  )

  const handleRoutineComplete = useCallback(
    async (isCompleted: boolean, value: ScheduleRoutine) => {
      let newRoutine = {...value}

      if (isCompleted) {
        const completeDate = format(new Date(scheduleDate), 'yyyy-MM-dd')

        const completeId = await setRoutineCompleteMutateAsync({
          routine_id: value.routine_id,
          complete_date: completeDate
        })

        newRoutine = {
          ...newRoutine,
          complete_id: completeId,
          complete_date: completeDate,
          complete_date_list: [...newRoutine.complete_date_list, completeDate]
        }
      } else {
        if (!value.complete_id) {
          return
        }

        await deleteRoutineCompleteMutateAsync({complete_id: value.complete_id})

        newRoutine = {
          ...newRoutine,
          complete_id: null,
          complete_date: null,
          complete_date_list: newRoutine.complete_date_list.filter(item => item !== value.complete_date)
        }
      }

      const newScheduleList = getNewScheduleList(newRoutine)
      setScheduleList(newScheduleList)
    },
    [scheduleDate, setRoutineCompleteMutateAsync, deleteRoutineCompleteMutateAsync, getNewScheduleList, setScheduleList]
  )

  const keyExtractor = useCallback((item: ScheduleRoutine, index: number) => {
    return String(index)
  }, [])

  const renderItem: ListRenderItem<ScheduleRoutine> = useCallback(
    ({item}) => {
      return <RoutineItem value={item} activeTheme={activeTheme} moveEdit={moveEdit} onChange={handleRoutineComplete} />
    },
    [activeTheme, moveEdit, handleRoutineComplete]
  )

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      style={[styles.container, {backgroundColor: activeTheme.color5}]}
      renderItem={renderItem}
      ItemSeparatorComponent={() => {
        return <View style={{height: 1, backgroundColor: activeTheme.color6}} />
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderRadius: 10
  }
})

export default ScheduleRoutineList
