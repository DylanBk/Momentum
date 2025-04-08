type DeleteTodoProps = {
    deleteTodoRef: React.RefObject<HTMLDivElement>,
    todoId: number,
    onTodoDelete: () => void
};

export default function DeleteTodo(props: DeleteTodoProps) {
    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (props.deleteTodoRef.current) {
            props.deleteTodoRef.current.style.display = 'none';
        };
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            id: props.todoId
        };

        try {
            const req = await fetch('/api/todo/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.message) {
                const form = props.deleteTodoRef.current?.firstChild as HTMLFormElement;
                const success = document.createElement('p');
                
                success.classList.add('text-pine')
                success.classList.add('create-form')
                success.textContent = 'ToDo Deleted Successfully!';
                form?.replaceWith(success);

                setTimeout(() => {
                    if (props.deleteTodoRef.current) {
                        success.replaceWith(form)
                        props.deleteTodoRef.current.style.display = 'none';
                    };
                }, 1500);

                props.onTodoDelete();
            };
        } catch(err) {
            console.error(err);
        };
    };

    return (
        <div
            ref={props.deleteTodoRef}
            className="h-full w-full absolute inset-0 hidden bg-black/30 backdrop-blur-sm">
            <form
                className="w-1/3 create-form"
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
    );
};