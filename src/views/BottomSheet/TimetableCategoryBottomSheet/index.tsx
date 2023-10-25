import React from 'react'
import {StyleSheet, View, Text, Pressable, NativeSyntheticEvent, NativeScrollEvent} from 'react-native'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import {FlatList} from 'react-native-gesture-handler'
import BottomSheetBackdrop from '@/components/BottomSheetBackdrop'
import Item from './Item'
import NewTimetableCategory from './Item/TimetableCategory'
import {Shadow} from 'react-native-shadow-2'

import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'

import {useMutation, useQuery} from '@tanstack/react-query'
import {getTimetableCategoryList, setTimetableCategory, deleteTimetableCategory} from '@/apis/timetable'

import {TimeTableCategory} from '@/types/timetable'

interface Props {
  isShow: boolean
  onClose: Function
}
const TimetableCategoryBottomSheet = ({isShow, onClose}: Props) => {
  const [category, setCategory] = React.useState<TimeTableCategory>({timetable_category_id: null, title: ''})
  const [backdropPressBehavior, setBackdropPressBehavior] = React.useState<number | 'close' | 'none' | 'collapse'>(
    'close'
  )
  const [isNewEdit, setIsNewEdit] = React.useState(false)
  const [isShowShadow, setIsShowShadow] = React.useState(false)

  const timetableCategoryBottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => ['80%'], [])
  const disableButton = React.useMemo(() => {
    return !!category.timetable_category_id || isNewEdit
  }, [category, isNewEdit])

  const position = useSharedValue(0)

  const {data: timetableCategoryList, refetch: refetchTimetableCategoryList} = useQuery({
    queryKey: ['timetableCategoryList2'],
    queryFn: async () => {
      const response = await getTimetableCategoryList()

      return response.data
    },
    initialData: []
  })

  const setTimetableCategoryMutation = useMutation({
    mutationFn: async (data: TimeTableCategory) => {
      return await setTimetableCategory(data)
    },
    onSuccess: async () => {
      await refetchTimetableCategoryList()
      setIsNewEdit(false)
      setCategory({timetable_category_id: null, title: ''})
    }
  })

  const deleteTimetableCategoryMutation = useMutation({
    mutationFn: async (data: TimeTableCategory) => {
      return await deleteTimetableCategory(data)
    },
    onSuccess: async () => {
      await refetchTimetableCategoryList()
      setIsNewEdit(false)
      setCategory({timetable_category_id: null, title: ''})
    }
  })

  const onDismiss = () => {
    onClose()
  }

  const addCategory = () => {
    if (disableButton) {
      return
    }

    setCategory({
      timetable_category_id: -1,
      title: ''
    })

    setIsNewEdit(true)
  }

  const handleNewCategoryClose = () => {
    setIsNewEdit(false)
    setCategory({timetable_category_id: null, title: ''})
  }

  const handleChangeText = (e: string) => {
    setCategory({...category, title: e})
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y > 0) {
      setIsShowShadow(true)
    } else {
      setIsShowShadow(false)
    }
  }

  const handleEdit = (data: TimeTableCategory) => {
    setCategory(data)
  }

  const handleClose = () => {
    setCategory({timetable_category_id: null, title: ''})
  }

  const handleDelete = (data: TimeTableCategory) => {
    deleteTimetableCategoryMutation.mutate(data)
  }

  const handleSubmit = () => {
    setTimetableCategoryMutation.mutate(category)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: position.value
  }))

  React.useEffect(() => {
    if (disableButton) {
      position.value = withTiming(0.5)
    } else {
      position.value = withTiming(1)
    }
  }, [disableButton])

  React.useEffect(() => {
    if (isShow) {
      timetableCategoryBottomSheetRef.current?.present()
    }
  }, [isShow])

  const NewTimetableCategoryItem = React.useCallback(() => {
    return (
      <View>
        {isNewEdit && (
          <NewTimetableCategory
            value={category.title}
            isEdit={true}
            setBackdropPressBehavior={setBackdropPressBehavior}
            onChangeText={handleChangeText}
            onClose={handleNewCategoryClose}
            onSubmit={handleSubmit}
          />
        )}

        <Animated.View style={animatedStyle}>
          <Pressable style={styles.addButton} onPress={addCategory}>
            <Text style={styles.addText}>카테고리 추가하기</Text>
          </Pressable>
        </Animated.View>
      </View>
    )
  }, [isNewEdit, category])

  return (
    <BottomSheetModal
      name="timeTableCategoty"
      ref={timetableCategoryBottomSheetRef}
      index={0}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      backdropComponent={props => {
        return <BottomSheetBackdrop props={props} pressBehavior={backdropPressBehavior} />
      }}
      snapPoints={snapPoints}
      onDismiss={onDismiss}>
      <View style={styles.container}>
        <Shadow
          startColor="#f0eff586"
          distance={10}
          sides={{top: false, bottom: true, start: false, end: false}}
          stretch
          disabled={!isShowShadow}>
          <View style={styles.header}>
            <Text style={styles.title}>카테고리</Text>
          </View>
        </Shadow>

        <FlatList
          data={timetableCategoryList}
          contentContainerStyle={{paddingBottom: 40}}
          keyExtractor={(_, index) => String(index)}
          onScroll={handleScroll}
          bounces={false}
          renderItem={({item}) => (
            <Item
              value={item}
              activeCategory={category}
              onChangeText={handleChangeText}
              setBackdropPressBehavior={setBackdropPressBehavior}
              onEdit={handleEdit}
              onClose={handleClose}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
            />
          )}
          ListFooterComponent={NewTimetableCategoryItem}
        />
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginHorizontal: 16,
    height: 48,
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 20
  },
  addButton: {
    marginHorizontal: 16,
    marginTop: 30,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#2d8cec'
  },
  addText: {
    fontFamily: 'GmarketSansTTFBold',
    fontSize: 18,
    color: '#fff'
  }
})

export default TimetableCategoryBottomSheet
