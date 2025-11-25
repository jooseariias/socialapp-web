const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function getPostUser() {
  try {
    const response = await fetch(`${BACK_URL}/api/GetPostUser`, {
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
    console.error('Login error:', error)
    return { status: 500, error: 'Error get post user' }
  }
}
