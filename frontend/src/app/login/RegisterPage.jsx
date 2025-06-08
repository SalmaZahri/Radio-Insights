
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[url('https://www.transparenttextures.com/patterns/climpek.png')] bg-center outline-gray-300 outline-dashed">
      <div className="flex flex-col gap-4 p-6 md:p-10">
       
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="../../../radio.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
