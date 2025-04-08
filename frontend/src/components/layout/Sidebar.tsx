import { useEffect, useState } from "react";
import FilterBtn from "./FilterBtn";

type Todo = {
    id: number,
    group: number,
    title: string,
    description: string,
    state: number,
    created: string
};

type SidebarProps = {
    groups: {
        id: number,
        name: string
    }[] | undefined,
    onFilter: (todos: Todo[], filters: FormData) => void,
    onCreateTodo: () => void,
    onCreateGroup: () => void,
    onEditGroup: (id: number) => void,
    onDeleteGroup: (id: number) => void
};

type FormData = {
    state: string | null,
    groups: string[] | null
};

export default function Sidebar(props: SidebarProps) {
    const [formData, setFormData] = useState<FormData>({
        state: null,
        groups: null
    });

    const handleInputChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { name, value } = e.currentTarget;

        if (name === 'state') {
            if (value === formData.state) { // remove if clicked again
                setFormData({
                    ...formData,
                    state: null
                });
            } else {
                setFormData({ // add
                    ...formData,
                    state: value
                });
            };
        } else {
            if (value == '*') { // if all
                setFormData({
                    ...formData,
                    groups: ['*']
                });
            } else if (value == '!') { // if ungrouped
                setFormData({
                    ...formData,
                    groups: ['!']
                });
            } else if (formData.groups?.includes(value)) { // remove if clicked again
                setFormData({
                    ...formData,
                    groups: formData.groups.filter((group) => group !== value)
                });
            } else { // add to formData and remove * or ! if present
                setFormData({
                    ...formData,
                    groups: formData.groups
                        ? [...formData.groups.filter((group) => group !== '*' && group !== '!'), value]
                        : [value]
                });
            };
        };
    };

    useEffect(() => {
        const handleFormSubmit = async () => {
            try {
                const req = await fetch('/api/filtered-todos/get', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                const res = await req.json();

                if (res.message) {
                    props.onFilter(res.data, formData);
                };
            } catch (e) {
                console.error(e);
            };
        };

        handleFormSubmit();
    }, [formData])

    return (
        <div className="h-full w-64 flex flex-col gap-4 items-center py-8 border-r border-divider">
            <section className="filters-container">
                <FilterBtn name="state" value="2" content="Completed" function={handleInputChange} group={null} />
                <FilterBtn name="state" value="1" content="In Progress" function={handleInputChange} group={null} />
                <FilterBtn name="state" value="0" content="Not Completed" function={handleInputChange} group={null} />
            </section>

            <hr className="w-4/5 h-[1px] border-0 bg-divider" />

            <section className="filters-container">
                <h2 className="mb-2 text-2xl text-primaryText">Groups</h2>

                <FilterBtn name="group" value="*" content="All" function={handleInputChange} group={null} />
                <FilterBtn name="group"  value="!" content="Ungrouped" function={handleInputChange} group={null} />

                {props.groups && (
                    <div className="max-h-24 w-56 flex flex-col gap-2 mt-4 overflow-y-scroll">
                        { props.groups.map((group, i) => (
                            <FilterBtn key={i} name="group" value={undefined} content={group.name} function={handleInputChange} group={{id: group.id, options: [{content: 'Edit', function: props.onEditGroup}, {content: 'Delete', function: props.onDeleteGroup}]}} />
                        ))}
                    </div>
                )}
            </section>

            <hr className="w-4/5 h-[1px] border-0 bg-divider" />

            <section className="filters-container">
                <h2 className="mb-2 text-2xl text-primaryText">Create</h2>

                <button
                    className="w-fit px-4 py-2 rounded-[3px] bg-emerald hover:bg-emeraldActive focus:bg-emeraldActive active:bg-emeraldActive text-sm text-bg"
                    onClick={props.onCreateTodo}>
                    New ToDo +
                </button>

                <button
                    className="w-fit px-4 py-2 border border-emerald hover:border-emeraldActive focus:border-emeraldActive active:border-emeraldActive rounded-[3px] text-sm text-emerald hover:text-emeraldActive focus:text-emeraldActive active:text-emeraldActive"
                    onClick={props.onCreateGroup}>
                    New Group +
                </button>
            </section>
        </div>
    );
};