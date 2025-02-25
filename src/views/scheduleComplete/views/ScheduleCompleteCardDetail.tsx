import {useCallback, useMemo, useState} from 'react'
import {StyleSheet, Pressable, View} from 'react-native'
import AppBar from '../components/AppBar'
import ScheduleCompleteCard from '@/components/ScheduleCompleteCard'
import ScheduleCardListBottomSheet from '@/components/bottomSheet/ScheduleCardListBottomSheet'
import ScheduleCompleteRecordModal from '@/components/modal/ScheduleCompleteRecordModal'
import {useAlert} from '@/components/Alert'

import {getImageUrl} from '@/utils/helper'
import {useRecoilState, useRecoilValue} from 'recoil'
import {scheduleListState} from '@/store/schedule'
import {editScheduleCompleteCacheListState} from '@/store/scheduleComplete'
import {displayModeState, windowDimensionsState} from '@/store/system'
import {
  useGetScheduleCompleteCardList,
  useDeleteScheduleCompleteCard,
  useUpdateScheduleCompleteRecordCard
} from '@/apis/hooks/useScheduleComplete'
import {ScheduleCompleteCardDetailScreenProps} from '@/types/navigation'
import {GetScheduleCompleteCardListResponse} from '@/apis/types/scheduleComplete'

const ScheduleCompleteCardDetail = ({navigation, route}: ScheduleCompleteCardDetailScreenProps) => {
  const alert = useAlert()

  const [isLoading, setIsLoading] = useState(false)
  const [isShowScheduleCompleteRecordModal, setIsShowScheduleCompleteRecordModal] = useState(false)
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<EditScheduleCompleteForm>(route.params)
  const [list, setList] = useState<GetScheduleCompleteCardListResponse[]>([])

  const {mutateAsync: getScheduleCompleteCardListMutateAsync} = useGetScheduleCompleteCardList()
  const {mutateAsync: updateScheduleCompleteRecordCardMutateAsync} = useUpdateScheduleCompleteRecordCard()
  const {mutateAsync: deleteScheduleCompleteCardMutateAsync} = useDeleteScheduleCompleteCard()

  const [editScheduleCompleteCacheList, setEditScheduleCompleteCacheList] = useRecoilState(
    editScheduleCompleteCacheListState
  )
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const displayMode = useRecoilValue(displayModeState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const containerStyle = useMemo(() => {
    const backgroundColor = displayMode === 1 ? '#e0e0e0' : '#494949'
    return [styles.container, {backgroundColor}]
  }, [displayMode])

  const imageUrl = useMemo(() => {
    if (detail.photo_card_path) {
      return getImageUrl({path: detail.photo_card_path, width: windowDimensions.width * 0.8})
    }
    return null
  }, [detail, windowDimensions.width])

  const targetSchedule = useMemo(() => {
    return scheduleList.find(item => item.schedule_id === detail.schedule_id)
  }, [detail, scheduleList])

  const handlePress = useCallback((value: GetScheduleCompleteCardListResponse, count: number) => {
    setDetail(prevState => ({
      ...prevState,
      ...value,
      complete_count: count
    }))
  }, [])

  const updateRecord = useCallback(
    async (value: string) => {
      const response = await updateScheduleCompleteRecordCardMutateAsync({
        schedule_complete_id: detail.schedule_complete_id,
        record: value
      })

      if (response.result) {
        // update schedule complete cached list
        const newEditScheduleCompleteCacheList = editScheduleCompleteCacheList.map(item => {
          if (item.schedule_complete_id === detail.schedule_complete_id) {
            return {...item, record: value}
          }
          return item
        })
        setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
        // update detail
        setDetail(prevState => ({
          ...prevState,
          record: value
        }))
        // update schedule complete card list
        const newScheduleCompleteCardList = list.map(item => {
          if (item.schedule_complete_id === detail.schedule_complete_id) {
            return {...item, record: value}
          }
          return item
        })
        setList(newScheduleCompleteCardList)
        // update schedule list
        const newScheduleList = scheduleList.map(item => {
          if (item.schedule_complete_id === detail.schedule_complete_id) {
            return {...item, schedule_complete_record: value}
          }
          return item
        })
        setScheduleList(newScheduleList)
      }
    },
    [
      detail,
      updateScheduleCompleteRecordCardMutateAsync,
      editScheduleCompleteCacheList,
      list,
      scheduleList,
      setEditScheduleCompleteCacheList,
      setScheduleList
    ]
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
              // update schedule complete cached list
              const newEditScheduleCompleteCacheList = editScheduleCompleteCacheList.map(item => {
                if (item.schedule_complete_id === detail.schedule_complete_id) {
                  return {...item, record: null, photo_card_path: null}
                }
                return item
              })
              setEditScheduleCompleteCacheList(newEditScheduleCompleteCacheList)
              // update detail
              setDetail(prevState => ({
                ...prevState,
                total: prevState.total - 1
              }))
              // update schedule complete card list
              const newScheduleCompleteCardList = list.filter(item => {
                return item.schedule_complete_id !== detail.schedule_complete_id
              })
              setList(newScheduleCompleteCardList)
              // update schedule list
              const newScheduleList = scheduleList.map(item => {
                if (item.schedule_complete_id === detail.schedule_complete_id) {
                  return {
                    ...item,
                    schedule_complete_record: undefined,
                    schedule_complete_card_x: undefined,
                    schedule_complete_card_y: undefined,
                    schedule_complete_card_path: undefined
                  }
                }
                return item
              })
              setScheduleList(newScheduleList)

              navigation.goBack()
            }
          }
        }
      ]
    })
  }, [
    alert,
    detail,
    deleteScheduleCompleteCardMutateAsync,
    editScheduleCompleteCacheList,
    list,
    scheduleList,
    setEditScheduleCompleteCacheList,
    setScheduleList,
    navigation
  ])

  const getScheduleCompleteCardList = useCallback(async () => {
    if (list.length === route.params.total || isLoading) {
      return
    }

    setIsLoading(true)

    const response = await getScheduleCompleteCardListMutateAsync({
      id: route.params.schedule_id,
      page
    })

    setList(prevState => [...prevState, ...response])
    setPage(page + 1)
    setIsLoading(false)
  }, [isLoading, list, route.params.total, route.params.schedule_id, page, getScheduleCompleteCardListMutateAsync])

  return (
    <View style={containerStyle}>
      <AppBar
        type="detail"
        title={targetSchedule?.title || ''}
        completeCount={detail.complete_count}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <View style={styles.wrapper}>
        {(imageUrl || detail.record) && (
          <Pressable style={styles.cardWrapper} onPress={() => setIsShowScheduleCompleteRecordModal(true)}>
            <ScheduleCompleteCard
              size="large"
              imageUrl={imageUrl}
              record={detail.record}
              shadowColor="#e0e0e0"
              shadowDistance={15}
              shadowOffset={[7, 7]}
            />
          </Pressable>
        )}
      </View>

      <ScheduleCardListBottomSheet
        value={list}
        total={route.params.total}
        onPress={handlePress}
        onPaging={getScheduleCompleteCardList}
      />

      <ScheduleCompleteRecordModal
        visible={isShowScheduleCompleteRecordModal}
        value={detail.record || ''}
        onChange={updateRecord}
        onClose={() => setIsShowScheduleCompleteRecordModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
