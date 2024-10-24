import React from 'react'
import {TextStyle, ViewStyle, View, Text, Image} from 'react-native'
import Panel from '@/components/Panel'
import {getTimeOfMinute} from '@/utils/helper'

interface Props {
  data: Schedule
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  handleExpansion: () => void
}
const TimePanel = React.memo(
  ({data, headerContainerStyle, headerTitleWrapper, headerLabelStyle, headerTitleStyle, handleExpansion}: Props) => {
    const startTime = React.useMemo(() => {
      return getTimeOfMinute(data.start_time)
    }, [data.start_time])

    const endTime = React.useMemo(() => {
      return getTimeOfMinute(data.end_time)
    }, [data.end_time])

    return (
      <Panel
        type="container"
        expandable={false}
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
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.start_time === nextProps.data.start_time && prevProps.data.end_time === nextProps.data.end_time
    )
  }
)

export default TimePanel
