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
    main_path: string | null
    thumb_path: string | null
    total: number
  }

  interface EditScheduleCompleteCardForm {
    imageUrl: string | null
    record: string
  }

  interface ScheduleCompletePhotoCardText {
    index: number
    text: string
    x: number
    y: number
    rotate: number
    scale: number
    textColor: string
  }
  interface EditScheduleCompletePhotoCardForm {
    originalImageUrl: string | null
    photoCardTextList: ScheduleCompletePhotoCardText[]
  }
}
