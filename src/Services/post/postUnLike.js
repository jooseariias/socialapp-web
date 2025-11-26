const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function postUnLike(id) {
  try {
    const response = await fetch(`${BACK_URL}/api/unlike/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error unliking post:', error)
    return { status: 500, error: 'Error unlike post' }
  }
}
