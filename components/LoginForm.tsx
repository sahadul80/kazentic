import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { EyeOff } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("min-h-screen flex flex-col", className)} {...props}>
            <FieldGroup className="relative gap-16">
                <Field>
                    <FieldTitle className="font-bold text-2xl">Sign in to Your Workspace</FieldTitle>
                    <FieldDescription className="text-muted-foreground text-sm text-balance">
                        Login with your existing accounts
                    </FieldDescription>
                </Field>
                <div className="flex flex-col gap-4">
                    <Field>
                        <FieldLabel htmlFor="email" ><span className="text-red-600 text-md">*</span>Email</FieldLabel>
                        <Input id="email" type="email" placeholder="name@example.com"/>
                    </Field>
                    <Field className="relative">          
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input id="password" type="password" placeholder="password"/>
                        <EyeOff className="absolute top-[56%] left-[47%] w-5 h-5"/>
                    </Field>
                    <div className="relative">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <Label >Remember me</Label>
                        </div>
                    </div>
                    <Field>
                        <Button type="submit">Sign in</Button>
                    </Field>
                    <Field>
                        <div className="flex items-start">
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <Link href="/" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </FieldDescription>
                            <a
                                href="#"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </Field>
                </div>
            </FieldGroup>
        </form>
    )
}

