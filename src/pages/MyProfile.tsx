import Header from '@/components/Header';
import UserPosts from '@/components/UserPosts';
import UserProfile from '@/components/UserProfile';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getCookie } from './Home';

export default function MyProfile() {
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
            <UserProfile />
            <UserPosts /> 
        </div>
    );
}
