const BACK_URL = import.meta.env.VITE_BACK_URL
import { useUserStore } from '../Store/useUserStore'

export default async function getPostUser() {
  const  token  = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }
  try {
    const response = await fetch(`${BACK_URL}/api/GetPostUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
     
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('Login error:', error)
    return { status: 500, error: 'Error get post user' }
  }
}
