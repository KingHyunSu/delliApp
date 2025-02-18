import {Platform, StyleSheet, Modal, Pressable, View} from 'react-native'
import {CropView} from 'react-native-image-crop-tools'
import CancelIcon from '@/assets/icons/cancle.svg'
import CheckIcon from '@/assets/icons/check.svg'
import {useRecoilValue} from 'recoil'
import {safeAreaInsetsState} from '@/store/system'
import {useCallback, useRef} from 'react'

interface Props {
  visible: boolean
  sourceUrl: string
  onCrop: (uri: string) => void
  onClose: () => void
}
const ImageCropModal = ({visible, sourceUrl, onCrop, onClose}: Props) => {
  const cropRef = useRef<CropView>(null)

  const safeAreaInsets = useRecoilValue(safeAreaInsetsState)

  const handleSave = useCallback(() => {
    cropRef.current?.saveImage(true, 100)
  }, [])

  const doCrop = useCallback(
    (result: {uri: string; width: number; height: number}) => {
      const _uri = Platform.OS === 'android' ? `file://${result.uri}` : result.uri

      onCrop(_uri)
      onClose()
    },
    [onCrop, onClose]
  )

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.container, {paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom}]}>
        <View style={styles.appBarWrapper}>
          <Pressable style={styles.button} onPress={onClose}>
            <CancelIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>

          <Pressable style={styles.button} onPress={handleSave}>
            <CheckIcon stroke="#ffffff" strokeWidth={3} />
          </Pressable>
        </View>

        <CropView
          ref={cropRef}
          sourceUrl={sourceUrl}
          style={{flex: 1, marginVertical: 10}}
          onImageCrop={doCrop}
          keepAspectRatio
          aspectRatio={{width: 500, height: 500}}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  appBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ImageCropModal
