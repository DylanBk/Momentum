import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type TodoProps = {
    editTodoRef: React.RefObject<HTMLDivElement>,
    todoId: number,
    groups: {
        name: string
    }[],
    onTodoEdit: () => void
};

type FormData = {
    id: number | null,
    updates: {
        group: string | null,
        title: string | null,
        description: string | null
    }
};

export default function EditTodo(props: TodoProps) {
    const [formData, setFormData] = useState<FormData>({
        id: props.todoId,
        updates: {
            group: null,
            title: null,
            description: null
        }
    });

    useEffect(() => {
        setFormData({
            id: props.todoId,
            updates: {
                group: null,
                title: null,
                description: null
            }
        });
    }, [props.todoId]);

    const handleInputChange = (e: ChangeEvent<(HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)>) => {
        const {name, value} = e.target;        

        setFormData({
            ...formData,
            updates: {
                ...formData.updates,
                [name]: value === "" ? null : value // if no group is selected then value is null
            }
        });
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setFormData({
            id: null,
            updates: {
                group: null,
                title: null,
                description: null
            }
        });

        if (props.editTodoRef.current) {
            props.editTodoRef.current.style.display = 'none';
        };
    };

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch('/api/todo/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            console.log(res)

            if (res.message) {
                const form = props.editTodoRef.current?.firstChild as HTMLFormElement;
                const success = document.createElement('p');
                
                success.classList.add('text-pine')
                success.classList.add('modal-form')
                success.textContent = 'ToDo Created Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.editTodoRef.current) {
                        success.replaceWith(form)
                        props.editTodoRef.current.style.display = 'none';
                    };
                }, 1500);
            }
        } catch(err) { 
            console.error(err);
        };
    };

    return (
        <div
        ref={props.editTodoRef}
        className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 modal-form"
                onSubmit={handleSubmitForm}>
                <h2>Edit ToDo</h2>

                { props.groups && (
                    <div className="w-full">
                        <label
                            className="text-secondaryText"
                            htmlFor="group">
                            Select A Group
                        </label>

                        <select
                            id="group"
                            name="group"
                            onChange={handleInputChange}>
                                <option value="">None</option>
                                {props.groups.map((group, i) => (
                                    <option key={i} value={group.name}>{group.name}</option>
                                ))}
                        </select>
                    </div>
                )}

                <input
                    name="title"
                    type="text"
                    placeholder="ToDo Name"
                    onChange={handleInputChange}
                    required={true}
                />

                <textarea
                    name="description"
                    placeholder="Describe your ToDo (400 characters max)"
                    maxLength={400}
                    onChange={handleInputChange}
                    required={true}
                />

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