import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

type FormData = {
    email: string | null,
    password: string | null
};

export default function Login() {
    const [formData, setFormData] = useState<FormData>({
        email: null,
        password: null,
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json()

            console.log(res);
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <>
            <title>placeholder | Login</title>

            <form className="auth-form" onSubmit={handleSubmitForm}>
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
                <button type="submit">Log In</button>
                <Link to='/signup'>I don't have an account</Link>
            </form>
        </>
    );
};