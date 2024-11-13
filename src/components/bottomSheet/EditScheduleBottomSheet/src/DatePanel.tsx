import {memo, useState, useMemo, useCallback, useEffect} from 'react'
import {ViewStyle, TextStyle, Image, StyleSheet, Text, View} from 'react-native'
import {format} from 'date-fns'
import Panel from '@/components/Panel'
import DatePicker from '@/components/DatePicker'
import {useRecoilValue} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

interface Props {
  value: boolean
  data: Schedule
  activeTheme: ActiveTheme
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
    const panelItemContentsHeight = 370
    const [activeDatePanelItemIndex, setActiveDatePanelItemIndex] = useState(-1)
    const scheduleDate = useRecoilValue(scheduleDateState)

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
      if (data.schedule_id) {
        return
      }

      setActiveDatePanelItemIndex(0)
    }, [data.schedule_id])

    const handleEndDatePanel = useCallback(() => {
      setActiveDatePanelItemIndex(1)
    }, [])

    useEffect(() => {
      if (data.schedule_id) {
        setActiveDatePanelItemIndex(1)
      } else {
        setActiveDatePanelItemIndex(0)
      }
    }, [data.schedule_id])

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
                  <DatePicker
                    value={data.start_date}
                    disableDate={format(scheduleDate, 'yyyy-MM-dd')}
                    onChange={changeStartDate}
                  />
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
                <View style={[styles.panelItemHeader, {borderTopColor: activeTheme.color2}]}>
                  <Text style={itemHeaderLabelStyle}>종료일</Text>

                  <View style={getDatePanelItemHeaderWrapperStyle(1)}>
                    <Text style={getDatePanelItemHeaderTextStyle(1)}>{endDate}</Text>
                  </View>
                </View>
              }
              contentsComponent={
                <View style={styles.panelItemContents}>
                  <DatePicker value={data.end_date} hasNull disableDate={data.start_date} onChange={changeEndDate} />
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
    borderTopWidth: 2
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
    paddingTop: 20
  }
})

export default DatePanel
