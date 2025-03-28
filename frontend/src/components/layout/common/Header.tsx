import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        const url = window.location.href;

        if (url.includes('/signup') || url.includes('/login'))  {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        };
    }, [])

    return (
        <header className="h-20 w-full flex flex-row justify-between items-center px-4 border-b border-divider">
            <h1 className="text-4xl text-primaryText cursor-default">Momentum</h1>
            {!isAuth ? (
                <nav className="flex flex-row gap-4 text-secondaryText">
                    <Link className="hover:text-primaryText" to='/todo'>My Todo</Link>
                    <Link className="hover:text-primaryText" to='/settings'>Settings</Link>
                </nav>
            ) : (
                <></>
            )}
        </header>
    );
};