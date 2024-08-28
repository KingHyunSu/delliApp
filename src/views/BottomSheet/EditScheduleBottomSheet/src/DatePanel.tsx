import React from 'react'
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native'
import {format} from 'date-fns'
import Panel from '@/components/Panel'
import DatePicker from '@/components/DatePicker'
import {useRecoilValue} from 'recoil'
import {scheduleDateState} from '@/store/schedule'

interface Props {
  value: boolean
  data: Schedule
  itemPanelHeight: number
  headerContainerStyle: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  itemHeaderContainerStyle: ViewStyle
  itemHeaderLabelStyle: TextStyle
  handleExpansion: () => void
  changeStartDate: (date: string) => void
  changeEndDate: (date: string) => void
}
const DatePanel = React.memo(
  ({
    value,
    data,
    itemPanelHeight,
    headerContainerStyle,
    headerLabelStyle,
    headerTitleStyle,
    itemHeaderContainerStyle,
    itemHeaderLabelStyle,
    handleExpansion,
    changeStartDate,
    changeEndDate
  }: Props) => {
    const panelItemContentsHeight = 370
    const [activeDatePanelItemIndex, setActiveDatePanelItemIndex] = React.useState(-1)
    const scheduleDate = useRecoilValue(scheduleDateState)

    const endDate = React.useMemo(() => {
      return data.end_date !== '9999-12-31' ? data.end_date : '없음'
    }, [data.end_date])

    const startDatePanelItemHeaderWrapperStyle = React.useMemo(() => {
      return [styles.panelItemButton, activeDatePanelItemIndex === 0 && styles.panelItemActiveButton]
    }, [activeDatePanelItemIndex])

    const startDatePanelItemHeaderTextStyle = React.useMemo(() => {
      return [styles.panelItemButtonText, activeDatePanelItemIndex === 0 && styles.panelItemActiveButtonText]
    }, [activeDatePanelItemIndex])

    const endDatePanelItemHeaderWrapperStyle = React.useMemo(() => {
      return [styles.panelItemButton, activeDatePanelItemIndex === 1 && styles.panelItemActiveButton]
    }, [activeDatePanelItemIndex])

    const endDatePanelItemHeaderTextStyle = React.useMemo(() => {
      return [styles.panelItemButtonText, activeDatePanelItemIndex === 1 && styles.panelItemActiveButtonText]
    }, [activeDatePanelItemIndex])

    const handleStartDatePanel = React.useCallback(() => {
      if (data.schedule_id) {
        return
      }

      setActiveDatePanelItemIndex(0)
    }, [data.schedule_id])

    const handleEndDatePanel = React.useCallback(() => {
      setActiveDatePanelItemIndex(1)
    }, [])

    React.useEffect(() => {
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
            <Text style={headerLabelStyle}>기간</Text>
            <Text style={headerTitleStyle}>{`${data.start_date} ~ ${endDate}`}</Text>
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
                <View style={[itemHeaderContainerStyle, {borderTopWidth: 0}]}>
                  <Text style={itemHeaderLabelStyle}>시작일</Text>

                  <View style={startDatePanelItemHeaderWrapperStyle}>
                    <Text style={startDatePanelItemHeaderTextStyle}>{data.start_date}</Text>
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
                <View style={itemHeaderContainerStyle}>
                  <Text style={itemHeaderLabelStyle}>종료일</Text>

                  <View style={endDatePanelItemHeaderWrapperStyle}>
                    <Text style={endDatePanelItemHeaderTextStyle}>{endDate}</Text>
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
  panelItemButton: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#f5f6f8'
  },
  panelItemButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#7c8698',
    textAlign: 'center'
  },
  panelItemActiveButton: {
    backgroundColor: '#1E90FF',
    borderWidth: 0
  },
  panelItemActiveButtonText: {
    color: '#fff'
  },
  panelItemContents: {
    paddingTop: 20
  }
})

export default DatePanel
