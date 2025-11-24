import { AiFillGoogleCircle } from 'react-icons/ai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { MdEmail, MdLock } from 'react-icons/md'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async data => {
    setLoading(true)
    console.log(data)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-[#2b0a3d]">
      <div className="hidden w-1/2 flex-col justify-center pr-10 pl-14 text-white md:flex">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">NEVRYA</h1>

        <p className="mt-6 max-w-md text-xl text-white/80">
          La nueva red social donde las personas importantes se conectan, comparten y construyen
          presencia.
        </p>

        <div className="absolute top-1/2 left-0 h-82 w-82 rounded-full bg-fuchsia-500/30 blur-[100px]"></div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <h1 className="tracking-light text-[32px] leading-tight font-bold text-white">
              NEVRYA
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <h2 className="text-[22px] font-bold text-white">Log In</h2>

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
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Invalid email address',
                    },
                  })}
                  onKeyUp={() => trigger('email')}
                  placeholder="Enter your email"
                  className={`form-input h-14 w-full rounded-lg border bg-white/50 pr-4 pl-12 focus:ring-2 dark:border-gray-700 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm font-medium text-red-300">{errors.email.message}</p>
              )}
            </div>

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
                  className={`form-input h-14 w-full rounded-lg border bg-white/50 pr-12 pl-12 focus:ring-2 dark:border-gray-700 dark:bg-white/5 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm font-medium text-red-300">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-button cursor-pointer text-sm font-medium transition-all hover:translate-x-1 hover:underline hover:underline-offset-4 hover:opacity-80">
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-button focus:ring-primary/50 hover:bg-primary/90 flex h-14 w-full items-center justify-center rounded-lg font-bold text-white transition-colors focus:ring-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm font-medium text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-white/10">
            <AiFillGoogleCircle className="text-button size-8" />
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <a
                href="#"
                className="text-button font-bold transition-all hover:tracking-wide hover:underline hover:underline-offset-4 hover:opacity-80"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
