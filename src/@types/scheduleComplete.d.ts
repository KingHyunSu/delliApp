export {}

declare global {
  interface EditScheduleCompleteForm {
    schedule_complete_id: number
    complete_date: string
    start_time: number
    end_time: number
    memo: string | null
    main_image_url: string | null
    thumb_image_url: string | null
    complete_count: number
    schedule_id: number
  }
}
