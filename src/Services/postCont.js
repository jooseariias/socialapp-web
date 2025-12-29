const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../Store/useUserStore'

export default async function createPost(Content, Image) {
  const token = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }
  try {
    const formData = new FormData()

    if (Content) formData.append('content', Content)
    if (Image) formData.append('image', Image)

    const response = await fetch(`${BACK_URL}/api/CreatePost`, {
      method: 'POST',
      body: formData,
      headers: {
     
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('Error creating post:', error)
    return { status: 500, error: 'Error creating post' }
  }
}
