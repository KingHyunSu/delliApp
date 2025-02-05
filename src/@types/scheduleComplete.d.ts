export {}

declare global {
  interface EditScheduleCompleteForm {
    schedule_complete_id: number
    complete_date: string
    start_time: number
    end_time: number
    file_name: string | null
    memo: string | null
    complete_count: number
    schedule_id: number
    main_path: string | null
    thumb_path: string | null
  }
}
