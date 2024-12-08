import {useMemo, useCallback} from 'react'
import {StyleSheet, Text, View, Image, Pressable} from 'react-native'
import {Shadow} from 'react-native-shadow-2'
import Footer from './Footer'
import ArrowRight from '@/assets/icons/arrow_right2.svg'

import {useQueryClient} from '@tanstack/react-query'
import {useProductBackgroundDetail, useSetMyBackground} from '@/apis/hooks/useProduct'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {showPurchaseCompleteModalState} from '@/store/modal'
import {windowDimensionsState} from '@/store/system'
import {navigate} from '@/utils/navigation'

interface Props {
  id: number
}
const BackgroundDetail = ({id}: Props) => {
  const queryClient = useQueryClient()

  const {data: detail} = useProductBackgroundDetail(id)
  const {mutateAsync: setMyBackgroundMutateAsync} = useSetMyBackground()

  const windowDimensions = useRecoilValue(windowDimensionsState)
  const setShowPurchaseCompleteModal = useSetRecoilState(showPurchaseCompleteModalState)

  const imageHeight = useMemo(() => {
    return windowDimensions.height * 0.4
  }, [windowDimensions.height])

  const imageWidth = useMemo(() => {
    return imageHeight * (480 / 853)
  }, [imageHeight])

  const handlePurchase = useCallback(async () => {
    if (!detail) return

    const response = await setMyBackgroundMutateAsync({background_id: id})

    if (response.result) {
      setShowPurchaseCompleteModal(true)
      queryClient.setQueryData(['productBackgroundDetail', id], {...detail, purchased: true})
    }
  }, [detail, setMyBackgroundMutateAsync, queryClient, setShowPurchaseCompleteModal, id])

  const moveHomeCustom = useCallback(() => {
    navigate('HomeCustom')
  }, [])

  if (!detail) {
    return <></>
  }

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, {backgroundColor: detail.background_color}]}>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, {color: detail.accent_color}]}>{detail.title}</Text>
        </View>

        <Shadow startColor={'#f0eff586'}>
          <Image
            source={{uri: detail.thumb_url}}
            width={imageWidth}
            height={imageHeight}
            resizeMode="contain"
            style={styles.backgroundImage}
          />
        </Shadow>

        {detail.purchased && (
          <Pressable style={styles.moveCustomButton} onPress={moveHomeCustom}>
            <Text style={[styles.moveCustomButtonText, {color: detail.accent_color}]}>꾸미러 가기</Text>
            <ArrowRight width={18} height={18} fill={detail.accent_color} />
          </Pressable>
        )}
      </View>

      <Footer isPurchased={detail.purchased} onClick={handlePurchase} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    alignItems: 'center'
  },
  textWrapper: {
    marginTop: 50,
    marginBottom: 40
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22
  },
  backgroundImage: {
    borderWidth: 3,
    borderColor: '#ffffff',
    borderRadius: 15
  },
  moveCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 40,
    height: 52,
    paddingHorizontal: 20
  },
  moveCustomButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16
  }
})

export default BackgroundDetail
