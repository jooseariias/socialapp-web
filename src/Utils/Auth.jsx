import { useGoogleLogin } from '@react-oauth/google'
import { motion } from 'motion/react'
import { AiFillGoogleCircle } from 'react-icons/ai'

export default function GoogleButton() {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Login Success:', tokenResponse.access_token)
    },
    onError: () => {
      console.log('Login Failed')
    },
  })

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => login()}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-white/10"
    >
      <AiFillGoogleCircle className="text-button text-2xl" />
      <span>Continue with Google</span>
    </motion.button>
  )
}
