const BACK_URL = import.meta.env.VITE_BACK_URL

export async function followUser(userId) {
  try {
    const response = await fetch(`${BACK_URL}/api/follow/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('follow user error:', error)
    return { status: 500, error: 'Error follow user' }
  }
}
