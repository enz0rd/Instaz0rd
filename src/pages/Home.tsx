import Header from "@/components/Header";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function Home() {
    document.title = "Home - Instaz0rd";
    // Obtém o valor do cookie 'token'
    const token = getCookie('token');
    
    // Verifica se o token é inválido ou não existe
    if(!token || token === undefined || token === null) {
        window.location.href = '/signin';
        return null;
    }
    
    return (
        <div className="bg-gradient-to-br h-screen from-zinc-950 via-zinc-850 to-zinc-950 text-slate-50">
            <Header />
        </div>
    )
}
