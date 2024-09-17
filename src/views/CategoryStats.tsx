import {useState, useMemo, useCallback} from 'react'
import {ViewStyle, StyleSheet, ScrollView, FlatList, Pressable, View, Text, Image} from 'react-native'
import PieChart from '@/components/Chart/Pie'
import AppBar from '@/components/AppBar'
import CategoryStatsDetailBottomSheet from '@/views/BottomSheet/CategoryStatsDetailBottomSheet'
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
  const [selectedItem, setSelectedItem] = useState<CategoryStatsList | null>(null)

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const categoryStatsList = useRecoilValue(categoryStatsListState)
  const categoryTotalTime = useRecoilValue(categoryTotalTimeState)

  const getBarStyle = useCallback((percentage: number, color: string): ViewStyle => {
    return {
      width: `${percentage}%`,
      height: 10,
      backgroundColor: color,
      borderRadius: 20
    }
  }, [])

  const getIconWrapperStyle = useCallback((color: string) => {
    return [itemStyles.iconWrapper, {backgroundColor: `${color}30`}]
  }, [])

  const pieSize = useMemo(() => {
    return windowDimensions.width / 2
  }, [windowDimensions.width])

  const closeBottomSheet = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const getImage = useCallback((id: number | null) => {
    switch (id) {
      case 1:
        return require('@/assets/icons/3d/open-book.png')
      case 2:
        return require('@/assets/icons/3d/work-out.png')
      case 3:
        return require('@/assets/icons/3d/teddy-bear.png')
      case 5:
        return require('@/assets/icons/3d/briefcase.png')
      case 7:
        return require('@/assets/icons/3d/seedling.png')
      case 8:
        return require('@/assets/icons/3d/bubbles.png')
      default:
        return null
    }
  }, [])

  const getKeyExtractor = useCallback((item: CategoryStatsList, index: number) => {
    return index.toString()
  }, [])

  const selectItem = useCallback(
    (item: CategoryStatsList) => () => {
      setSelectedItem(item)
    },
    []
  )

  const renderItem = useCallback(
    ({item}: CategoryItem) => {
      const percentage = Math.round((item.totalTime / categoryTotalTime) * 100)

      const iconWrapperStyle = getIconWrapperStyle(item.color)
      const barStyle = getBarStyle(percentage, item.color)

      const image = item.image ? item.image : require('@/assets/icons/3d/minus.png')
      // const image = getImage(item.schedule_category_id)
      return (
        <Pressable style={itemStyles.container} onPress={selectItem(item)}>
          {/*<View style={iconWrapperStyle}>{image ? <Image source={image} style={itemStyles.icon} /> : <View />}</View>*/}
          <View style={iconWrapperStyle}>
            <Image source={image} style={itemStyles.icon} />
          </View>

          <View style={itemStyles.wrapper}>
            <View style={itemStyles.titleWrapper}>
              <Text style={itemStyles.title}>{item.categoryTitle}</Text>
              <Text style={itemStyles.countText}>{item.data.length}</Text>
              <ArrowRight width={18} height={18} stroke="#242933" strokeWidth={3} />
            </View>

            <View style={barStyle} />
          </View>

          <View style={itemStyles.percentageWrapper}>
            <Text style={itemStyles.percentageText}>{percentage}%</Text>
            <Text style={itemStyles.timeText}>2시간 50분</Text>
          </View>
        </Pressable>
      )
    },
    [categoryTotalTime, getIconWrapperStyle, getBarStyle]
  )

  return (
    <View style={styles.container}>
      <AppBar title="카테고리별 통계" backPress />
      <ScrollView bounces={false}>
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

      <CategoryStatsDetailBottomSheet visible={!!selectedItem} data={selectedItem} onClose={closeBottomSheet} />
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

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
    gap: 20
  },
  wrapper: {
    flex: 1,
    gap: 12
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24
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
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#9E9E9E',
    marginRight: 5
  },
  percentageWrapper: {
    alignItems: 'flex-end',
    gap: 5
  },
  percentageText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: '#424242'
  },
  timeText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#9E9E9E'
  }
})

export default CategoryStats
