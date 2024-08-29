import React from 'react'
import {StyleSheet, ViewStyle, TextStyle, Pressable, Text, View, Image} from 'react-native'
import Panel from '@/components/Panel'
import {DAY_OF_WEEK} from '@/types/common'

interface Props {
  value: boolean
  data: Schedule
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  handleExpansion: () => void
  changeDayOfWeek: (key: DAY_OF_WEEK) => void
}
const DayOfWeekPanel = React.memo(
  ({
    value,
    data,
    headerContainerStyle,
    headerTitleWrapper,
    headerLabelStyle,
    headerTitleStyle,
    handleExpansion,
    changeDayOfWeek
  }: Props) => {
    const getDayOfWeekTitleStyle = React.useCallback((flag: string) => {
      let dayOfWeekTitleStyle: TextStyle[] = [headerTitleStyle, styles.disableDayOfWeekText]

      if (flag === '1') {
        dayOfWeekTitleStyle = [...dayOfWeekTitleStyle, styles.activeDayOfWeekText]
      }

      return dayOfWeekTitleStyle
    }, [])

    const getDayOfWeekSelectButtonStyle = React.useCallback((flag: string) => {
      let dayOfWeekSelectButtonStyle: ViewStyle[] = [styles.dayOfWeek]

      if (flag === '1') {
        dayOfWeekSelectButtonStyle = [...dayOfWeekSelectButtonStyle, styles.activeDayOfWeek]
      }

      return dayOfWeekSelectButtonStyle
    }, [])

    const getDayOfWeekSelectButtonTextStyle = React.useCallback((flag: string) => {
      let dayOfWeekSelectButtonTextStyle: TextStyle[] = [styles.dayOfWeekText]

      if (flag === '1') {
        dayOfWeekSelectButtonTextStyle = [...dayOfWeekSelectButtonTextStyle, styles.activeDayOfWeekText]
      }

      return dayOfWeekSelectButtonTextStyle
    }, [])

    const _changeDayOfWeek = React.useCallback(
      (key: DAY_OF_WEEK) => () => {
        changeDayOfWeek(key)
      },
      [changeDayOfWeek]
    )

    return (
      <Panel
        type="container"
        value={value}
        contentsHeight={77}
        handleExpansion={handleExpansion}
        headerComponent={
          <View style={headerContainerStyle}>
            <Image source={require('@/assets/icons/dayOfWeek.png')} style={{width: 24, height: 24}} />

            <View style={headerTitleWrapper}>
              <Text style={headerLabelStyle}>요일</Text>
              <View style={styles.headerTitleContainer}>
                <Text style={getDayOfWeekTitleStyle(data.mon)}>월</Text>
                <Text style={getDayOfWeekTitleStyle(data.tue)}>화</Text>
                <Text style={getDayOfWeekTitleStyle(data.wed)}>수</Text>
                <Text style={getDayOfWeekTitleStyle(data.thu)}>목</Text>
                <Text style={getDayOfWeekTitleStyle(data.fri)}>금</Text>
                <Text style={getDayOfWeekTitleStyle(data.sat)}>토</Text>
                <Text style={getDayOfWeekTitleStyle(data.sun)}>일</Text>
              </View>
            </View>
          </View>
        }
        contentsComponent={
          <View style={styles.dayOfWeekContainer}>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.mon)} onPress={_changeDayOfWeek('mon')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.mon)}>월</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.tue)} onPress={_changeDayOfWeek('tue')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.tue)}>화</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.wed)} onPress={_changeDayOfWeek('wed')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.wed)}>수</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.thu)} onPress={_changeDayOfWeek('thu')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.thu)}>목</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.fri)} onPress={_changeDayOfWeek('fri')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.fri)}>금</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.sat)} onPress={_changeDayOfWeek('sat')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.sat)}>토</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.sun)} onPress={_changeDayOfWeek('sun')}>
              <Text style={getDayOfWeekSelectButtonTextStyle(data.sun)}>일</Text>
            </Pressable>
          </View>
        }
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.data.mon === nextProps.data.mon &&
      prevProps.data.tue === nextProps.data.tue &&
      prevProps.data.wed === nextProps.data.wed &&
      prevProps.data.thu === nextProps.data.thu &&
      prevProps.data.fri === nextProps.data.fri &&
      prevProps.data.sat === nextProps.data.sat &&
      prevProps.data.sun === nextProps.data.sun
    )
  }
)

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    gap: 5
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 16,
    paddingTop: 20
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 36,
    height: 36
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#babfc5'
  },
  activeDayOfWeekText: {
    color: '#1E90FF'
  },
  disableDayOfWeekText: {
    color: '#babfc5'
  },
  activeDayOfWeek: {
    borderColor: '#424242'
  }
})

export default DayOfWeekPanel
