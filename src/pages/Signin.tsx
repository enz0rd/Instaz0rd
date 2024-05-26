import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import '@/styles/Auth.css'

export default function Login() {
    return (
        <div className="flex flex-row justify-center items-center h-screen bg-zinc-950 dark:bg-white">
            <div id="container" className="flex flex-row items-center justify-center w-1/2 h-full justify-between hidden lg:flex">
                <img src="./src/assets/logo-iz0.png" alt="IZ0 logo" className="w-1/2" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-[20rem] border-zinc-300 border-2 rounded-xl p-4 text-slate-50">
                    <h1 className="text-4xl font-bold mb-4">Instaz0rd</h1>
                    <p className="mb-2">make your social life simpler.</p>
                    </div>
                    <div id="form-actions" className="flex flex-col w-[20rem] border-zinc-300 border-2 rounded-xl p-4 text-slate-50">
                        <LoginForm></LoginForm>
                        <small className="mt-3">
                            <a href="/signup" className="text-slate-500">Doesn't have an account? Sign up</a>
                        </small>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}