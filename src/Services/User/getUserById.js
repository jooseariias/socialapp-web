const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../../Store/useUserStore'

export default async function getUserById(id) {
  const token = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }

  try {
    const response = await fetch(`${BACK_URL}/api/user/${id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data // data = { status, data }
  } catch (error) {
    console.error('Error getting user by id:', error)
    return { status: 500, data: null }
  }
}
