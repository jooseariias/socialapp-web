import { MdMail, MdArrowBack } from 'react-icons/md'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({
    defaultValues: { email: '' },
  })

  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const interval = setInterval(() => setCooldown(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [cooldown])

  const onSubmit = async data => {
    setCooldown(180)
    setTimeout(() => {
      alert('Reset link enviado')
    }, 1200)
  }

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const disabled = isSubmitting || cooldown > 0

  return (
    <div className="flex min-h-screen w-full bg-[#2b0a3d]">
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
              Forgot Password
            </motion.h2>
            <motion.div variants={fade} className="flex flex-col">
              <label className="pb-2 text-white">Email Address</label>
              <div className="relative">
                <MdMail className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                  })}
                  onKeyUp={() => trigger('email')}
                  className={`h-14 w-full rounded-lg border bg-white/50 pr-4 pl-12 focus:ring-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}
            </motion.div>
            <motion.button
              variants={fade}
              type="submit"
              disabled={disabled}
              className="bg-button hover:bg-button/80 flex h-14 w-full items-center justify-center rounded-lg font-bold text-white transition focus:ring-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : cooldown > 0 ? (
                `Wait ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}`
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
            <motion.div variants={fade} className="mt-6 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
              >
                <MdArrowBack className="text-base" />
                Back to Login
              </a>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
