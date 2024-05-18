export default function Home() {
    if(!document.cookie.token || document.cookie.token === 'undefined' || document.cookie.token === null) {
        window.location.href = '/signin';
        return;
    }
    
    return (
        <div>testasdasdaaaaasde</div>
    )
}
