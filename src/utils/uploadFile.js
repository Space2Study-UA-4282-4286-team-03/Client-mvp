import { axiosClient } from '~/plugins/axiosClient'

export const uploadPhotoFile = async (photoFile) => {
  if (!photoFile) return ''
  const formData = new FormData()
  formData.append('photo', photoFile)
  try {
    const res = await axiosClient.post('/tutor/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data.photoUrl
  } catch (error) {
    console.error('Error uploading photo:', error)
    return ''
  }
}
