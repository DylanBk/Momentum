import { FormEvent, RefObject } from "react";
import { useNavigate } from "react-router-dom";

type LogoutAccountProps = {
    LogoutAccountRef: RefObject<HTMLDivElement>
};

export default function LogoutAccount(props: LogoutAccountProps) {
    const nav = useNavigate();

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (props.LogoutAccountRef.current) {
            props.LogoutAccountRef.current.style.display = 'none';
        };
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch('/api/logout', {
                method: 'GET'
            });
            const res = await req.json();

            if (res.message) {
                document.cookie = 'loggedIn=true; expires=Jan 01 1970 00:00:00 GMT';
                nav('/login');
            };
        } catch(e) {
            console.error(e);
        };
    };


    return (
        <div
            ref={props.LogoutAccountRef}
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="modal-form"
                onSubmit={handleFormSubmit}>
                <h3 className="text-xl text-danger">Warning</h3>
                <p className="-mt-6">Are you sure you wish to continue?</p>

                <div className="flex flex-row gap-8">
                    <button
                        className="btn-cancel"
                        onClick={handleCancel}>
                        Cancel
                    </button>

                    <button
                        className="btn-danger1"
                        type="submit">
                        Logout
                    </button>
                </div>
                </form>
        </div>
    );
};