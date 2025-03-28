import { ChangeEvent, FormEvent, useEffect, useState } from "react"

type EditGroupProps = {
    editGroupRef: React.RefObject<HTMLDivElement>,
    groupId: number
};

type FormData = {
    id: number | null,
    updates:{
        name: string | null
    }
};

export default function EditGroup(props: EditGroupProps) {
    const [formData, setFormData] = useState<FormData>({
        id: props.groupId,
        updates: {
            name: null
        }
    });

    useEffect(() => {
        console.log(props.groupId)

        setFormData({
            id: props.groupId,
            updates: {
                name: null
            }
        });
    }, [props.groupId]);

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
            props.editGroupRef.current.style.display = 'none';
        };
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formData)

        try {
            const req = await fetch('/api/group/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                const form = props.editGroupRef.current?.firstChild as HTMLDivElement;
                const success = document.createElement('p');

                success.classList.add('text-pine');
                success.classList.add('create-form');
                success.textContent = 'Group Updated Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.editGroupRef.current) {
                        success.replaceWith(form);
                        props.editGroupRef.current.style.display = 'none';
                    };
                }, 1500);
            };
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div
            ref={props.editGroupRef}
            className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
                <form
                    className="w-1/3 create-form"
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
                            className="w-fit px-4 py-2 rounded-[3px] bg-emerald hover:bg-emeraldActive focus:bg-emeraldActive active:bg-emeraldActive text-bg transition-colors duration-300"
                            type="submit">
                            Confirm
                        </button>
                    </div>
                </form>
        </div>
    )
}