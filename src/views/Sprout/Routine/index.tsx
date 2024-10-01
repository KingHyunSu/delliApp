import {useCallback, useEffect} from 'react'
import {ListRenderItem, Platform, StyleSheet, FlatList, Pressable, View} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import RoutineItem from './components/RoutineItem'
import PlusIcon from '@/assets/icons/plus.svg'
import {useSetRecoilState} from 'recoil'
import {searchScheduleResultListState} from '@/store/schedule'
import {useQuery} from '@tanstack/react-query'
import {todoRepository} from '@/repository'
import {SproutNavigationProps} from '@/types/navigation'
import {Routine} from '@/@types/todo'

interface Props {
  navigator: SproutNavigationProps
}
const RoutineList = ({navigator}: Props) => {
  const isFocused = useIsFocused()
  const setSearchScheduleResultList = useSetRecoilState(searchScheduleResultListState)

  const {data: routineList} = useQuery({
    queryKey: ['routineList'],
    queryFn: () => {
      return todoRepository.getRoutineListQuery()
    },
    initialData: []
  })

  const moveEditRoutine = useCallback(() => {
    navigator.navigation.navigate('EditRoutine')
  }, [navigator.navigation])

  useEffect(() => {
    if (isFocused) {
      setSearchScheduleResultList([])
    }
  }, [isFocused, setSearchScheduleResultList])

  const getRenderItem: ListRenderItem<Routine> = useCallback(({item}) => {
    return <RoutineItem item={item} />
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          data={routineList}
          contentContainerStyle={styles.listContainer}
          renderItem={getRenderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Pressable style={styles.fabContainer} onPress={moveEditRoutine}>
        <PlusIcon stroke="#fff" strokeWidth={3} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f6f8'
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 92,
    gap: 15
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      android: {
        elevation: 3
      }
    })
  }
})
export default RoutineList
