import {ReactNode, createContext, useContext, useState} from 'react'
import Component from './Component'
import {AlertHandler, AlertInfo} from './types'

const AlertContext = createContext<AlertHandler | null>(null)

interface Props {
  children: ReactNode
}
export const AlertProvider = ({children}: Props) => {
  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null)

  const show = (value: AlertInfo) => {
    setAlertInfo(value)
  }
  const hide = () => {
    setAlertInfo(null)
  }

  return (
    <AlertContext.Provider value={{show, hide}}>
      {children}
      <Component value={alertInfo} onHide={hide} />
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('Alert 초기화 실패')
  }
  return context
}
