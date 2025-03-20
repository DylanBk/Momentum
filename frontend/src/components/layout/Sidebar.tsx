// import { ChangeEvent, useEffect, useState } from "react";
import FilterBtn from "./FilterBtn";

type Group = {
    name: string
};

type SidebarProps = {
    groups: Group[] | undefined
};

export default function Sidebar(props: SidebarProps) {
    // const [formData, setFormData] = useState(null);

    // const handleInputChange = (e: ChangeEvent<HTMLButtonElement>) => {
    //     console.log(e.target.textContent);
    // };

    // const handleFilter = () => {
    //     console.log(null);
    // };

    return (
        <div className="h-full w-64 flex flex-col gap-4 items-center py-8 border-r border-divider">
            <section className="filters-container">
                <FilterBtn name="state" content="Completed" function={() => alert('completed')} options={null} />
                <FilterBtn name="state" content="In Progress" function={() => alert('in progress')} options={null} />
                <FilterBtn name="state" content="Not Completed" function={() => alert('not completed')} options={null} />
            </section>

            <hr className="w-4/5 h-[1px] border-0 bg-divider" />

            <section className="filters-container">
                <h2 className="mb-2 text-2xl text-primaryText">Groups</h2>

                <FilterBtn name="group" content="All" function={() => alert('all')} options={null} />
                <FilterBtn name="group" content="Ungrouped" function={() => alert('ungrouped')} options={null} />

                {props.groups && (
                    <div className="max-h-24 w-56 flex flex-col gap-2 mt-4 overflow-y-scroll">
                        { props.groups.map((group, i) => (
                            <FilterBtn key={i} name="group" content={group.name} function={() => alert(`${group.name} selected`)} options={['Rename', 'Delete']} />
                        ))}
                    </div>
                )}
            </section>

            <hr className="w-4/5 h-[1px] border-0 bg-divider" />

            <section className="filters-container">
                <h2 className="mb-2 text-2xl text-primaryText">Create</h2>

                <button className="w-fit px-4 py-2 rounded-[3px] bg-emerald hover:bg-emeraldActive focus:bg-emeraldActive active:bg-emeraldActive text-sm text-bg font-medium">New ToDo +</button>
                <button className="w-fit px-4 py-2 border border-emerald hover:border-emeraldActive focus:border-emeraldActive active:border-emeraldActive rounded-[3px] text-sm text-emerald hover:text-emeraldActive focus:text-emeraldActive active:text-emeraldActive font-medium">New Group +</button>
            </section>
        </div>
    );
};