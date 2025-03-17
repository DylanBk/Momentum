import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="h-20 w-full flex flex-row justify-between items-center px-4 border-b border-[#242424]">
            <h1 className="text-3xl text-primaryText cursor-default">placeholder</h1>
            <nav className="flex flex-row gap-4 text-secondaryText">
                <Link className="hover:text-primaryText" to='/todo'>My Todo</Link>
                <Link className="hover:text-primaryText" to='/settings'>Settings</Link>
            </nav>
        </header>
    );
};