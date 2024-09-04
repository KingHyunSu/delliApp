import React from 'react'
import Panel from '@/components/Panel'
import {Image, Text, TextStyle, View, ViewStyle} from 'react-native'

interface Props {
  data: Schedule
  headerContainerStyle: ViewStyle
  headerTitleWrapper: ViewStyle
  headerLabelStyle: TextStyle
  headerTitleStyle: TextStyle
  handleExpansion: () => void
}
const CategoryPanel = ({
  data,
  headerContainerStyle,
  headerTitleWrapper,
  headerLabelStyle,
  headerTitleStyle,
  handleExpansion
}: Props) => {
  const title = React.useMemo(() => {
    return data.schedule_category_id ? data.schedule_category_title : '없음'
  }, [data.schedule_category_id, data.schedule_category_title])

  return (
    <Panel
      type="container"
      expandable={false}
      handleExpansion={handleExpansion}
      headerComponent={
        <View style={headerContainerStyle}>
          <Image source={require('@/assets/icons/folder.png')} style={{width: 24, height: 24}} />

          <View style={headerTitleWrapper}>
            <Text style={headerLabelStyle}>카테고리</Text>
            <Text style={headerTitleStyle}>{title}</Text>
          </View>
        </View>
      }
    />
  )
}

export default CategoryPanel
