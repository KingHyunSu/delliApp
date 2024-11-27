import {memo, useState, useMemo, useCallback} from 'react'
import {ViewStyle, TextStyle, Image, StyleSheet, Text, View, Pressable} from 'react-native'
import Panel from '@/components/Panel'
import DatePicker from '@/components/DatePicker'
import {format} from 'date-fns'

interface Props {
  value: boolean
  data: Schedule
  activeTheme: ActiveTheme
  displayMode: DisplayMode
  borderColor: string
  itemPanelHeight: number
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  itemHeaderLabelStyle: TextStyle
  handleExpansion: () => void
  changeStartDate: (date: string) => void
  changeEndDate: (date: string) => void
}
const DatePanel = memo(
  ({
    value,
    data,
    activeTheme,
    displayMode,
    borderColor,
    itemPanelHeight,
    headerContainerStyle,
    headerTitleWrapper,
    headerLabelStyle,
    headerTitleStyle,
    itemHeaderLabelStyle,
    handleExpansion,
    changeStartDate,
    changeEndDate
  }: Props) => {
    const datePickerHeight = 298
    const panelItemContentsHeight = datePickerHeight + 92
    const [activeDatePanelItemIndex, setActiveDatePanelItemIndex] = useState(0)

    const [startDateKey, setStartDateKey] = useState(new Date().getTime())
    const [endDateKey, setEndDateKey] = useState(new Date().getTime())

    const buttonStyle = useMemo(() => {
      const borderWidth = displayMode === 1 ? 1 : 0
      let backgroundColor = activeTheme.color5

      return [styles.button, {backgroundColor, borderWidth}]
    }, [displayMode, activeTheme.color5])

    const endDate = useMemo(() => {
      return data.end_date !== '9999-12-31' ? data.end_date : '없음'
    }, [data.end_date])

    const getDatePanelItemHeaderWrapperStyle = useCallback(
      (index: number) => {
        let backgroundColor = activeTheme.color2

        if (index === activeDatePanelItemIndex) {
          backgroundColor = '#1E90FF'
        }
        return [styles.panelItemButton, {backgroundColor}]
      },
      [activeDatePanelItemIndex, activeTheme.color2]
    )

    const getDatePanelItemHeaderTextStyle = useCallback(
      (index: number) => {
        let color = activeTheme.color3

        if (index === activeDatePanelItemIndex) {
          color = '#ffffff'
        }
        return [styles.panelItemButtonText, {color}]
      },
      [activeDatePanelItemIndex, activeTheme.color3]
    )

    const handleStartDatePanel = useCallback(() => {
      setActiveDatePanelItemIndex(0)
    }, [])

    const handleEndDatePanel = useCallback(() => {
      setActiveDatePanelItemIndex(1)
    }, [])

    const changeToday = useCallback(
      (type: 'start' | 'end') => () => {
        const currentDate = new Date()
        const today = format(currentDate, 'yyyy-MM-dd')

        if (type === 'start') {
          if (today === data.start_date) {
            setStartDateKey(currentDate.getTime())
          } else {
            changeStartDate(today)
          }
        } else if (type === 'end') {
          if (today === data.end_date) {
            setEndDateKey(currentDate.getTime())
          } else {
            changeEndDate(today)
          }
        }
      },
      [data.start_date, data.end_date, changeStartDate, changeEndDate]
    )

    const changeEndDateToStartDate = useCallback(() => {
      const currentDate = new Date()
      const today = format(currentDate, 'yyyy-MM-dd')

      if (today === data.end_date) {
        setEndDateKey(currentDate.getTime())
      } else {
        changeEndDate(data.start_date)
      }
    }, [data.start_date, data.end_date, changeEndDate])

    const changeNoDate = useCallback(() => {
      changeEndDate('9999-12-31')
    }, [changeEndDate])

    return (
      <Panel
        type="container"
        value={value}
        contentsHeight={itemPanelHeight * 2 + panelItemContentsHeight + 3} // 3 = borderWidth
        handleExpansion={handleExpansion}
        headerComponent={
          <View style={headerContainerStyle}>
            <Image source={require('@/assets/icons/calendar.png')} style={{width: 24, height: 24}} />
            <View style={headerTitleWrapper}>
              <Text style={headerLabelStyle}>기간</Text>
              <Text style={headerTitleStyle}>{`${data.start_date} ~ ${endDate}`}</Text>
            </View>
          </View>
        }
        contentsComponent={
          <View>
            {/* 시작일 */}
            <Panel
              type="item"
              value={activeDatePanelItemIndex === 0}
              headerHeight={itemPanelHeight}
              contentsHeight={panelItemContentsHeight}
              handleExpansion={handleStartDatePanel}
              headerComponent={
                <View style={[styles.panelItemHeader, {borderTopWidth: 0}]}>
                  <Text style={itemHeaderLabelStyle}>시작일</Text>

                  <View style={getDatePanelItemHeaderWrapperStyle(0)}>
                    <Text style={getDatePanelItemHeaderTextStyle(0)}>{data.start_date}</Text>
                  </View>
                </View>
              }
              contentsComponent={
                <View style={styles.panelItemContents}>
                  <DatePicker key={startDateKey} value={data.start_date} onChange={changeStartDate} />

                  <View style={styles.buttonWrapper}>
                    <Pressable style={buttonStyle} onPress={changeToday('start')}>
                      <Text style={[styles.buttonText, {color: activeTheme.color3}]}>오늘</Text>
                    </Pressable>
                  </View>
                </View>
              }
            />

            {/* 종료일 */}
            <Panel
              type="item"
              value={activeDatePanelItemIndex === 1}
              headerHeight={itemPanelHeight}
              contentsHeight={panelItemContentsHeight}
              handleExpansion={handleEndDatePanel}
              headerComponent={
                <View style={[styles.panelItemHeader, {borderTopColor: borderColor}]}>
                  <Text style={itemHeaderLabelStyle}>종료일</Text>

                  <View style={getDatePanelItemHeaderWrapperStyle(1)}>
                    <Text style={getDatePanelItemHeaderTextStyle(1)}>{endDate}</Text>
                  </View>
                </View>
              }
              contentsComponent={
                <View style={styles.panelItemContents}>
                  <DatePicker
                    key={endDateKey}
                    value={data.end_date}
                    hasNull
                    disableDate={data.start_date}
                    onChange={changeEndDate}
                  />

                  <View style={styles.buttonWrapper}>
                    <Pressable style={buttonStyle} onPress={changeToday('end')}>
                      <Text style={[styles.buttonText, {color: activeTheme.color3}]}>오늘</Text>
                    </Pressable>

                    <Pressable style={buttonStyle} onPress={changeEndDateToStartDate}>
                      <Text style={[styles.buttonText, {color: activeTheme.color3}]}>시작일</Text>
                    </Pressable>

                    <Pressable style={buttonStyle} onPress={changeNoDate}>
                      <Text style={[styles.buttonText, {color: activeTheme.color3}]}>없음</Text>
                    </Pressable>
                  </View>
                </View>
              }
            />
          </View>
        }
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.data.start_date === nextProps.data.start_date &&
      prevProps.data.end_date === nextProps.data.end_date &&
      prevProps.data.schedule_id === nextProps.data.schedule_id
    )
  }
)

const styles = StyleSheet.create({
  panelItemHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1
  },
  panelItemButton: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 7
  },
  panelItemButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: '#7c8698',
    textAlign: 'center'
  },
  panelItemContents: {
    paddingTop: 20,
    paddingBottom: 20
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 16
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderColor: '#eeeded'
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14
  }
})

export default DatePanel
