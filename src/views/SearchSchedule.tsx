import {useState, useCallback, useEffect, useRef} from 'react'
import {ListRenderItem, StyleSheet, View, Text, TextInput, FlatList, Pressable} from 'react-native'
import {trigger} from 'react-native-haptic-feedback'
import {Shadow} from 'react-native-shadow-2'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

import {useQuery} from '@tanstack/react-query'
import {scheduleRepository} from '@/repository'
import SearchScheduleCategoryFilterBottomSheet from '@/components/bottomSheet/SearchScheduleCategoryFilterBottomSheet'
import {useRecoilState, useSetRecoilState} from 'recoil'
import {showSearchScheduleCategoryFilterBottomSheetState} from '@/store/bottomSheet'
import {searchScheduleResultListState} from '@/store/schedule'
import {SearchScheduleScreenProps} from '@/types/navigation'

export interface SearchSchedule {
  schedule_id: number
  schedule_category_id: number | null
  title: string
  start_time: number
  end_time: number
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  start_date: string
  end_date: string
}
export interface Options {
  multiple: boolean
}
const SearchSchedule = ({navigation, route}: SearchScheduleScreenProps) => {
  const [searchScheduleList, setSearchScheduleList] = useState<SearchSchedule[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedList, setSelectedList] = useState<SearchSchedule[]>([])
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const setShowSearchScheduleCategoryFilterBottomSheet = useSetRecoilState(
    showSearchScheduleCategoryFilterBottomSheetState
  )
  const [searchScheduleResultList, setSearchScheduleResultList] = useRecoilState(searchScheduleResultListState)

  const {data: result} = useQuery({
    queryKey: ['getSearchScheduleList'],
    queryFn: () => {
      return scheduleRepository.getSearchScheduleList()
    },
    initialData: []
  })

  const showSearchScheduleCategoryFilterBottomSheet = useCallback(() => {
    setShowSearchScheduleCategoryFilterBottomSheet(true)
  }, [setShowSearchScheduleCategoryFilterBottomSheet])

  const handleSelected = useCallback(
    (item: SearchSchedule) => () => {
      const isMultiple = route.params.options.multiple

      if (!isMultiple && selectedList.length >= 1) {
        setSelectedList([item])
        return
      }

      const target = selectedList.find(sItem => item.schedule_id === sItem.schedule_id)

      if (!target) {
        trigger('soft', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false
        })

        setSelectedList(prevState => [...prevState, {...item, goal_schedule_id: null}])
      }
    },
    [selectedList, setSelectedList, route.params.options.multiple]
  )

  const getKeyExtractor = useCallback((item: SearchSchedule, index: number) => {
    return index.toString()
  }, [])

  const handleConfirm = useCallback(() => {
    setSearchScheduleResultList(selectedList)
    navigation.goBack()
  }, [navigation, selectedList, setSearchScheduleResultList])

  useEffect(() => {
    setSelectedList(searchScheduleResultList)
  }, [searchScheduleResultList, setSelectedList])

  useEffect(() => {
    if (result.length > 0) {
      setSearchScheduleList(result)
    }
  }, [result])

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const newSearchScheduleList = result.filter(item => {
        return item.title.includes(searchText)
      })
      setSearchScheduleList(newSearchScheduleList)
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchText, result])

  // components
  const getRenderItem: ListRenderItem<SearchSchedule> = useCallback(
    ({item}) => {
      const isSelected = selectedList.find(sItem => item.schedule_id === sItem.schedule_id)
      const selectedColor = isSelected ? '#f5f8ff' : null

      return (
        <Pressable onPress={handleSelected(item)}>
          <ScheduleItem
            title={item.title}
            categoryId={item.schedule_category_id}
            time={{startTime: item.start_time, endTime: item.end_time}}
            date={{startDate: item.start_date, endDate: item.end_date}}
            dayOfWeek={{
              mon: item.mon,
              tue: item.tue,
              wed: item.wed,
              thu: item.thu,
              fri: item.fri,
              sat: item.sat,
              sun: item.sun
            }}
            backgroundColor={selectedColor}
          />
        </Pressable>
      )
    },
    [selectedList, handleSelected]
  )

  return (
    <View style={styles.container}>
      <View style={styles.appBarContainer}>
        <AppBar backPress>
          <TextInput
            value={searchText}
            style={styles.input}
            placeholder="검색어를 입력해주세요"
            placeholderTextColor="#7c8698"
            onChangeText={setSearchText}
          />
        </AppBar>

        <View style={styles.searchCategoryButtonWrapper}>
          <Text style={styles.searchCategoryButtonText}>{`선택된 일정 ${selectedList.length}개`}</Text>

          <Pressable style={styles.searchCategoryButton} onPress={showSearchScheduleCategoryFilterBottomSheet}>
            <Text style={styles.searchCategoryButtonText}>전체</Text>
            <ArrowDownIcon stroke="#424242" />
          </Pressable>
        </View>
      </View>

      <View style={styles.wrapper}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={getKeyExtractor}
          data={searchScheduleList}
          renderItem={getRenderItem}
        />
      </View>

      <Shadow stretch containerStyle={styles.confirmButtonWrapper} startColor="#ffffff" distance={30}>
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>선택하기</Text>
        </Pressable>
      </Shadow>

      <SearchScheduleCategoryFilterBottomSheet />
    </View>
  )
}

const styles = StyleSheet.create({
  appBarContainer: {
    backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8'
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#f5f6f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 16,
    color: '#424242'
  },
  searchCategoryButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  searchCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    gap: 5,
    paddingLeft: 20
  },
  searchCategoryButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#424242'
  },
  listContainer: {
    gap: 15,
    paddingTop: 20,
    paddingBottom: 83
  },

  confirmButtonWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    marginHorizontal: 16
  },
  confirmButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 10
  },
  confirmButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

export default SearchSchedule
