import {useCallback} from 'react'
import {ListRenderItem, StyleSheet, FlatList, Pressable, View, Platform} from 'react-native'
import Item from './components/Item'
import PlusIcon from '@/assets/icons/plus.svg'
import {useQuery} from '@tanstack/react-query'
import {goalRepository} from '@/apis/local'
import {SproutNavigationProps} from '@/types/navigation'
import {Goal} from '@/@types/goal'

interface Props {
  navigator: SproutNavigationProps
}
const GoalList = ({navigator}: Props) => {
  const {data: goalList} = useQuery({
    queryKey: ['goalList'],
    queryFn: () => {
      return goalRepository.getGoalList()
    },
    initialData: []
  })

  const moveCreate = useCallback(() => {
    navigator.navigation.navigate('CreateGoal')
  }, [navigator])

  const moveDetail = useCallback(
    (data: Goal) => {
      navigator.navigation.navigate('GoalDetail', {data})
    },
    [navigator]
  )

  const getRenderItem: ListRenderItem<Goal> = useCallback(
    ({item}) => {
      return <Item item={item} moveDetail={moveDetail} />
    },
    [moveDetail]
  )

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          data={goalList}
          contentContainerStyle={styles.listContainer}
          renderItem={getRenderItem}
          showsVerticalScrollIndicator={false}
        />

        <Pressable style={styles.fabContainer} onPress={moveCreate}>
          <PlusIcon stroke="#fff" strokeWidth={3} />
        </Pressable>
      </View>
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

export default GoalList
