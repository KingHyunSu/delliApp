import {useCallback, useMemo} from 'react'
import {ListRenderItem, StyleSheet, Pressable, Image, View, Text} from 'react-native'
import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import CheckIcon from '@/assets/icons/check.svg'
import {Svg, Defs, LinearGradient, Stop, Rect} from 'react-native-svg'

import {useGetBackgroundList} from '@/apis/hooks/useUser'
import {useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {colorKit} from 'reanimated-color-picker'

interface Props {
  activeItem: ActiveBackground
  onChange: (value: ActiveBackground) => void
}
const BackgroundList = ({activeItem, onChange}: Props) => {
  const {data: backgroundList} = useGetBackgroundList()

  const windowDimensions = useRecoilValue(windowDimensionsState)

  const imageWidth = useMemo(() => {
    const totalPadding = 40
    const totalGap = 40
    return (windowDimensions.width - totalPadding - totalGap) / 3
  }, [windowDimensions.width])

  const changeBackground = useCallback(
    (item: MyBackgroundItem) => async () => {
      if (item.product_background_id === activeItem.background_id) {
        return
      }

      onChange({
        background_id: item.product_background_id,
        main_url: item.main_url,
        display_mode: item.display_mode,
        background_color: item.background_color,
        accent_color: item.accent_color
      })
    },
    [activeItem, onChange]
  )

  // components
  const getRenderItem: ListRenderItem<MyBackgroundItem> = useCallback(
    ({item}) => {
      const aspectRatio = 1.7

      const isActive = activeItem.background_id === item.product_background_id
      const shadowColor = colorKit.darken(item.background_color, 25).hex()

      return (
        <Pressable style={itemStyles.container} onPress={changeBackground(item)}>
          <Image
            style={{width: imageWidth, height: imageWidth * aspectRatio, borderRadius: 10}}
            source={{uri: item.thumb_url}}
          />

          {isActive && (
            <View style={itemStyles.activeIconWrapper}>
              <CheckIcon width={14} height={14} stroke="#ffffff" strokeWidth={3} />
            </View>
          )}

          <View style={itemStyles.titleWrapper}>
            <Svg width={imageWidth} height={60}>
              <Defs>
                <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
                  <Stop offset="0" stopColor={shadowColor} stopOpacity="0.5" />
                  <Stop offset="0.5" stopColor={shadowColor} stopOpacity="0.2" />
                  <Stop offset="1" stopColor={item.background_color} stopOpacity="0" />
                </LinearGradient>
              </Defs>

              <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>

            <Text numberOfLines={1} style={itemStyles.title}>
              {item.title}
            </Text>
          </View>
        </Pressable>
      )
    },
    [activeItem, imageWidth, changeBackground]
  )

  return (
    <BottomSheetFlatList
      data={backgroundList}
      renderItem={getRenderItem}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.listColumnWrapper}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    gap: 30
  },
  listColumnWrapper: {
    gap: 20
  }
})

const itemStyles = StyleSheet.create({
  container: {
    gap: 5
  },
  activeIconWrapper: {
    position: 'absolute',
    right: 7,
    top: 7,
    padding: 5,
    backgroundColor: '#1E90FF',
    borderRadius: 20
  },
  titleWrapper: {
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'
  },
  title: {
    position: 'absolute',
    paddingHorizontal: 10,
    bottom: 7,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#ffffff'
  }
})

export default BackgroundList
