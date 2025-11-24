import { AiFillGoogleCircle } from 'react-icons/ai'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  MdVisibilityOff,
  MdVisibility,
  MdPerson,
  MdEmail,
  MdLock,
  MdMale,
  MdFemale,
  MdTransgender,
  MdArrowBack,
} from 'react-icons/md'
import { motion } from 'motion/react'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const fieldAnim = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      gender: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async data => {
    if (!data.acceptTerms) {
      trigger('acceptTerms')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Cuenta creada')
    }, 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-screen w-full bg-[#2b0a3d]"
    >
      <div className="relative hidden w-1/2 flex-col justify-center pr-10 pl-14 text-white md:flex">
        <motion.button
          whileHover={{ x: -4, opacity: 1 }}
          className="absolute top-8 left-14 z-10 flex items-center gap-2 font-medium text-white/70 transition hover:cursor-pointer hover:text-white"
          onClick={() => window.history.back()}
        >
          <MdArrowBack size={22} />
          Back
        </motion.button>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold tracking-tight drop-shadow-lg"
        >
          NEVRYA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 max-w-md text-xl text-white/80"
        >
          Crear tu cuenta es el primer paso para entrar en la plataforma donde las personas
          importantes se conectan, crecen y construyen estatus.
        </motion.p>

        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-[140px]" />
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 mb-6 text-center text-3xl font-semibold text-white"
        >
          Create an account
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delayChildren: 0.2,
                staggerChildren: 0.12,
              },
            },
          }}
          className="w-full max-w-md space-y-4 text-white"
        >
          <motion.div variants={fieldAnim}>
            <label className="mb-1 block font-medium">Username</label>
            <div className="relative">
              <MdPerson className="absolute top-3 left-3 text-white/70" size={22} />
              <Controller
                control={control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full rounded-lg border border-white/40 bg-gray-500/50 py-2 pr-3 pl-10 focus:ring-2 focus:ring-white focus:outline-none"
                    placeholder="Choose a username"
                  />
                )}
              />
            </div>
            {errors.username && <p className="text-sm text-red-200">{errors.username.message}</p>}
          </motion.div>
          <motion.div variants={fieldAnim}>
            <label className="mb-1 block font-medium">Email</label>
            <div className="relative">
              <MdEmail className="absolute top-3 left-3 text-white/70" size={22} />
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className="w-full rounded-lg border border-white/40 bg-gray-500/50 py-2 pr-3 pl-10 focus:ring-2 focus:ring-white focus:outline-none"
                    placeholder="Enter your email"
                  />
                )}
              />
            </div>
            {errors.email && <p className="text-sm text-red-200">{errors.email.message}</p>}
          </motion.div>
          <motion.div variants={fieldAnim}>
            <label className="mb-1 block font-medium">Password</label>
            <div className="relative">
              <MdLock className="absolute top-3 left-3 text-white/70" size={22} />
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-white/40 bg-gray-500/50 py-2 pr-10 pl-10 focus:ring-2 focus:ring-white focus:outline-none"
                    placeholder="Enter your password"
                  />
                )}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-white/70"
              >
                {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-200">{errors.password.message}</p>}
          </motion.div>
          <motion.div variants={fieldAnim}>
            <label className="mb-1 block font-medium">Gender</label>
            <Controller
              control={control}
              name="gender"
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <>
                  <div className="mt-1 flex justify-center gap-3">
                    {[
                      { label: 'Male', icon: <MdMale size={22} /> },
                      { label: 'Female', icon: <MdFemale size={22} /> },
                      { label: 'Other', icon: <MdTransgender size={22} /> },
                    ].map(option => (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        key={option.label}
                        type="button"
                        onClick={() => {
                          field.onChange(option.label)
                          trigger('gender')
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${
                          field.value === option.label
                            ? 'bg-button border-white font-bold text-white'
                            : 'border-white/40 font-semibold text-white hover:border-white'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </motion.button>
                    ))}
                  </div>

                  {errors.gender && (
                    <p className="mt-1 text-center text-sm text-red-200">{errors.gender.message}</p>
                  )}
                </>
              )}
            />
          </motion.div>
          <motion.div variants={fieldAnim} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <Controller
                control={control}
                name="acceptTerms"
                rules={{ required: 'You must accept the Terms & Conditions' }}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                    className="accent-button h-5 w-5 cursor-pointer"
                  />
                )}
              />

              <p className="text-white/90">
                I accept the <span className="text-button cursor-pointer underline">Terms</span> and{' '}
                <span className="text-button cursor-pointer underline">Privacy Policy</span>.
              </p>
            </div>

            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-200">{errors.acceptTerms.message}</p>
            )}
          </motion.div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="bg-button hover:bg-button/50 w-full rounded-lg py-2 font-semibold transition disabled:opacity-60"
          >
            {loading ? 'CREATING USER...' : 'Create Account'}
          </motion.button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w/full my-6 flex max-w-md items-center gap-3"
        >
          <div className="h-px flex-1 bg-white/40" />
          <span className="text-white/70">or</span>
          <div className="h-px flex-1 bg-white/40" />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full max-w-md items-center justify-center gap-3 rounded-lg border border-white/40 bg-white py-2 font-semibold text-black transition"
          onClick={() => alert('Google login...')}
        >
          <AiFillGoogleCircle className="text-button size-6" />
          Continue with Google
        </motion.button>

        <p className="mt-6 text-center text-sm text-white/80">
          By signing up, you agree to our <span className="cursor-pointer underline">Terms</span>{' '}
          and <span className="cursor-pointer underline">Privacy Policy</span>.
        </p>

        <p className="mt-3 mb-5 text-center text-white">
          Already have an account?{' '}
          <span className="text-button cursor-pointer font-bold underline">Log In</span>
        </p>

        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => window.history.back()}
          className="absolute bottom-6 left-6 flex items-center gap-2 text-white/70 transition hover:text-white md:hidden"
        >
          <MdArrowBack size={22} />
          Back
        </motion.button>
      </div>
    </motion.div>
  )
}
