const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function postCreateComment(id, text) {


  try {
    const response = await fetch(`${BACK_URL}/api/comment/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ text }),
      credentials: 'include',
    })

    return response.json()
    
  } catch (error) {
    console.error('Error commenting post:', error)
    return { status: 500, error: 'Error comment post' }
  }
}
