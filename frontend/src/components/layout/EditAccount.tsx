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
        setError('');

    
        if (props.editAccountRef.current) {
            (props.editAccountRef.current.children[0] as HTMLFormElement).reset();
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

        if ('newPassword' in formData && formData.newPassword) {
            // min 8 chars, min 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~]{8,}$/;

            if (!regex.test(formData.newPassword!)) {
                setError('Password must be a mix of letters (upper and lowercase), numbers and special characters')

                return;
            };
        };

        setError('');

        try {
            const req = await fetch('/api/user/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                if (props.editAccountRef.current) {
                    const form = props.editAccountRef.current.children[0] as HTMLFormElement;
                    const success = document.createElement('p') as HTMLParagraphElement;
                    
                    success.classList.add('text-pine')
                    success.classList.add('modal-form')
                    success.textContent = 'Updated Successfully!';

                    form.reset();
                    form.replaceWith(success);

                    setTimeout(() => {
                        success.replaceWith(form)
                        form.parentElement!.style.display = 'none';
                    }, 1000);
                };

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
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
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