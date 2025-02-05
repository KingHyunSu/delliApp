import {useMutation} from '@tanstack/react-query'

interface UploadImageRequest {
  url: string
  data: FormData
  contentType: string
}
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({url, data, contentType}: UploadImageRequest) => {
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
