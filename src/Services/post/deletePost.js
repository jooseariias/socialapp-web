const BACK_URL = import.meta.env.VITE_BACK_URL

import { useUserStore } from '../../Store/useUserStore'

export default async function postDelete(id) {
  const token = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }
  try {
    const response = await fetch(`${BACK_URL}/api/PostsDelete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { status: 500, error: 'Error deleting post' }
  }
}
