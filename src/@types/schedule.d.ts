import {GetCurrentScheduleListResponse} from '@/apis/types/schedule'
import {TEXT_ALIGN_TYPE, TEXT_DIRECTION_TYPE} from '@/utils/types'

export {}

declare global {
  type TextAlign = (typeof TEXT_ALIGN_TYPE)[keyof typeof TEXT_ALIGN_TYPE]
  type TextDirection = (typeof TEXT_DIRECTION_TYPE)[keyof typeof TEXT_DIRECTION_TYPE]

  interface EditScheduleForm {
    schedule_id?: number | null
    start_date: string
    end_date: string
    start_time: number
    end_time: number
    title: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
    title_x: number
    title_y: number
    title_rotate: number
    font_size: number
    text_align: TextAlign
    text_direction: TextDirection
    background_color: string
    text_color: string
  }

  interface Schedule extends GetCurrentScheduleListResponse {}

  interface ScheduleComplete {
    schedule_id: number
    schedule_complete_id?: number
    complete_date: string
    complete_start_time: number
    complete_end_time: number
  }

  interface ExistSchedule {
    schedule_id: number
    title: string
    start_time: number
    end_time: number
    start_date: string
    end_date: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
    schedule_category_title: string
  }

  interface UsedColor {
    color: string
  }

  interface FocusModeInfo {
    schedule_activity_log_id: number | null
    schedule_id: number
    seconds: number
  }

  // color theme
  interface ColorThemeItem {
    color_theme_item_id: number
    color: string
    order: number
  }
  interface ColorThemeDetail {
    is_active_color_theme: boolean
    color_theme_item_list: ColorThemeItem[]
  }
  interface EditColorThemeItem {
    color_theme_item_id: number
    color: string
    order: number
    actionType: 'I' | 'U' | 'D' | null
  }
  interface EditColorThemeDetail {
    isActiveColorTheme: boolean
    colorThemeItemList: EditColorThemeItem[]
  }
}
