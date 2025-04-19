import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
    username: string | null,
    email: string | null,
    password: string | null
};

export default function Signup() {
    const nav = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        username: null,
        email: null,
        password: null,
    });
    const [error, setError] = useState<string>('');

    const signupRef = useRef<HTMLFormElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('api:', import.meta.env.VITE_API_URL);

        // min 8 chars, min 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~]{8,}$/;

        if (!regex.test(formData.password!)) {
            setError('Password must be a mix of letters (upper and lowercase), numbers and special characters')

            return;
        };

        try {
            const req = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json()

            if (res.message) {
                setFormData({
                    username: null,
                    email: null,
                    password: null
                });
                setError('')

                signupRef.current?.reset();

                nav('/login');
            } else {
                setError(res.error);
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <>
            <title>Momentum | Sign Up</title>

            <form
                ref={signupRef}
                className="auth-form"
                onSubmit={handleSubmitForm}>
                <label className="absolute invisible" htmlFor="username">Username</label>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleInputChange}
                    required={true}
                />
                <label className="absolute invisible" htmlFor="email">Email Address</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    required={true}
                />
                <label className="absolute invisible" htmlFor="password">Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                />
                <p className="-my-4 text-red-600">{error}</p>
                <button type="submit">Sign Up</button>
                <Link to='/login'>I already have an account</Link>
            </form>
        </>
    );
};