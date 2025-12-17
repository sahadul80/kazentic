import { KazenticLogo } from "@/components/dashboard/SVGs"
import { LoginForm } from "@/components/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="grid lg:grid-cols-2 bg-white p-[24px] gap-[24px]">
            <div className="flex flex-col gap-[40px]">
                <Link href="#">
                    <KazenticLogo/>
                </Link>
                <LoginForm/>
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
