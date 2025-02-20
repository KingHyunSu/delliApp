import {StyleSheet, View, Image, Text} from 'react-native'
import {useCallback, useMemo} from 'react'
import {Shadow} from 'react-native-shadow-2'
import {Defs, LinearGradient, Rect, Stop, Svg} from 'react-native-svg'

interface Props {
  type?: 'default' | 'attach'
  size: 'small' | 'medium' | 'large'
  imageUrl: string | null
  record: string | null
  completeCount?: number
  shadowColor: string
  shadowDistance: number
  shadowOffset?: [x: string | number, y: string | number] | undefined
}
const ScheduleCompleteCard = ({
  type = 'default',
  imageUrl,
  record,
  size,
  completeCount,
  shadowColor,
  shadowDistance,
  shadowOffset = [0, 0]
}: Props) => {
  const backCardContainerStyle = useMemo(() => {
    let rotate = 0
    let top = 0
    let left = 0
    let borderWidth = 0

    if (imageUrl) {
      borderWidth = 1

      if (type === 'attach') {
        left = -2
        rotate = 3
      } else {
        top = -20
        left = -8
        rotate = -2

        if (size === 'medium') {
          top = -7
          left = -3
        } else if (size === 'small') {
          top = -5
          left = -2
        }
      }
    }

    return [styles.backCard, {transform: [{rotate: `${rotate}deg`}], top, left, borderWidth}]
  }, [imageUrl, type, size])

  const backCardWrapperStyle = useMemo(() => {
    let padding = 15

    if (size === 'medium') {
      padding = 5
    } else if (size === 'small') {
      padding = 1
    }

    return {padding}
  }, [size])

  const frontCardStyle = useMemo(() => {
    let left = 0
    let rotate = 0

    if (record) {
      if (type === 'attach') {
        left = 1
        rotate = -1
      } else {
        left = 12
        if (size === 'medium') {
          left = 3
        } else if (size === 'small') {
          left = 2
        }
      }
    }

    return [styles.frontCard, {left, transform: [{rotate: `${rotate}deg`}]}]
  }, [record, type, size])

  const recordTextStyle = useMemo(() => {
    let fontSize = 14

    if (size === 'medium') {
      fontSize = 9
    } else if (size === 'small') {
      fontSize = 5
    }

    return [styles.recordText, {fontSize}]
  }, [size])

  const getHeaderShadowComponent = useCallback((stopList: Array<{offset: string; color: string; opacity: string}>) => {
    return (
      <View style={styles.cardHeader}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              {stopList.map((item, index) => {
                return <Stop key={index} offset={item.offset} stopColor={item.color} stopOpacity={item.opacity} />
              })}
            </LinearGradient>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
    )
  }, [])

  const headerComponent = useMemo(() => {
    const headerShadowComponent = getHeaderShadowComponent([
      {offset: '0', color: '#333', opacity: '0.5'},
      {offset: '0.25', color: '#333', opacity: '0.25'},
      {offset: '0.5', color: '#333', opacity: '0'}
    ])

    return (
      <>
        {headerShadowComponent}
        <Text style={styles.cardCountText}>{completeCount}번째 완료</Text>
      </>
    )
  }, [getHeaderShadowComponent, completeCount])

  return (
    <View style={styles.container}>
      {/* back card */}
      {record && (
        <View style={backCardContainerStyle}>
          <View style={backCardWrapperStyle}>
            <Text style={recordTextStyle}>{record}</Text>
          </View>

          {!imageUrl && completeCount && (
            <>
              {getHeaderShadowComponent([
                {offset: '0', color: '#ffffff', opacity: '0.9'},
                {offset: '0.25', color: '#ffffff', opacity: '0.7'},
                {offset: '0.5', color: '#ffffff', opacity: '0.3'}
              ])}
              {headerComponent}
            </>
          )}
        </View>
      )}

      {/* front card */}
      {imageUrl && (
        <View style={frontCardStyle}>
          <Shadow
            style={styles.shadow}
            containerStyle={styles.shadowContainer}
            startColor={shadowColor}
            offset={shadowOffset}
            distance={shadowDistance}
            sides={{start: true, end: false, top: true, bottom: false}}
            corners={{topStart: true, topEnd: false, bottomStart: false, bottomEnd: false}}
            disabled={!record}
          />

          <Image source={{uri: imageUrl}} style={styles.image} />

          {completeCount && headerComponent}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 0.8
  },
  backCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    borderColor: '#f0eff586'
  },
  frontCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0
  },
  cardHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#f0eff586'
  },
  recordText: {
    fontFamily: 'Pretendard-Medium',
    color: '#000000'
  },
  cardCountText: {
    position: 'absolute',
    top: 7,
    left: 7,
    color: '#ffffff',
    fontFamily: 'Pretendard-Bold',
    fontSize: 12
  },
  shadow: {
    width: '100%',
    height: '100%'
  },
  shadowContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '91%',
    height: '96%'
  }
})

export default ScheduleCompleteCard
