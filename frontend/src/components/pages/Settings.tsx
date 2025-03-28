import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../layout/common/Header";

export default function Settings() {
    const nav = useNavigate();

    useEffect(() => {
        if (!document.cookie.split(';').some((item) => item.trim().startsWith('loggedIn='))) {
            nav('/signup')
        };
    })

    return (
        <div>
            <title>Momentum | Account Settings</title>

            <Header />
            <h1 className="w-fit mx-auto text-white">Settings</h1>
        </div>
    );
};