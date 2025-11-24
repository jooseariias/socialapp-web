const BACK_URL = import.meta.env.VITE_BACK_URL

export async function postRegister(data) {
  const user = {
    name: data.username,
    email: data.email,
    password: data.password,
    gender: data.gender,
  }

  const response = await fetch(`${BACK_URL}/api/Register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(user),
  })
  const result = await response.json()
  return result
}
