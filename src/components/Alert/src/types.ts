export interface AlertButton {
  text: string
  backgroundColor?: string
  textColor?: string
  onPress: () => void
}

export interface AlertInfo {
  title?: string
  message?: string
  direction?: 'row' | 'column'
  buttons?: AlertButton[]
}

export interface AlertHandler {
  show: (value: AlertInfo) => void
  hide: () => void
}
