import {memo, useCallback} from 'react'
import {ViewStyle, TextStyle, StyleSheet, Pressable, View, Text} from 'react-native'
import Panel from '@/components/Panel'
import RepeatIcon from '@/assets/icons/repeat.svg'
import {DAY_OF_WEEK} from '@/types/common'

export interface DayOfWeeks {
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}
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
  changeDayOfWeeks: (key: DayOfWeeks) => void
}
const DayOfWeekPanel = ({
  value,
  data,
  activeTheme,
  headerContainerStyle,
  headerTitleWrapper,
  headerLabelStyle,
  headerTitleStyle,
  handleExpansion,
  changeDayOfWeek,
  changeDayOfWeeks
}: Props) => {
  const getDayOfWeekSelectButtonStyle = useCallback(
    (flag: string) => {
      const borderWidth = activeTheme.theme_id === 1 ? 1 : 0
      let backgroundColor = activeTheme.color2

      if (flag === '1') {
        backgroundColor = activeTheme.color5
      }

      return [styles.dayOfWeek, {backgroundColor, borderWidth}]
    },
    [activeTheme.theme_id, activeTheme.color2, activeTheme.color5]
  )

  const controlButtonStyle = useCallback(
    (bool: boolean) => {
      const borderWidth = activeTheme.theme_id === 1 ? 1 : 0
      let backgroundColor = activeTheme.color5

      if (bool) {
        backgroundColor = '#1E90FF'
      }

      return [styles.controlButton, {backgroundColor, borderWidth}]
    },
    [activeTheme.theme_id, activeTheme.color5]
  )

  const controlButtonTextStyle = useCallback(
    (bool: boolean) => {
      let color = activeTheme.color3

      if (bool) {
        color = '#ffffff'
      }

      return [styles.controlButtonText, {color}]
    },
    [activeTheme.color3]
  )

  const handleChangeDayOfWeek = useCallback(
    (type: 'everyday' | 'weekdays' | 'weekend') => () => {
      switch (type) {
        case 'everyday':
          changeDayOfWeeks({
            mon: '1',
            tue: '1',
            wed: '1',
            thu: '1',
            fri: '1',
            sat: '1',
            sun: '1'
          })
          break
        case 'weekdays':
          changeDayOfWeeks({
            mon: '1',
            tue: '1',
            wed: '1',
            thu: '1',
            fri: '1',
            sat: '0',
            sun: '0'
          })
          break
        case 'weekend':
          changeDayOfWeeks({
            mon: '0',
            tue: '0',
            wed: '0',
            thu: '0',
            fri: '0',
            sat: '1',
            sun: '1'
          })
          break
        default:
          break
      }
    },
    [changeDayOfWeeks]
  )

  const _changeDayOfWeek = useCallback(
    (key: DAY_OF_WEEK) => () => {
      changeDayOfWeek(key)
    },
    [changeDayOfWeek]
  )

  return (
    <Panel
      type="container"
      value={value}
      contentsHeight={136}
      handleExpansion={handleExpansion}
      headerComponent={
        <View style={headerContainerStyle}>
          <RepeatIcon fill="#03cf5d" />

          <View style={headerTitleWrapper}>
            <Text style={headerLabelStyle}>요일</Text>

            <View style={styles.headerTitleContainer}>
              {data.mon === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>월</Text>}
              {data.tue === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>화</Text>}
              {data.wed === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>수</Text>}
              {data.thu === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>목</Text>}
              {data.fri === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>금</Text>}
              {data.sat === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>토</Text>}
              {data.sun === '1' && <Text style={[headerTitleStyle, {color: activeTheme.color3}]}>일</Text>}
            </View>
          </View>
        </View>
      }
      contentsComponent={
        <View style={styles.contents}>
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

          <View style={styles.controlButtonContainer}>
            <Pressable
              style={controlButtonStyle(
                data.mon === '1' &&
                  data.tue === '1' &&
                  data.wed === '1' &&
                  data.thu === '1' &&
                  data.fri === '1' &&
                  data.sat === '1' &&
                  data.sun === '1'
              )}
              onPress={handleChangeDayOfWeek('everyday')}>
              <Text
                style={controlButtonTextStyle(
                  data.mon === '1' &&
                    data.tue === '1' &&
                    data.wed === '1' &&
                    data.thu === '1' &&
                    data.fri === '1' &&
                    data.sat === '1' &&
                    data.sun === '1'
                )}>
                매일
              </Text>
            </Pressable>

            <Pressable
              style={controlButtonStyle(
                data.mon === '1' &&
                  data.tue === '1' &&
                  data.wed === '1' &&
                  data.thu === '1' &&
                  data.fri === '1' &&
                  data.sat === '0' &&
                  data.sun === '0'
              )}
              onPress={handleChangeDayOfWeek('weekdays')}>
              <Text
                style={controlButtonTextStyle(
                  data.mon === '1' &&
                    data.tue === '1' &&
                    data.wed === '1' &&
                    data.thu === '1' &&
                    data.fri === '1' &&
                    data.sat === '0' &&
                    data.sun === '0'
                )}>
                평일
              </Text>
            </Pressable>

            <Pressable
              style={controlButtonStyle(
                data.mon === '0' &&
                  data.tue === '0' &&
                  data.wed === '0' &&
                  data.thu === '0' &&
                  data.fri === '0' &&
                  data.sat === '1' &&
                  data.sun === '1'
              )}
              onPress={handleChangeDayOfWeek('weekend')}>
              <Text
                style={controlButtonTextStyle(
                  data.mon === '0' &&
                    data.tue === '0' &&
                    data.wed === '0' &&
                    data.thu === '0' &&
                    data.fri === '0' &&
                    data.sat === '1' &&
                    data.sun === '1'
                )}>
                주말
              </Text>
            </Pressable>
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    gap: 5
  },
  label: {
    marginLeft: 'auto',
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#1E90FF'
  },
  labelText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#ffffff'
  },
  contents: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButtonContainer: {
    flexDirection: 'row',
    gap: 10
  },
  controlButton: {
    height: 38,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eeeded'
  },
  controlButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16
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

export default memo(DayOfWeekPanel, (prevProps, nextProps) => {
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
})
