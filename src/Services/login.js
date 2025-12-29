const BACK_URL = import.meta.env.VITE_BACK_URL

export default async function login(email, password) {
  try {
    const response = await fetch(`${BACK_URL}/api/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    
    })

    const data = await response.json()
    return { status: response.status, ...data }
  } catch (error) {
    console.error('Login error:', error)
    return { status: 500, error: 'Error al loguear el usuario' }
  }
}
