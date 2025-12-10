const BACK_URL = import.meta.env.VITE_BACK_URL

export async function getFollowRecomend() {
  try {
    const response = await fetch(`${BACK_URL}/api/suggestions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('suggested users error:', error)
    return { status: 500, error: 'Error get suggested users' }
  }
}
