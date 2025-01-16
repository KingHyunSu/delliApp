export {}

declare global {
  interface EditScheduleCompleteForm {
    schedule_complete_id: number
    complete_date: string
    start_time: number
    end_time: number
    memo: string | null
    image_url: string | null
    complete_count: number
    schedule_id: number
    schedule_title: string
  }
}
