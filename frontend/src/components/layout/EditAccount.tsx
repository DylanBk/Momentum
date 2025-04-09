import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type EditAccountProps = {
    editAccountRef: React.RefObject<HTMLDivElement>,
    formType: string,
    userData: {
        id: number | null,
        email: string | null,
        username: string | null
    },
    onEdit: () => void
};

type FormData = {
    username: string |null,
    password: string | null
} | {
    email: string | null,
    password: string | null
} | {
    newPassword: string |null,
    password: string | null
};

export default function EditAccount(props: EditAccountProps) {
    const [formData, setFormData] = useState<FormData>({
        username: null,
        password: null
    });
    const [error, setError] = useState<string>('');

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
            username: null,
            password: null
        });

        if (props.editAccountRef.current) {
            props.editAccountRef.current.style.display = 'none';
        };
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if ('username' in formData && formData.username && formData.username === props.userData.username) {
            setError('Username must be different to the current one');

            return;
        };

        if ('email' in formData && formData.email && formData.email === props.userData.email) {
            setError('Email must be different to the current one');

            return;
        };

        //TODO check password regex

        try {
            const req = await fetch('/api/user/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                const form = props.editAccountRef.current?.firstChild as HTMLFormElement;
                const success = document.createElement('p');
                
                success.classList.add('text-pine')
                success.classList.add('modal-form')
                success.textContent = 'Updated Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.editAccountRef.current) {
                        success.replaceWith(form)
                        props.editAccountRef.current.style.display = 'none';
                    };
                }, 1500);

                props.onEdit();
            } else {
                console.error(res.error)
                setError(res.error);
            };
        } catch(e) {
            console.error(e);
        };
    };

    useEffect(() => {
        console.log(props)
    }, [props])

    return (
        <div
            ref={props.editAccountRef}
            className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 modal-form"
                onSubmit={handleFormSubmit}>
                    { props.formType === 'username' ? (
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            onChange={handleInputChange}
                            required={true}
                        />
                    ) : props.formType === 'email' ? (
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                            required={true}
                        />
                    ) : (
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="New Password"
                            onChange={handleInputChange}
                            required={true}
                        />
                    )}

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
                            className="btn-confirm"
                            type="submit">
                            Confirm
                        </button>
                    </div>
            </form>
        </div>
    );
};