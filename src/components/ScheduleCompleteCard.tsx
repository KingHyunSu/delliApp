import {StyleSheet, View, Image, Text} from 'react-native'
import {useMemo} from 'react'
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
  const backCardStyle = useMemo(() => {
    let rotate = 0
    let top = 0
    let left = 0
    let padding = 15

    if (imageUrl) {
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

    if (size === 'medium') {
      padding = 5
    } else if (size === 'small') {
      padding = 1
    }

    return [styles.backCard, {padding, transform: [{rotate: `${rotate}deg`}], top, left}]
  }, [imageUrl, type, size])

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

  return (
    <View style={styles.container}>
      {/* back card */}
      {record && (
        <View style={backCardStyle}>
          <Text style={recordTextStyle}>{record}</Text>
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

          {completeCount && (
            <>
              <View style={styles.frontCardHeader}>
                <Svg width="100%" height="100%">
                  <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#333" stopOpacity="0.5" />
                      <Stop offset="0.25" stopColor="#333" stopOpacity="0.25" />
                      <Stop offset="0.5" stopColor="#333" stopOpacity="0" />
                    </LinearGradient>
                  </Defs>

                  <Rect width="100%" height="100%" fill="url(#grad)" />
                </Svg>
              </View>

              <Text style={styles.cardCountText}>{completeCount}번째 완료</Text>
            </>
          )}
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
    borderWidth: 1,
    borderColor: '#f0eff586'
  },
  frontCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0
  },
  frontCardHeader: {
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
