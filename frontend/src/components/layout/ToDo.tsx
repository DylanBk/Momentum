import { ChangeEvent, useEffect, useState } from "react";

type TodoProps = {
    id: number,
    group: number,
    title: string,
    description: string,
    state: number,
    created: string
};

export default function Todo(props: TodoProps) {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    useEffect(() => {
        if (props.state === 2) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        };
    }, [props.state]);

    const handleCheck = async (e: ChangeEvent<HTMLInputElement>) => {
        const id = e.target.parentElement?.id;
        const {checked} = e.target;
        let state;

        if (checked) {
            state = 2;
            setIsChecked(true);
        } else {
            state = 1;
            setIsChecked(false);
        };

        const formData = {
            id: id,
            updates: {
                state: state
            }
        };

        try {
            const res  = await fetch('/api/todo/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const req = await res.json();

            props.state = formData.updates.state;

            console.log(req)
        } catch(err) {
            console.error(err);
        };
    };

    useEffect(() => {
        console.log('props', props)
        console.log(props.title)
    })

    return (
        <div
            id={`${props.id}`}
            className="min-h-44 w-80 relative flex flex-col p-4 border border-divider rounded-xl bg-bg hover:bg-shine">
            <h3 className="text-xl text-secondaryText">{props.title}</h3>
            <p className="text-placeholderText">{props.description}</p>

            <input
                name={`${props.title}-checkbox`}
                className="todo-checkbox"
                type="checkbox"
                onChange={handleCheck}
                checked={isChecked}
            />

            <p className="absolute right-4 bottom-4 text-xs text-placeholderText">Created {props.created}</p>
        </div>
    );
};