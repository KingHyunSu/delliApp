import {useCallback} from 'react'
import {ListRenderItem, StyleSheet, View, Text, TextInput, FlatList, Pressable} from 'react-native'
import AppBar from '@/components/AppBar'
import ScheduleItem from '@/components/ScheduleItem'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

import {useQuery} from '@tanstack/react-query'
import {scheduleRepository} from '@/repository'
import {GetSearchScheduleListResponse} from '@/repository/types/schedule'
import SearchScheduleCategoryFilterBottomSheet from '@/components/bottomSheet/SearchScheduleCategoryFilterBottomSheet'
import {useSetRecoilState} from 'recoil'
import {showSearchScheduleCategoryFilterBottomSheetState} from '@/store/bottomSheet'

const SearchEditGoalSchedule = () => {
  const setShowSearchScheduleCategoryFilterBottomSheet = useSetRecoilState(
    showSearchScheduleCategoryFilterBottomSheetState
  )

  const {data: getSearchScheduleList} = useQuery({
    queryKey: ['getSearchScheduleList'],
    queryFn: () => {
      return scheduleRepository.getSearchScheduleList()
    },
    initialData: []
  })

  const showSearchScheduleCategoryFilterBottomSheet = useCallback(() => {
    setShowSearchScheduleCategoryFilterBottomSheet(true)
  }, [setShowSearchScheduleCategoryFilterBottomSheet])

  const handleSelected = useCallback(() => {
    console.log('item select')
  }, [])

  const getKeyExtractor = useCallback((item: GetSearchScheduleListResponse, index: number) => {
    return index.toString()
  }, [])

  const getRenderItem: ListRenderItem<GetSearchScheduleListResponse> = useCallback(({item}) => {
    return <ScheduleItem item={item} onClick={handleSelected} />
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.appBarContainer}>
        <AppBar backPress>
          <TextInput style={styles.input} placeholder="검색어를 입력해주세요" placeholderTextColor="#7c8698" />
        </AppBar>

        <View style={styles.searchCategoryButtonWrapper}>
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
          data={getSearchScheduleList}
          renderItem={getRenderItem}
        />
      </View>

      <SearchScheduleCategoryFilterBottomSheet />
    </View>
  )
}

const styles = StyleSheet.create({
  appBarContainer: {
    // height: 58,
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
    alignItems: 'flex-end',
    paddingRight: 16
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
    paddingVertical: 20
  }
})

export default SearchEditGoalSchedule
