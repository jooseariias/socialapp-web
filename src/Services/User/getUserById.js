const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function getUserById(id) {
  try {
    const response = await fetch(`${BACK_URL}/api/user/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    return data // data = { status, data }
  } catch (error) {
    console.error('Error getting user by id:', error)
    return { status: 500, data: null }
  }
}
