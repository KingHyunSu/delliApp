import {useCallback, useState} from 'react'
import {StyleSheet, View, Text, useWindowDimensions} from 'react-native'
import {TabView, TabBar, NavigationState} from 'react-native-tab-view'
import Goal from './Goal'
import AppBar from '@/components/AppBar'
import {SproutNavigationProps} from '@/types/navigation'
import type {SceneRendererProps} from 'react-native-tab-view/lib/typescript/src/types'

const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}}>
    <Text>Second</Text>
  </View>
)

type Route = {key: string; title: string}
type RenderTabBar = SceneRendererProps & {navigationState: NavigationState<Route>}
type RenderScene = SceneRendererProps & {route: Route}

const Sprout = ({navigation}: SproutNavigationProps) => {
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState<Route[]>([
    {key: 'goal', title: '목표'},
    {key: 'routine', title: '루틴'}
  ])

  const moveEditGoal = useCallback(
    (id: number | null) => {
      navigation.navigate('EditGoal', {id})
    },
    [navigation]
  )

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
          return <Goal moveEdit={moveEditGoal} />
        case 'routine':
          return <SecondRoute />
        default:
          return null
      }
    },
    [moveEditGoal]
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
