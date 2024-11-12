import React from 'react'
import {StyleSheet, ViewStyle, TextStyle, Pressable, Text, View} from 'react-native'
import Panel from '@/components/Panel'
import {DAY_OF_WEEK} from '@/types/common'
import RepeatIcon from '@/assets/icons/repeat.svg'

interface Props {
  value: boolean
  data: Schedule
  activeTheme: ActiveTheme
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
    activeTheme,
    headerContainerStyle,
    headerTitleWrapper,
    headerLabelStyle,
    headerTitleStyle,
    handleExpansion,
    changeDayOfWeek
  }: Props) => {
    const getDayOfWeekTitleStyle = React.useCallback(
      (flag: string) => {
        let color = activeTheme.color8

        if (flag === '1') {
          color = activeTheme.color3
        }
        return [headerTitleStyle, {color}]
      },
      [headerTitleStyle, activeTheme.color3, activeTheme.color8]
    )

    const getDayOfWeekSelectButtonStyle = React.useCallback(
      (flag: string) => {
        let backgroundColor = activeTheme.color2

        if (flag === '1') {
          backgroundColor = activeTheme.color5
        }

        return [styles.dayOfWeek, {backgroundColor}]
      },
      [activeTheme.color2, activeTheme.color5]
    )

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
        contentsHeight={78}
        handleExpansion={handleExpansion}
        headerComponent={
          <View style={headerContainerStyle}>
            <RepeatIcon fill="#03cf5d" />

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
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>월</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.tue)} onPress={_changeDayOfWeek('tue')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>화</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.wed)} onPress={_changeDayOfWeek('wed')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>수</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.thu)} onPress={_changeDayOfWeek('thu')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>목</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.fri)} onPress={_changeDayOfWeek('fri')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>금</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.sat)} onPress={_changeDayOfWeek('sat')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>토</Text>
            </Pressable>
            <Pressable style={getDayOfWeekSelectButtonStyle(data.sun)} onPress={_changeDayOfWeek('sun')}>
              <Text style={[styles.dayOfWeekText, {color: activeTheme.color3}]}>일</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20
  },
  dayOfWeek: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eeeded'
  },
  dayOfWeekText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#babfc5'
  }
})

export default DayOfWeekPanel
