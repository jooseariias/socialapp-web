// En Services/post/putPost.js
const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function putPost(id, data) {
  try {
    const response = await fetch(`${BACK_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error updating post' }))
      return {
        status: response.status,
        error: errorData.message || 'Error updating post',
      }
    }

    const result = await response.json()
    return {
      status: response.status,
      data: result.data,
      message: result.message,
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return { status: 500, error: 'Error updating post' }
  }
}
