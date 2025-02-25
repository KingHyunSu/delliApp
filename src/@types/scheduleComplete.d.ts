export {}

declare global {
  interface EditScheduleCompleteForm {
    schedule_complete_id: number
    complete_date: string
    start_time: number
    end_time: number
    file_name: string | null
    record: string | null
    complete_count: number
    schedule_id: number
    photo_card_path: string | null
    total: number
  }

  interface EditScheduleCompleteCardForm {
    imageUrl: string | null
    record: string
  }

  type FontType = 'Pretendard-Regular' | 'Pretendard-Medium' | 'Pretendard-SemiBold' | 'Pretendard-Bold'
  interface ScheduleCompletePhotoCardText {
    index: number
    text: string
    x: number
    y: number
    rotate: number
    scale: number
    textColor: string
    font: FontType
  }
  interface EditScheduleCompletePhotoCardForm {
    originalImageUrl: string | null
    photoCardTextList: ScheduleCompletePhotoCardText[]
  }
}
