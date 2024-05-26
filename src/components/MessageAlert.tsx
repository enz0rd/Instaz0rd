import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { MdInfoOutline } from "react-icons/md";

export default function MessageAlert({ title, message, isVisible }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
        } else {
            // Delay to allow the exit animation to complete
            const timer = setTimeout(() => setShow(false), 300); // 300ms is the duration of the exit animation
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!show) return null;

    return (
        <Alert
            className={`z-[1000] fixed items-center p-2 w-[90%] max-w-fit left-1/2 -translate-x-1/2 bg-zinc-950 dark:bg-white text-slate-50 bottom-12`}>
            <MdInfoOutline className="text-3xl fill-zinc-50" />
            <div className='ml-6'>
                <AlertTitle className="font-bold text-lg">{title}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </div>
        </Alert>
    );
}
