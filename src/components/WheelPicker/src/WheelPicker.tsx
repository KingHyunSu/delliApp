import React, {forwardRef, useEffect, useMemo, useRef, useState, useImperativeHandle} from 'react'
import {
  StyleProp,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ViewStyle,
  View,
  ViewProps,
  FlatListProps,
  FlatList
} from 'react-native'
import styles from './WheelPicker.styles'
import WheelPickerItem from './WheelPickerItem'

export interface Refs {
  scrollToIndex: (index: number) => void
}
interface Props {
  name: string
  selectedIndex: number
  options: string[]
  onStartReached?: Function
  onEndReached?: Function
  onChange: (index: number, activeName: string | null) => void
  selectedIndicatorStyle?: StyleProp<ViewStyle>
  itemTextStyle?: TextStyle
  itemStyle?: ViewStyle
  itemHeight?: number
  containerStyle?: ViewStyle
  containerProps?: Omit<ViewProps, 'style'>
  scaleFunction?: (x: number) => number
  rotationFunction?: (x: number) => number
  opacityFunction?: (x: number) => number
  visibleRest?: number
  decelerationRate?: 'normal' | 'fast' | number
  flatListProps?: Omit<FlatListProps<string | null>, 'data' | 'renderItem'>
  isInfinite?: boolean
}

const WheelPicker = forwardRef<Refs, Props>(
  (
    {
      name,
      selectedIndex,
      options,
      onStartReached,
      onEndReached,
      onChange,
      selectedIndicatorStyle = {},
      containerStyle = {},
      itemStyle = {},
      itemTextStyle = {},
      itemHeight = 40,
      scaleFunction = (x: number) => 1.0 ** x,
      rotationFunction = (x: number) => 1 - Math.pow(1 / 2, x),
      opacityFunction = (x: number) => Math.pow(1 / 3, x),
      visibleRest = 2,
      decelerationRate = 'fast',
      containerProps = {},
      flatListProps = {},
      isInfinite = false
    },
    ref
  ) => {
    const flatListRef = useRef<FlatList>(null)
    const [activeName, setActiveName] = useState<string | null>(null)
    const [scrollY] = useState(new Animated.Value(0))

    const containerHeight = (1 + visibleRest * 2) * itemHeight
    const paddedOptions = useMemo(() => {
      const array: (string | null)[] = [...options]
      if (isInfinite) {
        for (let i = 0; i < visibleRest; i++) {
          array.unshift(null)
          // array.push(null)
        }
      } else {
        for (let i = 0; i < visibleRest; i++) {
          array.unshift(null)
          array.push(null)
        }
      }

      return array
    }, [options, visibleRest, isInfinite])

    const offsets = useMemo(
      () => [...Array(paddedOptions.length)].map((x, i) => i * itemHeight),
      [paddedOptions, itemHeight]
    )

    const currentScrollIndex = useMemo(
      () => Animated.add(Animated.divide(scrollY, itemHeight), visibleRest),
      [visibleRest, scrollY, itemHeight]
    )

    const handleStartReached = () => {
      if (onStartReached) {
        console.log('handleStartReached')
        onStartReached()
      }
    }

    const handleEndReached = () => {
      if (onEndReached) {
        onEndReached()
      }
    }

    const handleScrollBeginDrag = () => {
      setActiveName(name)
    }

    const handleMomentumScrollEnd = () => {
      setActiveName(null)
    }

    const handleScroll = Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = Math.min(itemHeight * (options.length - 1), Math.max(event.nativeEvent.contentOffset.y, 0))

        let index = Math.floor(Math.floor(offsetY) / itemHeight)
        const last = Math.floor(offsetY % itemHeight)
        if (last > itemHeight / 2) index++

        if (index !== selectedIndex) {
          onChange(index, activeName)
        }
      },
      useNativeDriver: true
    })

    const scrollToIndex = (index: number) => {
      flatListRef.current?.scrollToIndex({
        index: index,
        animated: false
      })
    }

    useImperativeHandle(ref, () => ({
      scrollToIndex
    }))

    useEffect(() => {
      if (selectedIndex < 0 || selectedIndex >= options.length) {
        throw new Error(`Selected index ${selectedIndex} is out of bounds [0, ${options.length - 1}]`)
      }
    }, [selectedIndex, options])

    return (
      <View style={[styles.container, {height: containerHeight}, containerStyle]} {...containerProps}>
        <View
          style={[
            styles.selectedIndicator,
            selectedIndicatorStyle,
            {
              transform: [{translateY: -itemHeight / 2}],
              height: itemHeight
            }
          ]}
        />
        <Animated.FlatList<string | null>
          {...flatListProps}
          ref={flatListRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          snapToOffsets={offsets}
          onStartReachedThreshold={2}
          onEndReachedThreshold={2}
          onStartReached={handleStartReached}
          onEndReached={handleEndReached}
          decelerationRate={decelerationRate}
          initialScrollIndex={selectedIndex}
          getItemLayout={(data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index
          })}
          data={paddedOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item: option, index}) => (
            <WheelPickerItem
              key={`option-${index}`}
              index={index}
              option={option}
              style={itemStyle}
              textStyle={itemTextStyle}
              height={itemHeight}
              currentScrollIndex={currentScrollIndex}
              scaleFunction={scaleFunction}
              rotationFunction={rotationFunction}
              opacityFunction={opacityFunction}
              visibleRest={visibleRest}
            />
          )}
        />
      </View>
    )
  }
)

export default WheelPicker
