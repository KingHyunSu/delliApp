import React from 'react'
import {TextStyle, ViewStyle, View, Text} from 'react-native'
import Panel from '@/components/Panel'
import {getTimeOfMinute} from '@/utils/helper'

interface Props {
  data: Schedule
  headerContainerStyle: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  handleExpansion: () => void
}
const TimePanel = ({data, headerContainerStyle, headerLabelStyle, headerTitleStyle, handleExpansion}: Props) => {
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
          <Text style={headerLabelStyle}>시간</Text>
          <Text style={headerTitleStyle}>
            {`${startTime.meridiem} ${startTime.hour}시 ${startTime.minute}분 ~ ${endTime.meridiem} ${endTime.hour}시 ${endTime.minute}분`}
          </Text>
        </View>
      }
    />
  )
}

export default TimePanel
