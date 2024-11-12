import React from 'react'
import {StyleSheet, ViewStyle, Pressable, View} from 'react-native'
import Animated, {useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import ArrowRightIcon from '@/assets/icons/arrow_right.svg'
import {useRecoilValue} from 'recoil'
import {activeThemeState} from '@/store/system'

interface Props {
  type?: 'container' | 'item'
  value?: boolean
  expandable?: boolean
  headerHeight?: number
  contentsHeight?: number
  handleExpansion?: () => void
  headerComponent: React.ReactNode
  contentsComponent?: React.ReactNode
}
const Panel = ({
  type,
  value = false,
  expandable = true,
  headerHeight = 74,
  contentsHeight = 0,
  handleExpansion,
  headerComponent,
  contentsComponent
}: Props) => {
  const activeTheme = useRecoilValue(activeThemeState)

  const panelHeight = useSharedValue(headerHeight)

  const heightAnimatedStyle = useAnimatedStyle(() => ({
    height: panelHeight.value
  }))

  const containerStyle = React.useMemo(() => {
    const backgroundColor = activeTheme.theme_id === 1 ? '#ffffff' : activeTheme.color6
    const borderWidth = activeTheme.theme_id === 1 ? 2 : 0

    let style: ViewStyle = [styles.container, {backgroundColor, borderWidth, borderColor: activeTheme.color2}]

    if (type === 'item') {
      style = styles.itemContainer
    }
    return [style, heightAnimatedStyle]
  }, [activeTheme.theme_id, activeTheme.color2, activeTheme.color6, type])

  const headerStyle = React.useMemo(() => {
    let style: ViewStyle = styles.header

    if (type === 'item') {
      style = styles.itemHeader
    }

    return [style, {height: headerHeight}]
  }, [type])

  const headerRightIcon = React.useMemo(() => {
    if (type === 'container') {
      if (expandable) {
        return value ? <ArrowUpIcon stroke={activeTheme.color7} /> : <ArrowDownIcon stroke={activeTheme.color7} />
      }

      return <ArrowRightIcon stroke={activeTheme.color7} strokeWidth={3} width={16} height={16} />
    }

    return <></>
  }, [activeTheme.color7, expandable, type, value])

  React.useEffect(() => {
    if (expandable) {
      if (value) {
        panelHeight.value = withTiming(headerHeight + contentsHeight)
      } else {
        panelHeight.value = withTiming(headerHeight)
      }
    }
  }, [value, contentsHeight])

  return (
    <Animated.View style={containerStyle}>
      <Pressable style={headerStyle} onPress={handleExpansion}>
        {headerComponent}

        {headerRightIcon}
      </Pressable>

      {contentsComponent && (
        <View style={[styles.contents, {borderTopColor: activeTheme.color2}]}>{contentsComponent}</View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: 10
  },
  itemContainer: {
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  itemHeader: {
    justifyContent: 'center'
  },
  contents: {
    borderTopWidth: 2
  }
})

export default Panel
