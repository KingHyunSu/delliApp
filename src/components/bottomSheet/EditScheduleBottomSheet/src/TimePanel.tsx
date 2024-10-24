import React, {memo, useMemo, useState} from 'react'
import {TextStyle, ViewStyle, StyleSheet, View, Text, TextInput, Image} from 'react-native'
import Panel from '@/components/Panel'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import {getTimeOfMinute} from '@/utils/helper'

interface Props {
  value: boolean
  data: Schedule
  itemPanelHeight: number
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  itemHeaderContainerStyle: ViewStyle
  itemHeaderLabelStyle: TextStyle
  handleExpansion: () => void
}
const TimePanel = ({
  value,
  data,
  itemPanelHeight,
  headerContainerStyle,
  headerTitleWrapper,
  headerLabelStyle,
  headerTitleStyle,
  itemHeaderContainerStyle,
  itemHeaderLabelStyle,
  handleExpansion
}: Props) => {
  const panelItemContentsHeight = 82
  const [activeTimePanelItemIndex, setActiveTimePanelItemIndex] = useState(0)

  const startTime = useMemo(() => {
    return getTimeOfMinute(data.start_time)
  }, [data.start_time])

  const endTime = useMemo(() => {
    return getTimeOfMinute(data.end_time)
  }, [data.end_time])

  const startTimePanelItemButtonStyle = useMemo(() => {
    return activeTimePanelItemIndex === 0 ? activePanelItemButtonStyle : styles.panelItemButton
  }, [activeTimePanelItemIndex])

  const startTimePanelItemButtonTextStyle = useMemo(() => {
    return activeTimePanelItemIndex === 0 ? activePanelItemButtonTextStyle : styles.panelItemButtonText
  }, [activeTimePanelItemIndex])

  const endTimePanelItemButtonStyle = useMemo(() => {
    return activeTimePanelItemIndex === 1 ? activePanelItemButtonStyle : styles.panelItemButton
  }, [activeTimePanelItemIndex])

  const endTimePanelItemButtonTextStyle = useMemo(() => {
    return activeTimePanelItemIndex === 1 ? activePanelItemButtonTextStyle : styles.panelItemButtonText
  }, [activeTimePanelItemIndex])

  return (
    <Panel
      type="container"
      value={value}
      contentsHeight={itemPanelHeight * 2 + panelItemContentsHeight + 3}
      handleExpansion={handleExpansion}
      headerComponent={
        <View style={headerContainerStyle}>
          <Image source={require('@/assets/icons/time.png')} style={{width: 24, height: 24}} />

          <View style={headerTitleWrapper}>
            <Text style={headerLabelStyle}>시간</Text>
            <Text style={headerTitleStyle}>
              {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분 ~ ${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
            </Text>
          </View>
        </View>
      }
      contentsComponent={
        <View>
          {/* 시작 시간 */}
          <Panel
            type="item"
            value={activeTimePanelItemIndex === 0}
            headerHeight={itemPanelHeight}
            contentsHeight={panelItemContentsHeight}
            handleExpansion={() => setActiveTimePanelItemIndex(0)}
            headerComponent={
              <View style={[itemHeaderContainerStyle, {borderTopWidth: 0}]}>
                <Text style={itemHeaderLabelStyle}>시작 시간</Text>

                <View style={startTimePanelItemButtonStyle}>
                  <Text style={startTimePanelItemButtonTextStyle}>
                    {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분`}
                  </Text>
                </View>
              </View>
            }
            contentsComponent={
              <View style={styles.itemContentsWrapper}>
                <View style={styles.meridiemButton}>
                  <Text>오전</Text>
                  <ArrowDownIcon stroke="#424242" />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="0" placeholderTextColor="#c3c5cc" />
                  <Text>시</Text>

                  <TextInput style={styles.input} placeholder="0" placeholderTextColor="#c3c5cc" />
                  <Text>분</Text>
                </View>
              </View>
            }
          />

          {/* 종료 시간 */}
          <Panel
            type="item"
            value={activeTimePanelItemIndex === 1}
            headerHeight={itemPanelHeight}
            contentsHeight={panelItemContentsHeight}
            handleExpansion={() => setActiveTimePanelItemIndex(1)}
            headerComponent={
              <View style={itemHeaderContainerStyle}>
                <Text style={itemHeaderLabelStyle}>종료 시간</Text>

                <View style={endTimePanelItemButtonStyle}>
                  <Text style={endTimePanelItemButtonTextStyle}>
                    {`${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
                  </Text>
                </View>
              </View>
            }
          />
        </View>
      }
    />
  )
}

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
  itemContentsWrapper: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 15,
    paddingHorizontal: 10
  },
  meridiemButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 80,
    height: 52,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    gap: 7
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 10,
    paddingHorizontal: 15
  },
  input: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#424242'
  }
})

const activePanelItemButtonStyle = StyleSheet.compose(styles.panelItemButton, {
  backgroundColor: '#1E90FF',
  borderWidth: 0
})
const activePanelItemButtonTextStyle = StyleSheet.compose(styles.panelItemButtonText, {color: '#ffffff'})

export default memo(TimePanel, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.data.start_time === nextProps.data.start_time &&
    prevProps.data.end_time === nextProps.data.end_time
  )
})
