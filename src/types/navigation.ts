import type {StackScreenProps} from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Setting: undefined
}

export type HomeNavigationProps = StackScreenProps<RootStackParamList, 'Home'>
