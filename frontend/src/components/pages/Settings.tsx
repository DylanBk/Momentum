import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../layout/common/Header";
import AccountInfo from "../layout/AccountInfo";
import AccountSecurity from "../layout/AccountSecurity";
import AccountDangerZone from "../layout/AccountDangerZone";
import EditAccount from "../layout/EditAccount";
import LogoutAccount from "../layout/LogoutAccount";
import DeleteAccount from "../layout/DeleteAccount";

type UserData = {
    id: number | null,
    email: string | null,
    username: string | null
};

export default function Settings() {
    const [userData, setUserData] = useState<UserData>({
        id: null,
        email: null,
        username: null
    });
    const [formType, setFormType] = useState<string>('');

    const editAccountRef = useRef<HTMLDivElement>(null);
    const logoutAccountRef = useRef<HTMLDivElement>(null);
    const deleteAccountRef = useRef<HTMLDivElement>(null);

    const nav = useNavigate();

    useEffect(() => {
        if (!document.cookie.split(';').some((item) => item.trim().startsWith('loggedIn='))) {
            nav('/login');
        };
    });

    const getUserData = async () => {
        try {
            const req = await fetch(`${import.meta.env.VITE_API_URL}/api/user/get`, {
                method: 'GET'
            });
            const res = await req.json();

            if (res.message) {
                console.log(res.message)

                setUserData(res.data);
            } else {
                console.error(res.error);
            };
        } catch(e) {
            console.error(e);
        };
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleAccountEdit = (type: string) => {
        setFormType(type);

        if (editAccountRef.current) {
            console.log('exists')
            editAccountRef.current.style.display = 'flex';
        };
    };

    const handleEdit = () => {
        getUserData();
    };

    const handleLogout = () => {
        if (logoutAccountRef.current) {
            logoutAccountRef.current.style.display = 'flex';
        };
    };

    const handleDelete = () => {
        if (deleteAccountRef.current) {
            deleteAccountRef.current.style.display = 'flex';
        };
    };

    return (
        <div>
            <title>Momentum | Account Settings</title>

            <Header />

            <main className="flex flex-col justify-between p-4 border border-divider rounded-lg m-8">
                <AccountInfo userData={userData} onEdit={handleAccountEdit} />
                <AccountSecurity onEdit={handleAccountEdit} />
                <AccountDangerZone onLogout={handleLogout} onDelete={handleDelete} />

                <EditAccount editAccountRef={editAccountRef} formType={formType} userData={userData} onEdit={handleEdit} />
                <LogoutAccount LogoutAccountRef={logoutAccountRef} />
                <DeleteAccount deleteAccountRef={deleteAccountRef} />
            </main>
        </div>
    );
};