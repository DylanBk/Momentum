import { ChangeEvent, FormEvent, RefObject, useState } from "react"
import { useNavigate } from "react-router-dom";

type DeleteAccountProps = {
    deleteAccountRef: RefObject<HTMLDivElement>
};

type FormData = {
    email: string | null,
    password: string | null
}

export default function DeleteAccount(props: DeleteAccountProps) {
    const [formData, setFormData] = useState<FormData>({
        email: null,
        password: null
    });
    const [error, setError] = useState<string>('');

    const nav = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setFormData({
            email: null,
            password: null
        });

        if (props.deleteAccountRef.current) {
            (props.deleteAccountRef.current.children[0] as HTMLFormElement).reset();
            props.deleteAccountRef.current.style.display = 'none';
        };
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                document.cookie = 'loggedIn=true; expires=Jan 01 1970 00:00:00 GMT';
                nav('/login');
            } else {
                setError(res.error);
            };
        } catch(e) {
            console.error(e);
        };
    };

    return (
        <div
            ref={props.deleteAccountRef}
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="modal-form"
                onSubmit={handleFormSubmit}>
                <h3 className="text-xl text-danger">Warning</h3>
                <p className="-mt-4">All your data will be deleted permanently, this action is irreversible.</p>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    required={true}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    required={true}
                />

                <p className="!text-danger">{error}</p>

                <div className="flex flex-row gap-8">
                    <button
                        className="btn-cancel"
                        onClick={handleCancel}>
                        Cancel
                    </button>

                    <button
                        className="btn-danger1"
                        type="submit">
                        Delete Account
                    </button>
                </div>
            </form>
        </div>
    );
};