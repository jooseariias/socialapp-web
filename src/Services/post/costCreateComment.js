const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../../Store/useUserStore'

export default async function postCreateComment(id, text) {
  const token = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }

  try {
    const response = await fetch(`${BACK_URL}/api/comment/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
      
    })

    return response.json()
    
  } catch (error) {
    console.error('Error commenting post:', error)
    return { status: 500, error: 'Error comment post' }
  }
}
