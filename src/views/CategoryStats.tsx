import {useMemo} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import PieChart from '@/components/Chart/Pie'
import AppBar from '@/components/AppBar'

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
      <AppBar title="카테고리별 통계" backPress />

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
