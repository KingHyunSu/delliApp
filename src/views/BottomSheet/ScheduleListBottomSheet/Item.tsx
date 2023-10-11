import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'

import DoneIcon from '@/assets/icons/done.svg'

import {getTimeOfMinute} from '@/utils/helper'
import {useRecoilState} from 'recoil'
import {scheduleListState} from '@/store/schedule'

import {Schedule} from '@/types/schedule'

interface Props {
  item: Schedule
  index: number
  onComplete: Function
}
const ScheduleListItem = ({item, index, onComplete}: Props) => {
  const [scheduleList, setScheduleList] = useRecoilState(scheduleListState)
  const isDisable = item.disable === '1'
  const isComplete = item.state === '1'
  const startTime = getTimeOfMinute(item.start_time)
  const endTime = getTimeOfMinute(item.end_time)

  const handleComplete = () => {
    if (isDisable) {
      return
    }

    const changeState = item.state === '1' ? '0' : '1'
    const data = {...item, state: changeState}

    const list = scheduleList.map((sItem, sIndex) => {
      if (index === sIndex) {
        return data
      }
      return sItem
    })

    setScheduleList(list)

    onComplete(data)
  }

  return (
    <View style={scheduleItemStyles.container}>
      <Pressable
        style={[
          scheduleItemStyles.checkBox,
          isDisable ? scheduleItemStyles.disableCheckBoxColor : scheduleItemStyles.checkBoxColor,
          isComplete && scheduleItemStyles.completeCheckBox
        ]}
        onPress={handleComplete}>
        {isComplete && <DoneIcon fill="#fff" />}
      </Pressable>

      <View style={scheduleItemStyles.textContainer}>
        <Text
          style={[
            scheduleItemStyles.titleText,
            isDisable ? scheduleItemStyles.disableTextColor : scheduleItemStyles.textColor
          ]}>
          {item.title}
        </Text>
        <Text style={[scheduleItemStyles.timeText]}>
          {`${startTime.hour} : ${startTime.minute}`} ~ {`${endTime.hour} : ${endTime.minute}`}
        </Text>
      </View>
    </View>
  )
}

const scheduleItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f6f8'
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 2
  },
  textContainer: {
    gap: 5
  },
  titleText: {
    fontWeight: 'bold'
  },
  timeText: {
    fontSize: 12,
    fontWeight: '200'
  },
  checkBoxColor: {
    borderColor: '#BABABA'
  },
  completeCheckBox: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF'
  },
  disableCheckBoxColor: {
    borderColor: '#ededed'
  },
  textColor: {
    color: '#555'
  },
  disableTextColor: {
    color: '#c3c5cc'
  }
})

export default ScheduleListItem
