type DeleteGroupProps = {
    deleteGroupRef: React.RefObject<HTMLDivElement>,
    groupId: number,
    onGroupDelete: () => void
};

export default function DeleteGroup(props: DeleteGroupProps) {
    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (props.deleteGroupRef.current) {
            props.deleteGroupRef.current.style.display = 'none';
        };
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            id: props.groupId
        };

        try {
            const req = await fetch('/api/group/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                const form = props.deleteGroupRef.current?.firstChild as HTMLFormElement;
                const success = document.createElement('p');
                
                success.classList.add('text-pine')
                success.classList.add('modal-form')
                success.textContent = 'Group Deleted Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.deleteGroupRef.current) {
                        success.replaceWith(form)
                        props.deleteGroupRef.current.style.display = 'none';
                    };
                }, 1500);

                props.onGroupDelete();
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <div
            ref={props.deleteGroupRef}
            className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 modal-form"
                onSubmit={handleSubmitForm}>
                    <div className="flex flex-col items-center">
                        <h2>Delete Todo</h2>
                        <p className="text-secondaryText">
                            <span className="text-danger">Warning: </span>
                            This action is irreversible, do you wish to continue?
                        </p>
                    </div>

                    <div className="flex flex-row gap-8">
                    <button
                        className="px-4 py-2 border-2 border-placeholderText rounded-[3px] text-placeholderText hover:border-secondaryText hover:text-secondaryText focus:border-secondaryText focus:text-secondaryText active:border-secondaryText active:text-secondaryText transition-colors duration-200"
                        onClick={handleCancel}>
                        Cancel
                    </button>

                    <button
                        className="w-fit px-4 py-2 rounded-[3px] bg-danger hover:bg-dangerActive focus:bg-dangerActive active:bg-dangerActive text-bg transition-colors duration-300"
                        type="submit">
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}