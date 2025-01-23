import http from '@/utils/http'
import {GetScheduleCompleteS3PresignedUrlRequest} from '@/apis/types/aws'

interface GetScheduleCompleteS3PresignedUrlResponse {
  main_url: string
  thumb_url: string
}
export const getScheduleCompleteS3PresignedUrl = (params: GetScheduleCompleteS3PresignedUrlRequest) => {
  return http.get<any, Response<GetScheduleCompleteS3PresignedUrlResponse>>('s3/presigned/url/schedule-complete', {
    params
  })
}
