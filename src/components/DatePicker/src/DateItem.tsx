import {memo, useMemo, useCallback} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import {format, isBefore} from 'date-fns'
import {dateItemStyles} from '../style'

interface DateItemProps {
  item: Date
  value: string | null
  disableDate?: string
  activeTheme: ActiveTheme
  onChange: (value: Date) => void
}

const DateItem = memo(({item, value, disableDate, activeTheme, onChange}: DateItemProps) => {
  const formatedItem = useMemo(() => {
    return format(item, 'yyyy-MM-dd')
  }, [item])

  const isToday = useMemo(() => {
    return formatedItem === format(new Date(), 'yyyy-MM-dd')
  }, [formatedItem])

  const isActive = useMemo(() => {
    return formatedItem === value
  }, [formatedItem, value])

  const isDisable = useMemo(() => {
    if (disableDate) {
      return isBefore(new Date(formatedItem), new Date(disableDate))
    }

    return false
  }, [formatedItem, disableDate])

  const handleChange = useCallback(() => {
    if (isDisable) {
      return
    }

    onChange(item)
  }, [isDisable, onChange, item])

  const itemStyle = useMemo(() => {
    if (isActive) {
      return activeItemStyle
    }
    return isActive ? activeItemStyle : styles.item
  }, [isActive])

  const textStyle = useMemo(() => {
    let color = activeTheme.color3

    if (isActive || isToday) {
      color = '#1E90FF'
    } else if (isDisable) {
      color = activeTheme.color8
    }

    return [dateItemStyles.text, {color}]
  }, [activeTheme.color3, activeTheme.color8, isToday, isActive, isDisable])

  return (
    <Pressable style={dateItemStyles.wrapper} onPress={handleChange}>
      <View style={itemStyle}>
        <Text style={textStyle}>{item.getDate()}</Text>
      </View>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  item: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center'
  }
})

const activeItemStyle = StyleSheet.compose(styles.item, {
  backgroundColor: '#1E90FF20',
  borderRadius: 15
})

export default DateItem
