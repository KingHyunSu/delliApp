import {useMemo} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import PieChart from '@/components/Chart/Pie'
import AppBar from '@/components/AppBar'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'

import {useRecoilValue} from 'recoil'
import {categoryStatsListState, categoryTotalTimeState} from '@/store/stats'
import {windowDimensionsState} from '@/store/system'

const CategoryStats = () => {
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const categoryStatsList = useRecoilValue(categoryStatsListState)
  const categoryTotalTime = useRecoilValue(categoryTotalTimeState)

  const pieSize = useMemo(() => {
    return windowDimensions.width / 2
  }, [windowDimensions.width])

  return (
    <View style={styles.container}>
      <AppBar>
        <Pressable style={styles.backButton} onPress={() => console.log('tresae')}>
          <ArrowLeftIcon stroke="#424242" strokeWidth={3} />
        </Pressable>

        <Text style={styles.title}>카테고리별 통계</Text>
      </AppBar>

      <View style={styles.pieChartWrapper}>
        <PieChart size={pieSize} totalTime={categoryTotalTime} data={categoryStatsList} />
      </View>

      <View style={styles.listContainer}>
        {categoryStatsList.map((item, index) => {
          return <Text key={index}>fltmxm</Text>
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  backButton: {
    zIndex: 999,
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
    // paddingLeft: 10
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#424242'
  },
  pieChartWrapper: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 80
  },
  listContainer: {
    paddingHorizontal: 16
  }
})

export default CategoryStats
