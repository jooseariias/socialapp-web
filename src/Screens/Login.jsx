import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { MdEmail, MdLock } from 'react-icons/md'
import { motion } from 'motion/react'
import Google from '../Utils/Auth'
import login from '../Services/login'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'
import {Link} from 'react-router-dom'


export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [backendMessage, setBackendMessage] = useState(null)
  const [backendError, setBackendError] = useState(null)
  const navigate = useNavigate()
  const { setSession, fetchUser  ,setIsActive} = useUserStore()

  const onSubmit = async (data) => {
  setLoading(true)
  setBackendMessage(null)
  setBackendError(null)

  try {
    const result = await login(data.email, data.password) // {status, token, user}

    if (result.status === 200) {
      // Guardamos usuario y token en estado
      console.log('result', result)
      setSession({ user: result?.data?.user, token: result?.data?.token })

      // Ahora fetchUser asegura que el estado de user y isActive se actualice correctamente
       const data=  await fetchUser()
      console.log('data', data)
      // Navegamos cuando todo esté listo
      navigate('/Feed', { replace: true })
      setBackendMessage(result.message)
    } else {
      setBackendError(result.message || result.error || 'Error desconocido')
    }
  } catch (error) {
    console.error(error)
    setBackendError('Error al loguear el usuario. Intenta nuevamente.')
  } finally {
    setLoading(false)
  }
}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen w-full bg-[#2b0a3d]"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden w-1/2 flex-col justify-center pr-10 pl-14 text-white md:flex"
      >
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">NEVRYA</h1>

        <p className="mt-6 max-w-md text-xl text-white/80">
          La nueva red social donde las personas importantes se conectan, comparten y construyen
          presencia.
        </p>

        <div className="absolute top-1/2 left-0 h-82 w-82 rounded-full bg-fuchsia-500/30 blur-[100px]"></div>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center md:hidden">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="tracking-light text-[32px] leading-tight font-bold text-white"
            >
              NEVRYA
            </motion.h1>
          </div>
          {backendMessage && (
            <div className="bg-button mb-4 w-full rounded-lg p-3 text-center text-white">
              {backendMessage}
            </div>
          )}
          {backendError && (
            <div className="mb-4 w-full rounded-lg bg-red-600/80 p-3 text-center text-white">
              {backendError}
            </div>
          )}

          <motion.form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            {/* Email */}
            <div className="flex flex-col">
              <label className="pb-2 text-white">Email</label>
              <div className="relative">
                <MdEmail
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600"
                  size={22}
                />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
                  })}
                  onKeyUp={() => trigger('email')}
                  placeholder="Enter your email"
                  className={`h-14 w-full rounded-lg border bg-white/50 pr-4 pl-12 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="pb-2 text-white">Password</label>
              <div className="relative">
                <MdLock
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600"
                  size={22}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  onKeyUp={() => trigger('password')}
                  placeholder="Enter your password"
                  className={`h-14 w-full rounded-lg border bg-white/50 pr-12 pl-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-gray-500"
                >
                  {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-button flex h-14 w-full items-center justify-center rounded-lg font-bold text-white transition disabled:opacity-60"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Log In'
              )}
            </motion.button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="my-6 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm font-medium text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </motion.div>

          <Google />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <Link to='/Register' className="text-button font-bold transition-all hover:tracking-wide hover:underline hover:underline-offset-4 hover:opacity-80">
                Sign Up
             </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
