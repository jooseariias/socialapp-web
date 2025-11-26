const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function postDeleteComment(idPots, idComment) {
  try {
    const response = await fetch(`${BACK_URL}/api/comment/${idPots}/${idComment}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error delete post:', error)
    return { status: 500, error: 'Error delete post' }
  }
}
