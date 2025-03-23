import React, { ChangeEvent, useEffect, useRef, useState } from "react";

type TodoProps = {
    id: number,
    group: number,
    title: string,
    description: string,
    state: number,
    created: string,
    onEditTodo: (id: number) => void,
    onDeleteTodo: (id: number) => void
};

export default function Todo(props: TodoProps) {
    const [isOptionsActive, setIsOptionsActive] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const todoRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const todoOptions = [
        {
            name: 'Edit',
            function : () => {
                if (todoRef.current) {
                    setIsOptionsActive(false);
                    props.onEditTodo(Number(todoRef.current.id));
                };
            }
        },
        {
            name: 'Delete',
            function: () => {
                if (todoRef.current) {
                    setIsOptionsActive(false);
                    props.onDeleteTodo(Number(todoRef.current.id));
                };
            }
        }
    ];

    
    const handleOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsOptionsActive((prev) => !prev);
    };

    useEffect(() => {
        if (props.state === 2) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
                setIsOptionsActive(false);
            };
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
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

    return (
        <div
            id={`${props.id}`}
            ref={todoRef}
            className="min-h-44 w-80 relative flex flex-col p-4 border border-divider rounded-xl bg-bg hover:bg-shine">
            <h3 className="text-xl text-secondaryText">{props.title}</h3>
            <p className="text-placeholderText">{props.description}</p>
            
            <button
                className="absolute top-4 right-4 justify-self-center p-1 rounded-lg bg-transparent hover:bg-filterActive focus:bg-filterActive active:bg-filterActive"
                onClick={handleOptions}
                aria-label="More options">
                <svg className="h-5 fill-placeholderText" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                </svg>
            </button>

            {isOptionsActive && (
                <div
                    ref={optionsRef}
                    className="w-32 absolute top-1/4 right-0 z-10 flex flex-col border border-divider rounded-md bg-bg overflow-hidden">
                    {todoOptions.map((option, i) => (
                        <button
                            key={i}
                            className={` border-b border-divider last:border-none rounded-none text-secondaryText ${option.name === 'Delete' ? 'hover:bg-danger' : 'hover:bg-filterActive'} hover:text-primaryText`}
                            onClick={option.function}>
                            {option.name}
                        </button>
                    ))}
                </div>
            )}

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