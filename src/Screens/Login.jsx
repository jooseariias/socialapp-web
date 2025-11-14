import { useState } from "react"
import { useForm } from "react-hook-form"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"

export default function Login() {
    const { register, handleSubmit } = useForm()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        console.log("Login data:", data)

        // Simulación de request
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setLoading(false)
    }

    return (
        <div className="flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
                        SocialSphere
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <h2 className="text-white text-[22px] font-bold">Log In</h2>

                    <div className="flex flex-col">
                        <label className="pb-2 text-white">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email address"
                            className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 
                            bg-white/50 h-14 p-4 focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="pb-2 text-white">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: true })}
                                placeholder="Enter your password"
                                className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-white/50 dark:bg-white/5 h-14 p-4 pr-12 focus:ring-2 focus:ring-primary/50"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-gray-500 dark:text-gray-400"
                            >
                                {showPassword ? (
                                    <MdVisibilityOff size={24} />
                                ) : (
                                    <MdVisibility size={24} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm font-medium text-button hover:scale-105 hover:cursor-pointer">
                            Forgot Password?
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-button text-white font-bold rounded-lg hover:bg-primary/90 
                        focus:ring-2 focus:ring-primary/50 transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm font-medium text-gray-500">OR</span>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <div className="space-y-3">
                    <button className="flex w-full h-14 items-center justify-center gap-3 rounded-lg 
                    bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-gray-700">
                        <img
                            className="h-6 w-6"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIYUpPNVBCox6cgLc0_ecW1Mj7O3Jz1qDEmRigwrhP7cufHwWjjAPBlCQfhrWs_C1ZCjZqf_c-SJo8TQC8Mqx_tRSexPlQ-JK6AwovIF7NowG-e0N_PNwxEqr876RLXTYgEzvpb-hCOk0_qYgermKyW8-uXSxn9b7wVAzyovo6p_7NMMDgLmnOvtgMlIMR5X5v37fot_Fee-q52-hRyJKmHyroMTbWbU2UWHt78mPri5nQtp7J6cTDAnMcpuIohC0pQ-_OuQ5iWGI"
                            alt=""
                        />
                        <span>Continue with Google</span>
                    </button>

                    <button className="flex w-full h-14 items-center justify-center gap-3 rounded-lg 
                    bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-gray-700">
                        <img
                            className="h-6 w-6 dark:invert"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA818PIWVAaOBqjmpQ2j92HXVN9QWL3ivir2jesQ3db3pVV72FJCwVfV5TAnKQArTp3nL7dcJl7JNbxts0mRzQQtDG-q7Q8ePaWfmS0gwYHFToEZGYdW5BR-lqJizcL0EHtJgec3yDPS03xMkQp3San61h-_9JKZQtMDei6UUart3XDRhk2U7YxFfhGUNgI6eC2B4bqFSFBVGjuxcwHFWw5Ti3RWwLZAw1QkF6LJs0W_TLpBgx0mLBvA7OFnqrRRLj1JoprLT1sVVk"
                            alt=""
                        />
                        <span>Continue with Apple</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Don’t have an account?{" "}
                        <a className="font-bold text-button" href="#">
                            Sign Up
                        </a>
                    </p>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <a className="underline text-primary" href="#">
                            Terms of Service
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
