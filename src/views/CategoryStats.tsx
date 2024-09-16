import {useMemo, useCallback} from 'react'
import {ViewStyle, StyleSheet, ScrollView, FlatList, Pressable, View, Text} from 'react-native'
import PieChart from '@/components/Chart/Pie'
import AppBar from '@/components/AppBar'
import ArrowRight from '@/assets/icons/arrow_right.svg'

import {useRecoilValue} from 'recoil'
import {categoryStatsListState, categoryTotalTimeState} from '@/store/stats'
import {windowDimensionsState} from '@/store/system'

import type {CategoryStatsList} from '@/@types/stats'

interface CategoryItem {
  item: CategoryStatsList
  index: number
}
const CategoryStats = () => {
  const windowDimensions = useRecoilValue(windowDimensionsState)
  const categoryStatsList = useRecoilValue(categoryStatsListState)
  const categoryTotalTime = useRecoilValue(categoryTotalTimeState)

  const pieSize = useMemo(() => {
    return windowDimensions.width / 2
  }, [windowDimensions.width])

  const getKeyExtractor = useCallback((item: CategoryStatsList, index: number) => {
    return index.toString()
  }, [])

  const renderItem = useCallback(({item}: CategoryItem) => {
    const percentage = Math.round((item.totalTime / categoryTotalTime) * 100)
    const barStyle: ViewStyle = {
      width: `${percentage}%`,
      height: 10,
      backgroundColor: item.color,
      borderRadius: 20
    }

    return (
      <Pressable style={itemStyles.container}>
        <View
          style={{
            width: 38,
            height: 38,
            backgroundColor: item.color,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{fontSize: 14}}>{item.categoryIcon}</Text>
        </View>

        <View style={itemStyles.wrapper}>
          <View style={itemStyles.titleWrapper}>
            <Text style={itemStyles.title}>{item.categoryTitle}</Text>
            <Text style={itemStyles.countText}>{item.data.length}</Text>
            <ArrowRight width={18} height={18} stroke="#242933" strokeWidth={3} />
          </View>
          <View style={barStyle} />
        </View>

        <Text style={itemStyles.percentageText}>{percentage}%</Text>
      </Pressable>
    )
  }, [])

  return (
    <ScrollView style={styles.container} bounces={false}>
      <AppBar title="카테고리별 통계" backPress />

      <View style={styles.pieChartWrapper}>
        <PieChart size={pieSize} totalTime={categoryTotalTime} data={categoryStatsList} />
      </View>

      <FlatList
        style={styles.listContainer}
        data={categoryStatsList}
        keyExtractor={getKeyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </ScrollView>
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

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 30,
    gap: 20
  },
  wrapper: {
    flex: 1,
    gap: 10
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#424242',
    marginRight: 3
  },
  countText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#9E9E9E',
    marginRight: 5
  },
  percentageText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: '#424242'
  }
})

export default CategoryStats
