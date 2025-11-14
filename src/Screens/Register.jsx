import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { MdVisibilityOff, MdVisibility } from 'react-icons/md'

export default function Register() {

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm({
        defaultValues: { username: '', email: '', password: '', gender: '' },
    })

    const onSubmit = async data => {
        setLoading(true)

        try {
            console.log(data)

            setTimeout(() => {
                setLoading(false)
                alert('Cuenta creada')
            }, 1200)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <h1 className="mt-10 mb-6 text-center text-3xl font-semibold text-white">
                Create an account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 text-white">
                <div>
                    <label className="mb-1 block font-medium">Username</label>

                    <Controller
                        control={control}

                        name="username"
                        rules={{ required: 'Username is required' }}
                        render={({ field }) => (
                            <input
                                {...field}
                                className="w-full rounded-lg border border-white/40 bg-gray-500/50 px-3 py-2 focus:ring-2 focus:ring-white focus:outline-none"
                                placeholder="Choose a username"
                            />
                        )}
                    />

                    {errors.username && <p className="text-sm text-red-200">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="mb-1 block font-medium">Email</label>

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
                                className="w-full rounded-lg border border-white/40 bg-gray-500/50 px-3 py-2 focus:ring-2 focus:ring-white focus:outline-none"
                                placeholder="Enter your email"
                            />
                        )}
                    />

                    {errors.email && <p className="text-sm text-red-200">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="mb-1 block font-medium">Password</label>

                    <div className="relative">
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: 'Password is required' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full rounded-lg border border-white/40 bg-gray-500/50 px-3 py-2 pr-10 focus:ring-2 focus:ring-white focus:outline-none"
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
                                <div className="mt-1 flex cursor-pointer justify-center gap-2">
                                    {['Male', 'Female', 'Other'].map(option => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                field.onChange(option)
                                                trigger('gender')
                                            }}
                                            className={`cursor-pointer rounded-lg border px-4 py-2 transition ${field.value === option
                                                ? 'bg-button border-white text-white'
                                                : 'border-white/40 text-white'
                                                }`}
                                        >
                                            {option}
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

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-button hover:bg-button/50 w-full cursor-pointer rounded-lg py-2 font-semibold transition disabled:opacity-60"
                >
                    {loading ? 'CREATING USER...' : 'Create Account'}
                </button>
            </form>
            <div className="my-6 flex w-full max-w-md items-center gap-3">
                <div className="h-px flex-1 bg-white/40"></div>
                <span className="text-white/70">or</span>
                <div className="h-px flex-1 bg-white/40"></div>
            </div>

            <button className="flex w-full max-w-md items-center justify-center gap-3 rounded-lg border border-white/40 bg-white py-2 font-semibold text-black transition">
                <img
                    className="h-6 w-6"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                />
                Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-white/80">
                By signing up, you agree to our <span className="cursor-pointer underline">Terms</span> and{' '}
                <span className="cursor-pointer underline">Privacy Policy</span>.
            </p>
            <p className="mt-3 mb-5 text-center text-white">
                Already have an account?{' '}
                <span className="text-button cursor-pointer font-bold underline">Log In</span>
            </p>
        </div>
    )
}
