import {useState, useMemo, useCallback} from 'react'
import {StyleSheet, ScrollView, View, Pressable, Text, Image} from 'react-native'
import EditPhotoMenuBottomSheet from '@/components/bottomSheet/EditPhotoMenuBottomSheet'
import EditNicknameModal from '@/views/Profile/components/EditNicknameModal'
import SettingIcon from '@/assets/icons/setting.svg'
import EditIcon from '@/assets/icons/edit2.svg'

import ImageResizer from '@bam.tech/react-native-image-resizer'
import {useRecoilState, useRecoilValue} from 'recoil'
import {windowDimensionsState} from '@/store/system'
import {loginInfoState} from '@/store/user'
import {
  useGetProfileImageUploadUrl,
  useGetUserProfile,
  useUpdateNickname,
  useUpdateProfileImage
} from '@/apis/hooks/useUser'
import {useUploadImage} from '@/apis/hooks/useAws'

const Profile = () => {
  const {data: userProfile} = useGetUserProfile()
  const {mutateAsync: getProfileImageUploadUrlMutateAsync} = useGetProfileImageUploadUrl()
  const {mutateAsync: uploadImageMutateAsync} = useUploadImage()
  const {mutateAsync: updateProfileImageMutateAsync} = useUpdateProfileImage()
  const {mutateAsync: updateNicknameMutateAsync} = useUpdateNickname()

  const [isShowEditPhotoMenuBottomSheet, setIsShowEditPhotoMenuBottomSheet] = useState(false)
  const [isShowEditNicknameModal, setIsShowEditNicknameModal] = useState(false)

  const [loginInfo, setLoginInfo] = useRecoilState(loginInfoState)
  const windowDimensions = useRecoilValue(windowDimensionsState)

  const profileImageSize = useMemo(() => {
    return windowDimensions.width * 0.35
  }, [windowDimensions.width])

  const profileImageUrl = useMemo(() => {
    if (loginInfo?.profile_path) {
      const domain = process.env.CDN_URL
      return domain + '/' + loginInfo.profile_path
    }

    return null
  }, [loginInfo?.profile_path])

  const changePhoto = useCallback(
    async (url: string) => {
      const imageName = new Date().getTime() + '.jpeg'
      const getProfileImageUploadUrlResponse = await getProfileImageUploadUrlMutateAsync({name: imageName})

      const resizeImage = await ImageResizer.createResizedImage(url, 500, 500, 'JPEG', 1)
      const imageData = await fetch(resizeImage.uri)
      const imageBlob = await imageData.blob()

      await uploadImageMutateAsync({
        url: getProfileImageUploadUrlResponse.url,
        data: imageBlob,
        contentType: 'image/jpeg'
      })

      const updateProfileImageResponse = await updateProfileImageMutateAsync({file_name: imageName})

      // update login info
      setLoginInfo(prevState => {
        return prevState
          ? {
              ...prevState,
              profile_path: updateProfileImageResponse.profile_path
            }
          : prevState
      })

      setIsShowEditPhotoMenuBottomSheet(false)
    },
    [getProfileImageUploadUrlMutateAsync, uploadImageMutateAsync, updateProfileImageMutateAsync, setLoginInfo]
  )

  const changeNickname = useCallback(
    async (value: string) => {
      const response = await updateNicknameMutateAsync({nickname: value})

      if (response.result) {
        setLoginInfo(prevState => {
          return prevState
            ? {
                ...prevState,
                nickname: value
              }
            : prevState
        })
      }
    },
    [updateNicknameMutateAsync, setLoginInfo]
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.appBar}>
        {!isShowEditNicknameModal && (
          <Pressable style={styles.settingButton}>
            <SettingIcon fill="#424242" />
          </Pressable>
        )}
      </View>

      <View style={styles.header}>
        <Pressable
          style={{
            width: profileImageSize,
            height: profileImageSize,
            borderRadius: profileImageSize * 0.3,
            borderWidth: 2,
            borderColor: '#efefef',
            backgroundColor: '#fff'
          }}
          onPress={() => setIsShowEditPhotoMenuBottomSheet(true)}>
          <Image
            source={profileImageUrl ? {uri: profileImageUrl} : require('@/assets/images/empty.png')}
            style={{width: '100%', height: '100%', borderRadius: profileImageSize * 0.3}}
          />

          <View style={styles.editProfileImageButton}>
            <EditIcon width={14} height={14} fill="#fff" stroke="#fff" />
          </View>
        </Pressable>

        <Pressable style={styles.nicknameButton} onPress={() => setIsShowEditNicknameModal(true)}>
          {loginInfo?.nickname ? (
            <Text style={styles.nickname}>{loginInfo.nickname}</Text>
          ) : (
            <Text style={[styles.nickname, {color: '#c3c5cc'}]}>닉네임을 설정해주세요</Text>
          )}

          <EditIcon width={14} height={14} fill="#000" stroke="#000" />
        </Pressable>

        <View style={styles.scheduleInfoContainer}>
          <View style={styles.scheduleInfoWrapper}>
            <Text style={styles.scheduleInfoCountText}>{userProfile.before_start_count}</Text>
            <Text style={styles.scheduleInfoLabel}>시작전인 일정</Text>
          </View>
          <View style={styles.scheduleInfoWrapper}>
            <Text style={styles.scheduleInfoCountText}>{userProfile.in_progress_count}</Text>
            <Text style={styles.scheduleInfoLabel}>진행중인 일정</Text>
          </View>
          <View style={[styles.scheduleInfoWrapper, {borderRightWidth: 0}]}>
            <Text style={styles.scheduleInfoCountText}>{userProfile.completed_count}</Text>
            <Text style={styles.scheduleInfoLabel}>종료된 일정</Text>
          </View>
        </View>
      </View>

      <View style={{height: 10, backgroundColor: '#f5f5f5'}} />

      <View style={styles.tabContainer}>
        <Text style={styles.tabLabel}>완료 카드</Text>
      </View>

      <EditPhotoMenuBottomSheet
        visible={isShowEditPhotoMenuBottomSheet}
        crop
        onChange={changePhoto}
        onClose={() => setIsShowEditPhotoMenuBottomSheet(false)}
      />
      <EditNicknameModal
        visible={isShowEditNicknameModal}
        value={loginInfo?.nickname || ''}
        onChange={changeNickname}
        onClose={() => setIsShowEditNicknameModal(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  appBar: {
    height: 48,
    alignItems: 'flex-end'
  },
  settingButton: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    alignItems: 'center',
    gap: 10
  },
  editProfileImageButton: {
    backgroundColor: '#ddd',
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nicknameButton: {
    paddingLeft: 24,
    height: 52,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  nickname: {
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000'
  },
  scheduleInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginTop: 10,
    marginHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 20
  },
  scheduleInfoWrapper: {
    flex: 1,
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#d0d0d0'
  },
  scheduleInfoCountText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: '#000'
  },
  scheduleInfoLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#777'
  },

  tabContainer: {
    paddingVertical: 30
  },
  tabLabel: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
    paddingHorizontal: 20
  }
})

export default Profile
