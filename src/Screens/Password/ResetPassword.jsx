import { MdArrowBack, MdEmail } from 'react-icons/md'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async data => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
  }

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="flex min-h-screen w-full bg-[#2b0a3d]">
      <motion.button
        whileHover={{ x: -4, opacity: 1 }}
        className="absolute top-8 left-14 z-10 flex items-center gap-2 font-medium text-white/70 transition hover:cursor-pointer hover:text-white"
        onClick={() => window.history.back()}
      >
        <MdArrowBack size={22} />
        Back
      </motion.button>
      <div className="relative hidden w-1/2 flex-col justify-center pr-10 pl-14 text-white md:flex">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">NEVRYA</h1>
        <p className="mt-6 max-w-md text-xl text-white/80">
          Recuperá tu acceso y continuá tu presencia en la red.
        </p>
        <div className="absolute top-1/2 left-0 h-82 w-82 rounded-full bg-fuchsia-500/30 blur-[100px]" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <h1 className="tracking-light text-[32px] leading-tight font-bold text-white">
              NEVRYA
            </h1>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.h2 variants={fade} className="text-[22px] font-bold text-white">
              Reset Password
            </motion.h2>

            <motion.div variants={fade} className="flex flex-col">
              <label className="pb-2 text-white">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  onKeyUp={() => trigger('password')}
                  placeholder="Enter new password"
                  className={`h-14 w-full rounded-lg border bg-white/50 pr-4 pl-4 focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.div variants={fade} className="flex flex-col">
              <label className="pb-2 text-white">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === watch('password') || 'Passwords do not match',
                  })}
                  onKeyUp={() => trigger('confirmPassword')}
                  placeholder="Confirm new password"
                  className={`h-14 w-full rounded-lg border bg-white/50 pr-4 pl-4 focus:ring-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
              )}
            </motion.div>

            <motion.button
              variants={fade}
              type="submit"
              disabled={loading}
              className="bg-button hover:bg-button/80 flex h-14 w-full items-center justify-center rounded-lg font-bold text-white transition focus:ring-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Save Password'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
