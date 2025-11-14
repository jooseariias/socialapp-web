import { useForm } from "react-hook-form"
import { MdMail, MdArrowBack } from "react-icons/md"
import { useEffect, useState } from "react"

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { email: "" }
    })

    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        if (cooldown <= 0) return

        const interval = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [cooldown])

    const onSubmit = async (data) => {
        await new Promise((res) => setTimeout(res, 1200))
        alert("Reset link enviado")
        setCooldown(180) // 3 minutos
        console.log(data)
    }

    const disabled = isSubmitting || cooldown > 0

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-primary p-4 font-display">
            <div className="flex w-full max-w-md flex-col items-center">

                <div className="mb-8 flex items-center justify-center">
                    <MdMail className="text-white text-5xl" />
                    <span className="ml-2 text-3xl font-bold text-white">
                        Connect
                    </span>
                </div>
                <h1 className="text-white text-3xl font-bold tracking-tight text-center">
                    Forgot Your Password?
                </h1>

                <p className="mt-2 text-white/80 text-base text-center leading-normal max-w-sm">
                    No worries! Enter your email address below and we'll send you a link to reset it.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full space-y-6">

                    <div className="relative flex flex-col w-full">
                        <label className="mb-2 text-sm font-medium text-white/90" htmlFor="email">
                            Email Address
                        </label>

                        <div className="relative">
                            <MdMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Invalid email"
                                    }
                                })}
                                className="w-full rounded-lg border border-white/40 bg-white/10 py-3 pl-12 pr-4
                text-white placeholder-white/60 
                focus:border-white focus:ring-2 focus:ring-white/30"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={disabled}
                        className="flex hover:cursor-pointer w-full items-center justify-center rounded-lg h-12 px-5 
                                     bg-button text-primary font-bold tracking-wide
                                     transition hover:bg-white/90 disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "SENDING..."
                            : cooldown > 0
                                ? `Wait ${Math.floor(cooldown / 60)}:${String(
                                    cooldown % 60
                                ).padStart(2, "0")}`
                                : "Send Reset Link"}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
                    >
                        <MdArrowBack className="text-base" />
                        Back to Login
                    </a>
                </div>

            </div>

        </div>
    )
}
