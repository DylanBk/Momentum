import { ChangeEvent, FormEvent, RefObject, useState } from "react";

type CreateTodoProps = {
    createGroupRef: RefObject<HTMLDivElement>,
    onCreate: () => void
};

type FormData = {
    name: string | null
};

export default function CreateGroup(props: CreateTodoProps) {
    const [formData, setFormData] = useState<FormData>({
        name: null
    });

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
            name: null
        });

        if (props.createGroupRef.current) {
            (props.createGroupRef.current.children[0] as HTMLFormElement).reset();
            props.createGroupRef.current.style.display = 'none';
        };
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch('/api/group/new', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                if (props.createGroupRef.current) {
                    const form = props.createGroupRef.current.children[0] as HTMLFormElement;
                    const success = document.createElement('p') as HTMLParagraphElement;
                    
                    success.classList.add('text-pine')
                    success.classList.add('modal-form')
                    success.textContent = 'Group Created Successfully!';

                    form.reset();
                    form.replaceWith(success);

                    setTimeout(() => {
                        success.replaceWith(form)
                        form.parentElement!.style.display = 'none';
                    }, 1000);
                };

                props.onCreate();
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <div
            ref={props.createGroupRef}
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 modal-form"
                onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center">
                    <h2>Create Group</h2>
                    <p>Groups are used to organise ToDos, you can edit or remove them at any time.</p>
                </div>

                <input
                    name="name"
                    type="text"
                    placeholder="Group Name"
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