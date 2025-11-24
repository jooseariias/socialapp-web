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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

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
    <div className="relative flex min-h-screen w-full bg-[#2b0a3d]">
      <div className="relative hidden w-1/2 flex-col justify-center pr-10 pl-14 text-white md:flex">
        <button
          onClick={() => window.history.back()}
          className="absolute top-8 left-14 z-10 flex items-center gap-2 font-medium text-white/70 transition hover:cursor-pointer hover:text-white"
        >
          <MdArrowBack size={22} />
          Back
        </button>

        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">NEVRYA</h1>

        <p className="mt-6 max-w-md text-xl text-white/80">
          Crear tu cuenta es el primer paso para entrar en la plataforma donde las personas
          importantes se conectan, crecen y construyen estatus.
        </p>

        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-[140px]" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 md:px-10">
        <h1 className="mt-10 mb-6 text-center text-3xl font-semibold text-white">
          Create an account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 text-white">
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
                      <button
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
                      </button>
                    ))}
                  </div>

                  {errors.gender && (
                    <p className="mt-1 text-center text-sm text-red-200">{errors.gender.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex flex-col items-center text-center">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-button hover:bg-button/50 w-full rounded-lg py-2 font-semibold transition disabled:opacity-60"
          >
            {loading ? 'CREATING USER...' : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex w-full max-w-md items-center gap-3">
          <div className="h-px flex-1 bg-white/40" />
          <span className="text-white/70">or</span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <button
              disabled={!field.value}
              className="flex w-full max-w-md items-center justify-center gap-3 rounded-lg border border-white/40 bg-white py-2 font-semibold text-black transition disabled:opacity-60"
              onClick={() => {
                if (!field.value) {
                  trigger('acceptTerms')
                  return
                }
                alert('Google login...')
              }}
            >
              <AiFillGoogleCircle className="text-button size-6" />
              Continue with Google
            </button>
          )}
        />

        <p className="mt-6 text-center text-sm text-white/80">
          By signing up, you agree to our <span className="cursor-pointer underline">Terms</span>{' '}
          and <span className="cursor-pointer underline">Privacy Policy</span>.
        </p>

        <p className="mt-3 mb-5 text-center text-white">
          Already have an account?{' '}
          <span className="text-button cursor-pointer font-bold underline">Log In</span>
        </p>

        <button
          onClick={() => window.history.back()}
          className="absolute bottom-6 left-6 flex items-center gap-2 text-white/70 transition hover:text-white md:hidden"
        >
          <MdArrowBack size={22} />
          Back
        </button>
      </div>
    </div>
  )
}
