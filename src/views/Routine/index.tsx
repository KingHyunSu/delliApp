import {useCallback} from 'react'
import {StyleSheet, FlatList, View, Text, ListRenderItem, Pressable, Platform} from 'react-native'
import RoutineItem from './components/RoutineItem'
import PlusIcon from '@/assets/icons/plus.svg'
import {todoRepository} from '@/apis/local'
import {useQuery} from '@tanstack/react-query'
import {RoutineScreenProps} from '@/types/navigation'

const RoutineList = ({navigation}: RoutineScreenProps) => {
  const {data: routineList} = useQuery({
    queryKey: ['routineList'],
    queryFn: () => {
      return todoRepository.getRoutineList()
    },
    initialData: []
  })

  const moveEdit = useCallback(() => {
    navigation.navigate('EditRoutine', {data: null})
  }, [])

  const moveDetail = useCallback(
    (id: number) => {
      console.log(';123123132')
      navigation.navigate('RoutineDetail', {id})
    },
    [navigation]
  )

  const getRenderItem: ListRenderItem<Routine> = useCallback(
    ({item}) => {
      return <RoutineItem item={item} moveDetail={moveDetail} />
    },
    [moveDetail]
  )

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>루틴</Text>
        <View style={styles.titleBar} />
      </View>

      <FlatList
        data={routineList}
        contentContainerStyle={styles.listContainer}
        renderItem={getRenderItem}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />

      <Pressable style={styles.fabContainer} onPress={moveEdit}>
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
  titleWrapper: {
    paddingLeft: 16,
    paddingTop: 40,
    paddingBottom: 30,
    gap: 3
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  titleBar: {
    width: 42,
    height: 5,
    backgroundColor: '#FFD54F'
  },
  listContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#f5f6f8',
    paddingTop: 10,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: '#f5f6f8'
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
