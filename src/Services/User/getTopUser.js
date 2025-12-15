const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function getTopUser() {
  try {
    const response = await fetch(`${BACK_URL}/api/top-followers`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    return data 
  } catch (error) {
    console.error('Error getting top user:', error)
    return { status: 500, data: null }
  }
}
