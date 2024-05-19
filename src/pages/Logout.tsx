import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Logout() {
    useEffect(() => {
        // Função para remover um cookie específico pelo nome
        const deleteCookie = (name) => {
            document.cookie = `${name}=; Max-Age=0; path=/;`;
        }

        // Remove o cookie 'token'
        deleteCookie('token');
        deleteCookie('user');

        localStorage.clear();

        // Redireciona para a página de login ou inicial
        setTimeout(() => { window.location.href = '/signin'}, 1000);
    });

    return null;
}
