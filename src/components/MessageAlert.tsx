import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MessageAlert({title, message, isVisible}) {
    if (!isVisible) return null;
    return (
        <Alert className='z-1000 absolute p-2 w-100 bottom-5 left-5 bg-zinc-950 dark:bg-white text-slate-50'>
            <AlertTitle className="font-bold text-lg">{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}