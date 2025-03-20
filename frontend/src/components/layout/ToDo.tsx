import { useEffect } from "react";

type TodoProps = {
    group: number,
    title: string,
    description: string,
    state: number,
    created: string
};

export default function Todo(props: TodoProps) {
    // const handleCheck = async () => {

    // };

    useEffect(() => {
        console.log('props', props)
        console.log(props.title)
    })

    return (
        <div className="h-44 w-80 relative p-4 border border-divider rounded-xl bg-bg hover:bg-shine">
            <h3 className="text-xl text-secondaryText">{props.title}</h3>
            <p className="text-placeholderText">{props.description}</p>

            <input
                className="todo-checkbox"
                type="checkbox"
            />

            <p className="absolute right-4 bottom-4 text-placeholderText">Created {props.created}</p>
        </div>
    );
};