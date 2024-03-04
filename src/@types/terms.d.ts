declare interface Terms {
  terms_id: number
  type: string // 1: 서비스 이용약관 동의, 2: 개인정보 수집 및 이용동의, 3: 만 14세 이상 확인
  version: number
  url: string | null
  required: string
}
