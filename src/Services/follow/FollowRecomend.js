const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../../Store/useUserStore'
export async function getFollowRecomend() {
  const  token  = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }
  try {
    const response = await fetch(`${BACK_URL}/api/suggestions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
          
      },
 
    })

    const data = await response.json()
    console.log('data', data)
    return { status: response.status, ...data }
  } catch (error) {
    console.error('suggested users error:', error)
    return { status: 500, error: 'Error get suggested users' }
  }
}
