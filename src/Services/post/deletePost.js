const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function postDelete(id) {
  try {
    const response = await fetch(`${BACK_URL}/api/PostsDelete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { status: 500, error: 'Error deleting post' }
  }
}
