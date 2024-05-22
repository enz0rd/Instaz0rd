export default function NotFound() {
    return (
        <div className="fixed z-20 h-3/4 w-1/2 m-auto inset-x-0 inset-y-0">
            <div className="flex flex-col items-center gap-5">
                <div className="items-center flex flex-col">
                    <h1 className="text-8xl font-bold">404</h1>
                    <h3 className="text-3xl">Not Found</h3>
                </div>
                <p className="justify-self-center">Looks like you're lost, the page you're looking for doesn't exists.</p>
                <a href="/" className="">
                    <img src="./src/assets/logo-iz0.png" alt="IZ0 logo" className="hover:scale-150 duration-300 ease-out w-[4rem] mt-[7rem]" />
                </a>
            </div>
        </div>
    );
}