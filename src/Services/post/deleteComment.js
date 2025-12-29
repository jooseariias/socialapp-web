const BACK_URL = import.meta.env.VITE_BACK_URL

import { useUserStore } from '../../Store/useUserStore'


export default async function postDeleteComment(idComment,idPots ) {
  const token = useUserStore.getState().token
  if (!token) {
    return { status: 401, error: 'No token disponible' }
  }

  try {
    const response = await fetch(`${BACK_URL}/api/comment/${idPots}/${idComment}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
   
    })

    return { status: response.status }
  } catch (error) {
    console.error('Error delete post:', error)
    return { status: 500, error: 'Error delete post' }
  }
}
