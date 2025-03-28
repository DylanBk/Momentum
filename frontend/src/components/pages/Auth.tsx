import { useEffect, useState } from "react";

import Header from "../layout/common/Header";
import Signup from "../layout/Signup";
import Login from "../layout/Login";

type AuthProps = {
    formType: string
};

export default function Auth({formType}: AuthProps) {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        const x = formType === 'login' ? true : false;
        setIsLogin(x);
    }, [formType])

    return (
        <div>
            <Header />

            <main className="w-1/3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                { isLogin ? (
                    <Login />
                ) : (
                    <Signup />
                )}
            </main>
        </div>
    );
};