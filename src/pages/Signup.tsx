import SignupForm from "@/components/SignupForm";
import '@/styles/Auth.css'

export default function Login() {
  return (
    <div className="flex flex-row justify-center items-center h-screen bg-zinc-950 dark:bg-white">
      <div id="container" className="flex flex-row items-center justify-center w-1/2 h-full gap-5 justify-between hidden lg:flex">
        <div id="form-items" className="flex flex-col gap-5 items-center">
            <img src="./src/assets/logo-iz0.png" alt="IZ0 logo" className="w-1/2" />
          <div className="flex flex-col w-[20rem] border-zinc-300 border-2 rounded-xl p-4 text-slate-50">
            <h1 className="text-4xl font-bold mb-4">Instaz0rd</h1>
            <p className="mb-2">make your social life simpler.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div id="form-actions"  className="flex flex-col w-[20rem] border-zinc-300 border-2 rounded-xl p-5 text-slate-50">
            <SignupForm></SignupForm>
            <small className="mt-3">
              <a href="/signin" className="text-slate-500">
                Already have an account? Sign in
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
