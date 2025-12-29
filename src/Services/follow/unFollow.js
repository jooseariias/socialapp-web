const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../../Store/useUserStore'
export async function unFollow(userId) {
  const  token  = useUserStore.getState().token
  try {
    const response = await fetch(`${BACK_URL}/api/unfollow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('unfollow user error:', error)
    return { status: 500, error: 'Error unfollow user' }
  }
}
