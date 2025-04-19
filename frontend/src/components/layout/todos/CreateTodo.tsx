import { ChangeEvent, FormEvent, RefObject, useState } from "react";

type Group = {
    name: string
};

type CreateTodoProps = {
    createTodoRef: RefObject<HTMLDivElement>,
    groups: Group[],
    onCreate: () => void
};

type FormData = {
    group: string | null
    title: string | null,
    description: string | null
};

export default function CreateTodo(props: CreateTodoProps) {
    const [formData, setFormData] = useState<FormData>({
        group: null,
        title: null,
        description: null
    });

    const handleInputChange = (e: ChangeEvent<(HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement)>) => {
        const {name, value} = e.target;        

        setFormData({
            ...formData,
            [name]: value === "" ? null: value // if no group is selected then value is null
        });
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setFormData({
            group: null,
            title: null,
            description: null
        });

        if (props.createTodoRef.current) {
            (props.createTodoRef.current.children[0] as HTMLFormElement).reset();
            props.createTodoRef.current.style.display = 'none';
        };
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.group === undefined) {
            setFormData({
                ...formData,
                group: '_',
            });
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/todo/new`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const req = await res.json();

            if (req.message) {
                if (props.createTodoRef.current) {
                    const form = props.createTodoRef.current.children[0] as HTMLFormElement;
                    const success = document.createElement('p') as HTMLParagraphElement;
                    
                    success.classList.add('text-pine')
                    success.classList.add('modal-form')
                    success.textContent = 'ToDo Created Successfully!';

                    form.reset();
                    form.replaceWith(success);

                    setTimeout(() => {
                        success.replaceWith(form)
                        form.parentElement!.style.display = 'none';
                    }, 1000);
                };

                props.onCreate();
            } else {
                console.error(req.error);
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <div
            ref={props.createTodoRef}
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 modal-form"
                onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center">
                    <h2>Create ToDo</h2>
                    <p>ToDos are tasks that you are challenging yourself to complete, they can be edited or removed at any time.</p>
                </div>

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
                                <option value={undefined}>None</option>
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
                        className="px-4 py-2 border-2 border-placeholderText rounded-[3px] text-placeholderText hover:border-secondaryText hover:text-secondaryText focus:border-secondaryText focus:text-secondaryText active:border-secondaryText active:text-secondaryText transition-colors duration-200"
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