import {useMemo, useCallback} from 'react'
import {StyleSheet, Pressable, View, ListRenderItem} from 'react-native'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {DefaultOutline} from '@/components/timetableOutline'

import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {useGetOutlineList} from '@/apis/hooks/useUser'

interface Item {
  id: number
  component: any
}
interface Props {
  activeItem: ActiveOutline
  activeBackground: ActiveBackground
}
const columnGap = 20
const OutlineList = ({activeItem, activeBackground}: Props) => {
  const {data: outlineList} = useGetOutlineList()

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const itemSize = useMemo(() => {
    const bottomSheetPadding = 40
    const totalGap = columnGap * 2

    return (windowDimensions.width - bottomSheetPadding - totalGap) / 3
  }, [windowDimensions.width])

  const radius = useMemo(() => {
    const itemPadding = 20
    const strokeWidth = 10

    return itemSize / 2 - strokeWidth - itemPadding
  }, [itemSize])

  const list: Array<Item | null> = useMemo(() => {
    return outlineList.map(item => {
      const backgroundColor =
        item.product_outline_id === activeItem.product_outline_id ? activeItem.background_color : item.background_color

      const progressColor =
        item.product_outline_id === activeItem.product_outline_id ? activeItem.progress_color : item.progress_color

      if (item.product_outline_id === 1) {
        return {
          id: item.product_outline_id,
          component: (
            <DefaultOutline
              backgroundColor={backgroundColor}
              progressColor={progressColor}
              radius={radius}
              strokeWidth={10}
              percentage={50}
            />
          )
        }
      }

      return null
    })
  }, [activeItem, outlineList, radius])

  const getRenderItem: ListRenderItem<Item | null> = useCallback(
    ({item}) => {
      if (!item) {
        return <></>
      }

      const isActive = item.id === activeItem.product_outline_id
      const activeBackgroundColor = activeBackground ? activeBackground.background_color : '#cce5ff'
      const backgroundColor = isActive ? activeBackgroundColor : '#f5f6f8'

      return (
        <Pressable style={[itemStyles.container, {width: itemSize, height: itemSize, backgroundColor}]}>
          {item.component}
        </Pressable>
      )
    },
    [itemSize, activeItem, activeBackground]
  )

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        data={list}
        renderItem={getRenderItem}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.listColumnWrapper}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 70,
    gap: 20
  },
  listColumnWrapper: {
    gap: columnGap
  }
})

const itemStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  }
})

export default OutlineList
