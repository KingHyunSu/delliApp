import {useState, useMemo, useCallback} from 'react'
import {Linking, StyleSheet, SafeAreaView, ScrollView, View, Pressable, Text} from 'react-native'
import AppBar from '@/components/AppBar'
import CheckIcon from '@/assets/icons/check.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useSetRecoilState} from 'recoil'
import {loginState} from '@/store/system'

import {useAccess, useGetJoinTermsList, useJoin} from '@/apis/hooks/useAuth'
import {JoinTermsScreenProps} from '@/types/navigation'
import {GetJoinTermsListResponse} from '@/apis/types/auth'

const JoinTerms = ({route}: JoinTermsScreenProps) => {
  const {data: termsList} = useGetJoinTermsList()
  const {mutateAsync: joinMutateAsync} = useJoin()
  const {mutateAsync: accessMutateAsync} = useAccess()

  const [isAllChecked, setIsAllChecked] = useState(false)
  const [checkedList, setCheckedList] = useState<GetJoinTermsListResponse[]>([])

  const setIsLogin = useSetRecoilState(loginState)

  const isDisabled = useMemo(() => {
    return checkedList.length !== termsList.length
  }, [checkedList, termsList.length])

  const containerStyle = useMemo(() => {
    return [styles.container, !isDisabled && {backgroundColor: '#1E90FF'}]
  }, [isDisabled])

  const submitButtonStyle = useMemo(() => {
    return [styles.submitButton, !isDisabled && {backgroundColor: '#1E90FF'}]
  }, [isDisabled])

  const getTermsTitleTextStyle = useCallback((link: string | null) => {
    if (link) {
      return [styles.checkButtonText, styles.checkButtonLink]
    }

    return styles.checkButtonText
  }, [])

  const allCheckButton = useMemo(() => {
    return [styles.checkButton, isAllChecked && styles.activeCheckButton]
  }, [isAllChecked])

  const getIsChecked = useCallback(
    (item: GetJoinTermsListResponse) => {
      const targetTerms = checkedList.find(terms => terms.type === item.type)

      return !!targetTerms
    },
    [checkedList]
  )

  const getCheckButtonStyle = useCallback(
    (item: GetJoinTermsListResponse) => {
      const isChecked = getIsChecked(item)

      return [styles.checkButton, isChecked && styles.activeCheckButton]
    },
    [getIsChecked]
  )

  const handleAllChecked = useCallback(() => {
    const _isAllChecked = !isAllChecked

    if (_isAllChecked) {
      setCheckedList(termsList)
    } else {
      setCheckedList([])
    }

    setIsAllChecked(_isAllChecked)
  }, [isAllChecked, termsList])

  const handleChecked = useCallback(
    (item: GetJoinTermsListResponse) => () => {
      const isChecked = getIsChecked(item)
      let _checkedList = [...checkedList]

      if (isChecked) {
        const targetTermsIndex = _checkedList.findIndex(terms => terms.type === item.type)
        _checkedList.splice(targetTermsIndex, 1)
      } else {
        _checkedList.push(item)
      }

      const _isAllChecked = termsList.length === _checkedList.length

      setIsAllChecked(_isAllChecked)
      setCheckedList(_checkedList)
    },
    [getIsChecked, termsList, checkedList]
  )

  const getTermsTitle = useCallback((type: string) => {
    switch (type) {
      case '1':
        return '서비스 이용약관 동의'
      case '2':
        return '개인정보 수집 및 이용동의'
      case '3':
        return '만 14세 이상 확인'
      case '4':
        return '개인정보 수집 및 이용 동의'
      default:
        return ''
    }
  }, [])

  const moveTermsPage = useCallback(
    (link: string | null) => () => {
      if (link) {
        Linking.openURL(link)
      }
    },
    []
  )

  const handleSubmit = useCallback(async () => {
    const termsAgreeList = checkedList.map(item => {
      return item.terms_id
    })

    const params = {
      login_type: route.params.type,
      token: route.params.token,
      terms_agree_list: termsAgreeList
    }

    const result = await joinMutateAsync(params)

    if (result.token) {
      await AsyncStorage.setItem('token', result.token)
      await accessMutateAsync()
      setIsLogin(true)
    }
  }, [checkedList, route.params.type, route.params.token, setIsLogin, joinMutateAsync, accessMutateAsync])

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.wrapper}>
        <AppBar />

        <ScrollView style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>서비스 이용을 위해</Text>
            <View style={styles.titleBox}>
              <Text style={styles.activeTitle}>약관 동의</Text>
              <Text style={styles.title}>가 필요해요</Text>
            </View>
          </View>

          <Pressable style={styles.allCheckButtonContainer} onPress={handleAllChecked}>
            <Text style={styles.allCheckButtonText}>전체 동의</Text>

            <View style={styles.checkButtonWrapper}>
              <View style={allCheckButton}>
                {isAllChecked && <CheckIcon width={16} height={16} strokeWidth={3} stroke="#fff" />}
              </View>
            </View>
          </Pressable>

          {termsList.map(item => {
            return (
              <View key={item.type} style={styles.checkButtonContainer}>
                <View style={styles.checkButtonTextWrapper}>
                  <Text style={styles.checkButtonText}>[필수]</Text>
                  <Pressable onPress={moveTermsPage(item.url)}>
                    <Text style={getTermsTitleTextStyle(item.url)}>{getTermsTitle(item.type)}</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.checkButtonWrapper} onPress={handleChecked(item)}>
                  <View style={getCheckButtonStyle(item)}>
                    {getIsChecked(item) && <CheckIcon width={16} height={16} strokeWidth={3} stroke="#fff" />}
                  </View>
                </Pressable>
              </View>
            )
          })}
        </ScrollView>

        <Pressable style={submitButtonStyle} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>시작하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4D4D4'
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingHorizontal: 16
  },
  titleContainer: {
    paddingVertical: 40,
    gap: 5,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    color: '#424242'
  },
  activeTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    color: '#1E90FF'
  },
  titleBox: {
    flexDirection: 'row'
  },
  allCheckButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f6f8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15
  },
  allCheckButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#000000'
  },

  checkButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5
  },
  checkButtonTextWrapper: {
    flexDirection: 'row',
    gap: 5
  },
  checkButtonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#424242'
  },
  checkButtonLink: {
    textDecorationLine: 'underline'
  },

  checkButtonWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center'
  },
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#eeeded',
    borderRadius: 7,
    backgroundColor: '#fff'
  },
  activeCheckButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF'
  },

  submitButton: {
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 15,
    backgroundColor: '#D4D4D4',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})

export default JoinTerms
