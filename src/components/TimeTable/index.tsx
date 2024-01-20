import React from 'react'
import {useWindowDimensions, StyleSheet, View, Pressable, TextInput} from 'react-native'
import {Svg, G, Text, Circle} from 'react-native-svg'

import Background from './src/Background'
import SchedulePie from './src/SchedulePie'
import ScheduleText from './src/ScheduleText'
import EditScheduleText from './src/EditScheduleText'
import EditSchedulePieController from './src/EditSchedulePieController'

import {useRecoilState, useSetRecoilState} from 'recoil'
import {scheduleState} from '@/store/schedule'
import {showStyleBottomSheetState} from '@/store/bottomSheet'

import PaletteIcon from '@/assets/icons/palette.svg'

interface Props {
  data: Schedule[]
  isEdit: boolean
  titleInputRef: React.RefObject<TextInput>
  onClick: Function
}
const TimeTable = ({data, isEdit, onClick, titleInputRef}: Props) => {
  const {width, height} = useWindowDimensions()
  const x = width / 2
  const y = height * 0.28
  const fullRadius = width / 2 - 36

  const [schedule, setSchedule] = useRecoilState(scheduleState)
  const setIsShowStyleBottomSheet = useSetRecoilState(showStyleBottomSheetState)

  const radius = React.useMemo(() => {
    let result = fullRadius - (20 - (y - fullRadius - 20))

    if (result > fullRadius) {
      return fullRadius
    }

    return result
  }, [fullRadius, y])

  const handleClick = (value: Schedule) => {
    onClick(value)
  }

  const clickBackground = () => {
    if (titleInputRef && titleInputRef.current) {
      titleInputRef.current.blur()
    }
  }

  const changeSchedule = React.useCallback(
    (data: Object) => {
      setSchedule(prevState => ({
        ...prevState,
        ...data
      }))
    },
    [setSchedule]
  )

  return (
    <View>
      <Svg>
        <Background x={x} y={y} radius={radius} />

        {data.length > 0 ? (
          data.map((item, index) => {
            return <SchedulePie key={index} data={item} x={x} y={y} radius={radius} onClick={handleClick} />
          })
        ) : (
          <Text x={x} y={y} fontSize={18} fill={'#babfc5'} fontFamily={'Pretendard-Bold'} textAnchor="middle">
            터치하여 일정 추가하기
          </Text>
        )}
      </Svg>

      {data.map((item, index) => {
        return <ScheduleText key={index} data={item} centerX={x} centerY={y} radius={radius} onClick={handleClick} />
      })}

      {isEdit && (
        <Pressable style={styles.editContainer} onPress={clickBackground}>
          <Svg>
            <G x={20} y={y + radius - 10}>
              <PaletteIcon width={32} height={32} fill="#babfc5" />
              <Circle cx={15} cy={15} r={18} fill={'transparent'} onPress={() => setIsShowStyleBottomSheet(true)} />
            </G>

            <SchedulePie data={schedule} x={x} y={y} radius={radius} />
          </Svg>

          <EditScheduleText
            data={schedule}
            centerX={x}
            centerY={y}
            radius={radius}
            titleInputRef={titleInputRef}
            onChangeSchedule={changeSchedule}
          />

          <EditSchedulePieController
            data={schedule}
            scheduleList={data}
            x={x}
            y={y}
            radius={radius}
            onChangeSchedule={changeSchedule}
          />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  editContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})

export default TimeTable
