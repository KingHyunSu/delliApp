import {GetScheduleColorListResponse} from '@/apis/types/color'

declare global {
  interface Color extends GetScheduleColorListResponse {}
}
