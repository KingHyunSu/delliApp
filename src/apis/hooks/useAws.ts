import {useMutation} from '@tanstack/react-query'
import * as awsApi from '@/apis/server/aws'
import {GetScheduleCompleteS3PresignedUrlRequest} from '@/apis/types/aws'

export const useGetScheduleCompleteS3PresignedUrl = () => {
  return useMutation({
    mutationFn: async (params: GetScheduleCompleteS3PresignedUrlRequest) => {
      const response = await awsApi.getScheduleCompleteS3PresignedUrl(params)

      return response.data
    }
  })
}

interface UploadImageRequest {
  url: string
  data: FormData
  contentType: string
}
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({url, data, contentType}: UploadImageRequest) => {
      console.log('data', data)
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': contentType
        },
        body: data
      })

      return response.data
    }
  })
}
