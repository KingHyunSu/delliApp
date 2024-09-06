import React from 'react'
import {Keyboard, StyleSheet, Alert, ScrollView, View, Text, Pressable, Image} from 'react-native'
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import {Shadow} from 'react-native-shadow-2'
import TrashIcon from '@/assets/icons/trash.svg'
import InfoIcon from '@/assets/icons/info.svg'

import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import BottomSheetHandler from '@/components/BottomSheetHandler'
import {useRecoilState, useRecoilValue} from 'recoil'
import {showScheduleCategoryBottomSheetState} from '@/store/bottomSheet'
import {safeAreaInsetsState} from '@/store/system'
import {useQuery, useMutation} from '@tanstack/react-query'
import {scheduleCategoryRepository} from '@/repository'
import {scheduleState} from '@/store/schedule'
import {SetScheduleCategory, UpdateScheduleCategory} from '@/repository/types/scheduleCategory'

interface Props {
  invalidScheduleList: Function
}

const shadowOffset: [number, number] = [0, -1]
const ScheduleCategoryBottomSheet = ({invalidScheduleList}: Props) => {
  const scheduleCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)

  const [pressBehavior, setPressBehavior] = React.useState<'close' | 0>('close')
  const [selectedOriginCategory, setSelectedOriginCategory] = React.useState<ScheduleCategory | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<ScheduleCategory>({
    schedule_category_id: null,
    title: ''
  })

  const [showScheduleCategoryBottomSheet, setShowScheduleCategoryBottomSheet] = useRecoilState(
    showScheduleCategoryBottomSheetState
  )
  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const {data: scheduleCategoryList, refetch} = useQuery({
    queryKey: ['scheduleCategoryList'],
    queryFn: async () => {
      const list = await scheduleCategoryRepository.getScheduleCategoryList()
      const [{seq}] = await scheduleCategoryRepository.getLastScheduleCategorySeq()

      // default data insert
      if (seq === 0) {
        await scheduleCategoryRepository.setDefaultScheduleCategory()
        return await scheduleCategoryRepository.getScheduleCategoryList()
      }

      return list
    },
    initialData: []
  })

  const deleteScheduleCategoryMutation = useMutation({
    mutationFn: async (value: number) => {
      const params = {schedule_category_id: value}

      return await scheduleCategoryRepository.deleteScheduleCategory(params)
    },
    onSuccess: async (data, value) => {
      if (schedule.schedule_category_id === value) {
        const newScheduleCategory = {
          schedule_category_id: null,
          schedule_category_title: ''
        }

        setSchedule(prevState => ({...prevState, ...newScheduleCategory}))
      }

      invalidScheduleList()
      await refetch()
      clear()
    }
  })

  const setScheduleCategoryMutation = useMutation({
    mutationFn: async (params: SetScheduleCategory) => {
      return await scheduleCategoryRepository.setScheduleCategory(params)
    }
  })

  const updateScheduleCategoryMutation = useMutation({
    mutationFn: async (params: UpdateScheduleCategory) => {
      return await scheduleCategoryRepository.updateScheduleCategory(params)
    }
  })

  const snapPoints = React.useMemo(() => ['50%'], [])

  const selectedCategoryIndex = React.useMemo(() => {
    if (!scheduleCategoryList || scheduleCategoryList.length === 0) {
      return -1
    }

    return scheduleCategoryList.findIndex(item => item.schedule_category_id === selectedCategory.schedule_category_id)
  }, [scheduleCategoryList, selectedCategory.schedule_category_id])

  const isUpdatedScheduleCategory = React.useMemo(() => {
    return selectedOriginCategory && selectedOriginCategory.title !== selectedCategory.title
  }, [selectedOriginCategory, selectedCategory.title])

  const confirmButtonWrapperStyle = React.useMemo(() => {
    const bottom = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20

    return [styles.confirmButtonWrapper, {bottom}]
  }, [safeAreaInsets.bottom])

  const categoryItemStyle = React.useCallback(
    (index: number) => {
      return index === selectedCategoryIndex ? activeItem : styles.item
    },
    [selectedCategoryIndex]
  )

  const categoryItemTextStyle = React.useCallback(
    (index: number) => {
      return index === selectedCategoryIndex ? activeItemText : styles.itemText
    },
    [selectedCategoryIndex]
  )

  const handleDismiss = React.useCallback(() => {
    setShowScheduleCategoryBottomSheet(false)
  }, [setShowScheduleCategoryBottomSheet])

  const clickBackdrop = React.useCallback(() => {
    if (pressBehavior === 0) {
      Keyboard.dismiss()
    }
  }, [pressBehavior])

  const clear = React.useCallback(() => {
    setSelectedOriginCategory(null)
    setSelectedCategory({schedule_category_id: null, title: ''})
  }, [])

  const selectScheduleCategory = React.useCallback(
    (item: ScheduleCategory) => () => {
      if (selectedCategory.schedule_category_id === item.schedule_category_id) {
        clear()

        return
      }

      setSelectedOriginCategory(item)
      setSelectedCategory(item)
    },
    [selectedCategory, clear]
  )

  const changeCategoryTitle = React.useCallback((value: string) => {
    setSelectedCategory(prevState => ({...prevState, title: value}))
  }, [])

  const deleteCategory = React.useCallback(() => {
    Alert.alert('카테고리 삭제하기', `"${selectedCategory.title}" 카테고리를 삭제하시겠습니까?`, [
      {
        text: '취소',
        onPress: () => {
          return
        },
        style: 'cancel'
      },
      {
        text: '삭제',
        onPress: () => {
          if (selectedCategory.schedule_category_id) {
            deleteScheduleCategoryMutation.mutate(selectedCategory.schedule_category_id)
          }
        },
        style: 'destructive'
      }
    ])
  }, [selectedCategory.title, selectedCategory.schedule_category_id, deleteScheduleCategoryMutation])

  const handleConfirm = React.useCallback(async () => {
    let schedule_category_id = selectedCategory.schedule_category_id

    if (schedule_category_id && !selectedCategory.title) {
      deleteScheduleCategoryMutation.mutate(schedule_category_id)
      handleDismiss()
      return
    }

    if (!schedule_category_id && selectedCategory.title) {
      // insert
      schedule_category_id = await setScheduleCategoryMutation.mutateAsync({title: selectedCategory.title})
    } else if (schedule_category_id && isUpdatedScheduleCategory) {
      // update
      await updateScheduleCategoryMutation.mutateAsync(selectedCategory as UpdateScheduleCategory)
    }

    const newScheduleCategory = {
      schedule_category_id,
      schedule_category_title: selectedCategory.title
    }
    setSchedule(prevState => ({...prevState, ...newScheduleCategory}))
    refetch()
    handleDismiss()
  }, [
    selectedCategory,
    isUpdatedScheduleCategory,
    setScheduleCategoryMutation,
    deleteScheduleCategoryMutation,
    updateScheduleCategoryMutation,
    setSchedule,
    refetch,
    handleDismiss
  ])

  React.useEffect(() => {
    if (showScheduleCategoryBottomSheet) {
      if (schedule.schedule_category_id) {
        const category = {
          schedule_category_id: schedule.schedule_category_id,
          title: schedule.schedule_category_title || ''
        }

        setSelectedCategory(category)
        setSelectedOriginCategory(category)
      }
      scheduleCategoryBottomSheetRef.current?.present()
    } else {
      clear()
      scheduleCategoryBottomSheetRef.current?.dismiss()
    }
  }, [schedule.schedule_category_id, schedule.schedule_category_title, showScheduleCategoryBottomSheet, clear])

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setPressBehavior(0)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setPressBehavior('close')
    })

    // Clean up the event listeners on component unmount
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // components
  const bottomSheetBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => {
      return <BottomSheetBackdrop props={props} pressBehavior={pressBehavior} onPress={clickBackdrop} />
    },
    [pressBehavior, clickBackdrop]
  )

  const bottomSheetHandler = React.useCallback((props: BottomSheetHandleProps) => {
    return (
      <BottomSheetHandler
        shadow={false}
        maxSnapIndex={1}
        animatedIndex={props.animatedIndex}
        animatedPosition={props.animatedPosition}
      />
    )
  }, [])

  const scheduleCategories = React.useMemo(() => {
    return scheduleCategoryList.map((item, index) => (
      <Pressable key={index} style={categoryItemStyle(index)} onPress={selectScheduleCategory(item)}>
        <Text style={categoryItemTextStyle(index)}>{item.title}</Text>
      </Pressable>
    ))
  }, [scheduleCategoryList, categoryItemStyle, categoryItemTextStyle, selectScheduleCategory])

  const infoBox = React.useMemo(() => {
    if (isUpdatedScheduleCategory && selectedOriginCategory) {
      return (
        <View style={styles.infoWrapper}>
          <InfoIcon width={18} height={18} fill="#FD4672" />
          <Text style={styles.infoText}>"{selectedOriginCategory.title}" 카테고리가 수정되었어요</Text>
        </View>
      )
    }

    return <></>
  }, [isUpdatedScheduleCategory, selectedOriginCategory])

  return (
    <BottomSheetModal
      name="scheduleCategoryBottomSheet"
      ref={scheduleCategoryBottomSheetRef}
      backdropComponent={bottomSheetBackdrop}
      handleComponent={bottomSheetHandler}
      index={0}
      snapPoints={snapPoints}
      keyboardBlurBehavior="restore"
      onDismiss={handleDismiss}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Image source={require('@/assets/icons/folder.png')} style={styles.icon} />

          <BottomSheetTextInput
            value={selectedCategory.title}
            style={styles.input}
            placeholder="새로운 일정 카테고리"
            placeholderTextColor="#c3c5cc"
            onChangeText={changeCategoryTitle}
          />

          {selectedCategory.schedule_category_id && (
            <Pressable style={styles.deleteButton} onPress={deleteCategory}>
              <TrashIcon fill="#999" />
            </Pressable>
          )}
        </View>

        {infoBox}

        <ScrollView style={styles.categoryListContainer}>
          <View style={styles.categoryListWrapper}>{scheduleCategories}</View>
        </ScrollView>

        <Shadow
          startColor="#ffffff"
          distance={20}
          offset={shadowOffset}
          containerStyle={confirmButtonWrapperStyle}
          stretch>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>선택하기</Text>
          </Pressable>
        </Shadow>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1
  },
  icon: {
    width: 24,
    height: 24
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eeeded'
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#424242'
  },
  deleteButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#FD4672'
  },
  categoryListContainer: {
    marginTop: 20
  },
  categoryListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 68
  },

  item: {
    height: 38,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 30
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#777777'
  },

  confirmButtonWrapper: {
    position: 'absolute',
    left: 16,
    right: 16
  },
  confirmButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 10
  },
  confirmButtonText: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#ffffff'
  }
})

const activeItem = StyleSheet.compose(styles.item, {borderColor: '#424242'})
const activeItemText = StyleSheet.compose(styles.itemText, {color: '#424242', fontFamily: 'Pretendard-Bold'})

export default ScheduleCategoryBottomSheet
