import {useCallback, useState} from 'react'
import {Keyboard, StyleSheet, View, Pressable, Text, TextInput} from 'react-native'
import AppBar from '@/components/AppBar'
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg'
import CancelIcon from '@/assets/icons/cancle.svg'

import {Goal, GoalSchedule} from '@/@types/goal'
import {CreateGoalScreenProps} from '@/types/navigation'

const CreateGoal = ({navigation}: CreateGoalScreenProps) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Goal>({
    goal_id: null,
    title: '',
    start_date: null,
    end_date: null,
    active_end_date: 0,
    state: 0,
    scheduleList: []
  })

  const getStepStyle = useCallback(
    (value: number) => {
      return value === step ? activeStepStyle : styles.step
    },
    [step]
  )

  const getStepTextStyle = useCallback(
    (value: number) => {
      return value === step ? activeStepTextStyle : styles.stepText
    },
    [step, setStep]
  )

  const handleBack = useCallback(() => {
    switch (step) {
      case 1:
        navigation.goBack()
        break
      case 2:
        setStep(1)
        break
    }
  }, [navigation, step, setStep])

  const handleNext = useCallback(() => {
    switch (step) {
      case 1:
        setStep(2)
        break
    }
  }, [step, setStep])

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <AppBar>
        <Pressable style={styles.appBarButton} onPress={handleBack}>
          <ArrowLeftIcon stroke="#424242" strokeWidth={3} />
        </Pressable>

        {step > 1 && (
          <Pressable style={styles.appBarButton}>
            <CancelIcon stroke="#424242" strokeWidth={3} />
          </Pressable>
        )}
      </AppBar>

      <View style={styles.wrapper}>
        <View style={styles.stepContainer}>
          <View style={getStepStyle(1)}>
            <Text style={getStepTextStyle(1)}>1</Text>
          </View>
          <View style={getStepStyle(2)}>
            <Text style={getStepTextStyle(2)}>2</Text>
          </View>
          <View style={getStepStyle(3)}>
            <Text style={getStepTextStyle(3)}>3</Text>
          </View>
        </View>

        {step === 1 && (
          <View>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>도전하고 싶은 목표는</Text>
              <Text style={styles.title}>무엇인가요?</Text>
            </View>

            <TextInput
              value={form.title}
              style={styles.inputText}
              placeholder="목표명을 입력해주세요"
              placeholderTextColor="#c3c5cc"
              onChangeText={(value: string) => setForm(prevState => ({...prevState, title: value}))}
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>언제부터 목표를 시작하고</Text>
              <Text style={styles.title}>언제까지 완료할 계획인가요?</Text>
            </View>
          </View>
        )}
      </View>

      <Pressable style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>다음</Text>
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 20
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  appBarButton: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10
  },
  step: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f8'
  },
  stepText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    color: '#8d9195'
  },
  titleWrapper: {
    gap: 5,
    marginBottom: 40
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    color: '#424242'
  },
  inputText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#424242'
  },
  submitButton: {
    height: 52,
    backgroundColor: '#1E90FF',
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#ffffff'
  }
})

const activeStepStyle = StyleSheet.compose(styles.step, {backgroundColor: '#1E90FF'})
const activeStepTextStyle = StyleSheet.compose(styles.stepText, {color: '#ffffff'})

export default CreateGoal
