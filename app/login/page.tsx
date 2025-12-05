
import { AppLogo } from "@/components/dashboard/SVGs"
import { LoginForm } from "@/components/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2 m-6 gap-8 max-w-[82vw] mx-auto">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-start">
                    <Link href="#" className="flex items-center gap-2 font-medium text-2xl font-semibold">
                        <div className="flex items-center justify-center rounded-sm border border-border p-2">
                            <AppLogo />
                        </div>
                        Kazentic
                    </Link>
                </div>
                <div className="flex items-center justify-start">
                    <div className="w-full">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/Frame_4.svg"
                    alt="Image"
                    className="absolute inset-0 h-auto w-full dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
