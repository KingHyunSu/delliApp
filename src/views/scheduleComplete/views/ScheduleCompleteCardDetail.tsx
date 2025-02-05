import {useCallback, useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import AppBar from '../components/AppBar'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
import ScheduleCardListBottomSheet from '@/components/bottomSheet/ScheduleCardListBottomSheet'
import {useAlert} from '@/components/Alert'

import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleListState} from '@/store/schedule'
import {useDeleteScheduleCompleteCard, useGetScheduleCompleteList} from '@/apis/hooks/useScheduleComplete'
import {ScheduleCompleteCardDetailScreenProps} from '@/types/navigation'
import {editScheduleCompleteCacheListState} from '@/store/scheduleComplete'

const ScheduleCompleteCardDetail = ({navigation, route}: ScheduleCompleteCardDetailScreenProps) => {
  const alert = useAlert()

  const [detail, setDetail] = useState<EditScheduleCompleteForm>(route.params)
  const [page, setPage] = useState(1)

  const {mutateAsync: deleteScheduleCompleteCardMutateAsync} = useDeleteScheduleCompleteCard()
  const {data: scheduleCompleteListResponse} = useGetScheduleCompleteList({id: route.params.schedule_id, page})

  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )
  const scheduleList = useRecoilValue(scheduleListState)

  const imageUrl = useMemo(() => {
    if (detail.main_path) {
      const domain = process.env.CDN_URL
      return domain + '/' + detail.main_path
    }
    return null
  }, [detail])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === detail.schedule_id)
  }, [detail, scheduleList])

  const updateCache = useCallback(() => {
    const newEditScheduleCompleteCacheList = editScheduleCompleteCacheList.map(item => {
      if (detail.schedule_complete_id === item.schedule_complete_id) {
        return {
          ...item,
          path: null,
          memo: null
        }
      }
      return item
    })

    setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
  }, [editScheduleCompleteCacheList, detail.schedule_complete_id, setEditScheduleCompleteCacheList])

  const handlePress = useCallback(
    (id: number, completeCount: number) => {
      const scheduleCompleteList = scheduleCompleteListResponse.schedule_complete_list

      const targetItem = scheduleCompleteList.find(item => item.schedule_complete_id === id)

      setDetail(prevState => ({
        ...prevState,
        ...targetItem,
        complete_count: completeCount
      }))
    },
    [scheduleCompleteListResponse.schedule_complete_list]
  )

  const handleEdit = useCallback(() => {
    navigation.navigate('EditScheduleCompleteCard', detail)
  }, [navigation, detail])

  const handleDelete = useCallback(() => {
    alert.show({
      title: '완료 카드 삭제하기',
      message: '완료 카드를 삭제할까요?',
      buttons: [
        {
          text: '취소',
          onPress: () => {
            return
          }
        },
        {
          text: '삭제하기',
          backgroundColor: '#ff416020',
          textColor: '#ff4160',
          onPress: async () => {
            const response = await deleteScheduleCompleteCardMutateAsync({
              schedule_complete_id: detail.schedule_complete_id
            })

            if (response.result) {
              updateCache()
              navigation.goBack()
            }
          }
        }
      ]
    })
  }, [alert, detail.schedule_complete_id, deleteScheduleCompleteCardMutateAsync, updateCache, navigation])

  return (
    <View style={styles.container}>
      <AppBar
        title={targetSchedule?.title || ''}
        completeCount={detail.complete_count}
        detailScreen
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <View style={styles.wrapper}>
        {imageUrl && (
          <View style={styles.cardWrapper}>
            <ScheduleCompleteCard
              type="main"
              imageUrl={imageUrl}
              memo={detail.memo}
              shadowColor="#e0e0e0"
              shadowDistance={15}
              shadowOffset={[7, 7]}
            />
          </View>
        )}
      </View>

      <ScheduleCardListBottomSheet value={scheduleCompleteListResponse} onPress={handlePress} onPaging={() => {}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0'
    // backgroundColor: '#f5f5f5'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90 // bottom sheet min height
  },
  cardWrapper: {
    width: '80%',
    aspectRatio: 0.8
  }
})

export default ScheduleCompleteCardDetail
