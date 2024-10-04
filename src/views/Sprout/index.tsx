import {useCallback, useState, useEffect} from 'react'
import {StyleSheet, View, useWindowDimensions} from 'react-native'
import {TabView, TabBar, NavigationState} from 'react-native-tab-view'
import {useIsFocused} from '@react-navigation/native'
import Goal from './Goal'
import Routine from './Routine'
import AppBar from '@/components/AppBar'
import {useSetRecoilState} from 'recoil'
import {searchScheduleResultListState} from '@/store/schedule'
import {SproutNavigationProps} from '@/types/navigation'
import type {SceneRendererProps} from 'react-native-tab-view/lib/typescript/src/types'

type Route = {key: string; title: string}
type RenderTabBar = SceneRendererProps & {navigationState: NavigationState<Route>}
type RenderScene = SceneRendererProps & {route: Route}

const Sprout = (navigator: SproutNavigationProps) => {
  const isFocused = useIsFocused()

  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState<Route[]>([
    {key: 'goal', title: '목표'},
    {key: 'routine', title: '루틴'}
  ])

  const setSearchScheduleResultList = useSetRecoilState(searchScheduleResultListState)

  const moveGoalDetail = useCallback(
    (id: number | null) => {
      navigator.navigation.navigate('GoalDetail', {id})
    },
    [navigator.navigation]
  )

  const moveEditGoalDetail = useCallback(() => {
    navigator.navigation.navigate('EditGoal', {data: null})
  }, [navigator.navigation])

  useEffect(() => {
    if (isFocused) {
      setSearchScheduleResultList([])
    }
  }, [isFocused, setSearchScheduleResultList])

  const getRenderTabBar = useCallback((props: RenderTabBar) => {
    return (
      <TabBar
        {...props}
        style={tabBarStyle.container}
        activeColor="#424242"
        labelStyle={tabBarStyle.label}
        indicatorStyle={tabBarStyle.indicator}
      />
    )
  }, [])

  const getRenderScene = useCallback(
    ({route}: RenderScene) => {
      switch (route.key) {
        case 'goal':
          return <Goal moveDetail={moveGoalDetail} moveEditGoalDetail={moveEditGoalDetail} />
        case 'routine':
          return <Routine navigator={navigator} />
        default:
          return null
      }
    },
    [moveGoalDetail]
  )

  return (
    <View style={styles.container}>
      <AppBar />

      <TabView
        onIndexChange={setIndex}
        navigationState={{index, routes}}
        renderTabBar={getRenderTabBar}
        renderScene={getRenderScene}
        initialLayout={{width: layout.width}}
        style={{backgroundColor: '#fff'}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

const tabBarStyle = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  },
  label: {
    color: '#babfc5',
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold'
  },
  indicator: {
    backgroundColor: '#424242'
  }
})

export default Sprout
