import {useMemo} from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import ArrowUpIcon from '@/assets/icons/arrow_up.svg'
import {format} from 'date-fns'

interface Props {
  data: ThemeDetail
  width: number
  height: number
}
const HomePreview1 = ({data, width, height}: Props) => {
  const containerStyle = useMemo(() => {
    return [styles.container, {width, height}]
  }, [width, height])

  const dateTextStyle = useMemo(() => {
    return [styles.dateText, {color: data.text_color}]
  }, [data.text_color])

  const bottomSheetHandlerWrapperStyle = useMemo(() => {
    return [styles.bottomSheetHandlerWrapper, {backgroundColor: data.main_color}]
  }, [data.main_color])

  const timetableSize = useMemo(() => {
    return width - 30
  }, [width])

  const dateString = useMemo(() => {
    const today = new Date()
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const dayOfWeekIndex = today.getDay()

    return format(today, 'yyyy년 MM월 dd일') + ' ' + `${weekdays[dayOfWeekIndex]}요일`
  }, [])

  return (
    <View style={containerStyle}>
      <Image style={{position: 'absolute', width, height, borderRadius: 10}} source={{uri: data.thumb_url}} />

      <Text style={dateTextStyle}>{dateString}</Text>

      <View style={styles.timetableWrapper}>
        <View
          style={{
            position: 'absolute',
            width: timetableSize,
            height: timetableSize,
            borderRadius: timetableSize,
            backgroundColor: '#f5f6f8'
          }}
        />
      </View>

      <Shadow
        style={styles.bottomSheetHandlerContainer}
        startColor="#f0eff586"
        distance={10}
        offset={[0, 3]}
        corners={{topStart: true, topEnd: true, bottomStart: false, bottomEnd: false}}
        sides={{top: true, bottom: false, start: false, end: false}}>
        <View style={bottomSheetHandlerWrapperStyle}>
          <ArrowUpIcon stroke="#999999" width={12} height={12} />
        </View>
      </Shadow>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingTop: 30,
    backgroundColor: '#fff'
  },
  dateText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 10,
    paddingHorizontal: 10
  },
  timetableWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomSheetHandlerContainer: {
    width: '100%'
  },
  bottomSheetHandlerWrapper: {
    paddingTop: 2,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  }
})

export default HomePreview1
