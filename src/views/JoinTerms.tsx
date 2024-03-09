import React from 'react'
import {Linking, StyleSheet, SafeAreaView, ScrollView, View, Pressable, Text} from 'react-native'
import AppBar from '@/components/AppBar'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import CheckIcon from '@/assets/icons/check.svg'
import {JoinTermsNavigationProps} from '@/types/navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {useRecoilValue, useSetRecoilState} from 'recoil'
import {joinInfoState} from '@/store/auth'
import {loginState} from '@/store/system'

import {useQuery, useMutation} from '@tanstack/react-query'
import {getJoinTermsList} from '@/apis/terms'
import {join} from '@/apis/auth'

const JoinTerms = ({route, navigation}: JoinTermsNavigationProps) => {
  const joinInfo = useRecoilValue(joinInfoState)
  const setIsLogin = useSetRecoilState(loginState)

  const {data: termsList} = useQuery({
    queryKey: ['termsList'],
    queryFn: async () => {
      const params = {
        token: route.params.token
      }
      const response = await getJoinTermsList(params)

      return response.data
    },
    initialData: [],
    enabled: !!route.params.token
  })

  const joinMutation = useMutation({
    mutationFn: async (params: JoinReqeust) => {
      return await join(params)
    },
    onSuccess: async response => {
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token)
        setIsLogin(true)
      }
    }
  })

  const [isAllChecked, setIsAllChecked] = React.useState(false)
  const [checkedList, setCheckedList] = React.useState<Terms[]>([])

  const isDisabled = React.useMemo(() => {
    return checkedList.length !== termsList.length
  }, [checkedList, termsList.length])

  const containerStyle = React.useMemo(() => {
    return [styles.conatiner, !isDisabled && {backgroundColor: '#1E90FF'}]
  }, [isDisabled])

  const submitButtonStyle = React.useMemo(() => {
    return [styles.submitButton, !isDisabled && {backgroundColor: '#1E90FF'}]
  }, [isDisabled])

  const allCheckButton = React.useMemo(() => {
    return [styles.checkButton, isAllChecked && styles.activeCheckButton]
  }, [isAllChecked])

  const getIsChecked = React.useCallback(
    (item: Terms) => {
      const targetTerms = checkedList.find(terms => terms.type === item.type)

      return !!targetTerms
    },
    [checkedList]
  )

  const getCheckButtonStyle = React.useCallback(
    (item: Terms) => {
      const isChecked = getIsChecked(item)

      return [styles.checkButton, isChecked && styles.activeCheckButton]
    },
    [getIsChecked]
  )

  const handleAllChecked = React.useCallback(() => {
    const _isAllChecked = !isAllChecked

    if (_isAllChecked) {
      setCheckedList(termsList)
    } else {
      setCheckedList([])
    }

    setIsAllChecked(_isAllChecked)
  }, [isAllChecked, termsList])

  const handleChecked = React.useCallback(
    (item: Terms) => () => {
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

  const getTemrsTitle = React.useCallback((type: string) => {
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

  const moveTermsPage = React.useCallback(
    (link: string | null) => () => {
      if (link) {
        Linking.openURL(link)
      }
    },
    []
  )

  const getTermsTitleTextStyle = React.useCallback((link: string | null) => {
    if (link) {
      return [styles.checkButtonText, styles.checkButtonLink]
    }

    return styles.checkButtonText
  }, [])

  const handleSubmit = React.useCallback(() => {
    const termsAgreeList = checkedList.map(item => {
      return {terms_id: item.terms_id}
    })

    const params = {...joinInfo, terms_agree_list: termsAgreeList}

    joinMutation.mutate(params)
  }, [checkedList, joinInfo, joinMutation])

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.wrapper}>
        <AppBar>
          <View style={headerStyles.section}>
            <Pressable style={headerStyles.backButton} onPress={navigation.goBack}>
              <ArrowLeftIcon stroke="#242933" />
            </Pressable>
          </View>
        </AppBar>

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
                    <Text style={getTermsTitleTextStyle(item.url)}>{getTemrsTitle(item.type)}</Text>
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
          <Text style={styles.submitButtonText}>확인</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  conatiner: {
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
    fontSize: 28
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
    color: '#1E90FF'
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
    backgroundColor: '#D4D4D4',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: '#fff'
  }
})

const headerStyles = StyleSheet.create({
  section: {
    flex: 1
  },
  backButton: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleSection: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#000'
  }
})

export default JoinTerms
