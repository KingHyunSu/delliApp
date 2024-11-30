import {useCallback, useMemo} from 'react'
import {ListRenderItem, StyleSheet, View, Pressable, Text} from 'react-native'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {Svg, Path} from 'react-native-svg'

import {useGetProductColorThemeList} from '@/apis/hooks/useProduct'
import {useRecoilValue} from 'recoil'
import {activeBackgroundState, windowDimensionsState} from '@/store/system'
import {describeArc} from '@/utils/pieHelper'

interface Props {
  value: ActiveColorTheme | null
  onChange: (value: ActiveColorTheme) => void
}
const ThemeColorList = ({value, onChange}: Props) => {
  const {data: productColorThemeList} = useGetProductColorThemeList()

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const activeBackground = useRecoilValue(activeBackgroundState)

  const radius = useMemo(() => {
    const itemWrapperSize = (windowDimensions.width - 60 - 20) / 2
    const totalPaddingHorizontal = 40

    return (itemWrapperSize - totalPaddingHorizontal) / 2
  }, [windowDimensions.width])

  const changeColorTheme = useCallback(
    (item: ProductColorThemeItem) => () => {
      onChange(item)
    },
    [onChange]
  )

  const getRenderItem: ListRenderItem<ProductColorThemeItem> = useCallback(
    ({item}) => {
      let list: ColorThemeItem[] = []

      if (item.item_list?.length > 1) {
        const sortedItemList = [...item.item_list].sort((a, b) => {
          return a.order - b.order
        })

        list = [...sortedItemList, ...sortedItemList]
      }

      const angle = 360 / list.length

      return (
        <Pressable
          style={[styles.itemContainer, {backgroundColor: activeBackground.background_color}]}
          onPress={changeColorTheme(item)}>
          <Svg width={radius * 2} height={radius * 2}>
            {list.map((sItem, index) => {
              const {path} = describeArc({
                x: radius,
                y: radius,
                radius,
                startAngle: angle * index,
                endAngle: angle * index + angle
                // startAngle: angle * index + angle / 2,
                // endAngle: angle * index + angle + angle / 2
              })

              return <Path key={index} d={path} fill={sItem.color} />
            })}
          </Svg>

          {value?.product_color_theme_id === item.product_color_theme_id && (
            <View style={styles.activeItemLabelWrapper}>
              <Text style={styles.activeItemLabelText}>적용중</Text>
            </View>
          )}
        </Pressable>
      )
    },
    [radius, value?.product_color_theme_id, activeBackground.background_color, changeColorTheme]
  )

  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={2}
      data={productColorThemeList}
      renderItem={getRenderItem}
    />
  )
}

const styles = StyleSheet.create({
  listContentContainer: {
    gap: 20,
    paddingTop: 20
  },
  columnWrapper: {
    gap: 30
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    borderRadius: 20
  },
  activeItemLabelWrapper: {
    position: 'absolute',
    right: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: '#1E90FF'
  },
  activeItemLabelText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#ffffff'
  }
})

export default ThemeColorList
