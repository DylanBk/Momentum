import { ChangeEvent, FormEvent, useEffect, useState } from "react"

type EditGroupProps = {
    editGroupRef: React.RefObject<HTMLDivElement>,
    id: number,
    onEdit: () => void
};

type FormData = {
    id: number | null,
    updates:{
        name: string | null
    }
};

export default function EditGroup(props: EditGroupProps) {
    const [formData, setFormData] = useState<FormData>({
        id: props.id,
        updates: {
            name: null
        }
    });

    useEffect(() => {
        setFormData({
            id: props.id,
            updates: {
                name: null
            }
        });
    }, [props.id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            updates: {
                ...formData.updates,
                [name]: value
            }
        });
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setFormData({
            id: null,
            updates: {
                name: null
            }
        });

        if (props.editGroupRef.current) {
            (props.editGroupRef.current.children[0] as HTMLFormElement).reset();
            props.editGroupRef.current.style.display = 'none';
        };
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const req = await fetch('/api/group/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                if (props.editGroupRef.current) {
                    const form = props.editGroupRef.current.firstChild as HTMLDivElement;
                    const success = document.createElement('p');

                    success.classList.add('text-pine');
                    success.classList.add('modal-form');
                    success.textContent = 'Group Updated Successfully!';
                    form.replaceWith(success);

                    setTimeout(() => {
                            success.replaceWith(form);
                            success.style.display = 'none';
                    }, 1000);
                };

                props.onEdit();
            };
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div
            ref={props.editGroupRef}
            className="h-full w-full absolute inset-0 z-20 hidden bg-black/30 backdrop-blur-sm">
                <form
                    className="w-1/3 modal-form"
                    onSubmit={handleFormSubmit}>
                    <h2>Edit Group</h2>

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
    )
}