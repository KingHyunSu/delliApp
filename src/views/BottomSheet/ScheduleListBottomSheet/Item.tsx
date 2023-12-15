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
  onClick: Function
}
const ScheduleListItem = ({item, index, onComplete, onClick}: Props) => {
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
    <Pressable style={styles.container} onPress={() => onClick(item)}>
      {/* <Pressable
        style={[
          styles.checkBox,
          isDisable ? styles.disableCheckBoxColor : styles.checkBoxColor,
          isComplete && styles.completeCheckBox
        ]}
        onPress={handleComplete}>
        {isComplete && <DoneIcon fill="#fff" />}
      </Pressable> */}

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.titleText,
            isComplete && styles.titleUnderline,
            isDisable ? styles.disableTextColor : styles.textColor
          ]}>
          {item.title}
        </Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeLabel}>
            <Text style={[styles.timeLabelText, {color: '#BABABA'}]}>계획</Text>
          </View>

          <Text style={styles.timeText}>
            {startTime.meridiem} {`${startTime.hour}시 ${startTime.minute}분`} - {endTime.meridiem}{' '}
            {`${endTime.hour}시 ${endTime.minute}분`}
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <View style={[styles.timeLabel, {backgroundColor: '#BABABA'}]}>
            <Text style={styles.timeLabelText}>실제</Text>
          </View>

          {index <= 1 ? (
            <Text style={styles.timeText}>
              {startTime.meridiem} {`${startTime.hour}시 ${startTime.minute}분`} - {endTime.meridiem}{' '}
              {`${endTime.hour}시 ${endTime.minute}분`}
            </Text>
          ) : (
            <Text style={[styles.timeText]}>시작전</Text>
          )}
        </View>
      </View>

      <Pressable
        style={{
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: 10,
          // justifyContent: 'center',
          // alignItems: 'center',
          backgroundColor: '#1E90FF'
        }}>
        <Text style={{color: '#fff', fontFamily: 'Pretendard-Bold'}}>시작</Text>
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeded'
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 5,
    borderWidth: 2
  },
  textContainer: {
    gap: 5
  },
  titleText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    color: '#000',
    marginBottom: 10
  },
  titleUnderline: {
    textDecorationLine: 'line-through'
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  timeLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderWidth: 1,
    borderColor: '#BABABA',
    // backgroundColor: '#BABABA',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  timeLabelText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 10,
    color: '#f5f6f8'
  },
  timeText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 12,
    color: '#000'
  },
  checkBoxColor: {
    borderColor: '#D2D2D4'
  },
  completeCheckBox: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF'
  },
  disableCheckBoxColor: {
    borderColor: '#ededed'
  },
  textColor: {
    // color: '#555'
  },
  disableTextColor: {
    color: '#c3c5cc'
  }
})

export default ScheduleListItem
