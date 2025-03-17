import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

type FormData = {
    username: string | null,
    email: string | null,
    password: string | null
};

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        username: null,
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
            const req = await fetch('/api/signup', {
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
        <form className="auth-form" onSubmit={handleSubmitForm}>
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
            <button type="submit">Sign Up</button>
            <Link to='/login'>I already have an account</Link>
        </form>
    );
};