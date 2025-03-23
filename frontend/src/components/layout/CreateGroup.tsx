import { ChangeEvent, FormEvent, RefObject, useState } from "react";

type CreateTodoProps = {
    createGroupRef: RefObject<HTMLDivElement>
}

type FormData = {
    name: string | null
};

export default function CreateGroup(props: CreateTodoProps) {
    const [formData, setFormData] = useState<FormData>({
        name: null
    });

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (props.createGroupRef.current) {
            props.createGroupRef.current.style.display = 'none';
        };
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(formData)
            const req = await fetch('/api/group/new', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                const form = props.createGroupRef.current?.firstChild as HTMLDivElement;
                const success = document.createElement('p');
                
                success.classList.add('text-pine')
                success.classList.add('create-form')
                success.textContent = 'Group Created Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.createGroupRef.current) {
                        success.replaceWith(form)
                        props.createGroupRef.current.style.display = 'none';
                    };
                }, 1500);
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <div
            ref={props.createGroupRef}
            className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 create-form"
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
                        className="w-fit px-4 py-2 rounded-[3px] bg-emerald hover:bg-emeraldActive focus:bg-emeraldActive active:bg-emeraldActive text-bg transition-colors duration-300"
                        type="submit">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    );
};