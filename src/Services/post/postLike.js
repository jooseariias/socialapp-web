const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function postLike(id) {
  try {
    const response = await fetch(`${BACK_URL}/api/like/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error liking post:', error)
    return { status: 500, error: 'Error like post' }
  }
}
