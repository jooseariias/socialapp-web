const BACK_URL = import.meta.env.VITE_BACK_URL
import  { useUserStore } from '../../Store/useUserStore'

export default async function postLike(id) {
  const token = useUserStore.getState().token
  try {
    const response = await fetch(`${BACK_URL}/api/like/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
     
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error liking post:', error)
    return { status: 500, error: 'Error like post' }
  }
}
