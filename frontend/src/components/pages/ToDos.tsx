import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../layout/common/Header";
import Sidebar from "../layout/Sidebar";
import Filter from "../layout/Filter";
import Todo from "../layout/todos/ToDo";
import CreateTodo from "../layout/todos/CreateTodo";
import CreateGroup from "../layout/groups/CreateGroup";
import EditTodo from "../layout/todos/EditTodo";
import DeleteTodo from "../layout/todos/DeleteTodo";
import EditGroup from "../layout/groups/EditGroup";
import DeleteGroup from "../layout/groups/DeleteGroup";

type Todo = {
    id: number,
    group: number,
    title: string,
    description: string,
    state: number,
    created: string
};

type Group = {
    id: number,
    name: string
};

type Filter = {
    state: string | null,
    groups: string[] | number[] | null
};

export default function Todos() {
    const nav = useNavigate();

    const [filters, setFilters] = useState<Filter>({
        state: null,
        groups: null
    });

    const [todos, setTodos] = useState<Todo[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const [todoId, setTodoId] = useState<(number | null)>(null);
    const [groupId, setGroupId] = useState<(number | null)>(null);

    const createTodoRef = useRef<HTMLDivElement>(null);
    const editTodoRef = useRef<HTMLDivElement>(null);
    const deleteTodoref = useRef<HTMLDivElement>(null);

    const createGroupRef = useRef<HTMLDivElement>(null);
    const editGroupRef = useRef<HTMLDivElement>(null);
    const deleteGroupRef = useRef<HTMLDivElement>(null);

    const getTodos = async () => {
        const req = await fetch(`${import.meta.env.VITE_API_URL}/api/todos/get`, {
            method: 'GET'
        });
        const res = await req.json();

        if (res.message) {
            setTodos(res.data);
        };
    };

    const getGroups = async () => {
        const req = await fetch(`${import.meta.env.VITE_API_URL}/api/groups/get`, {
            method: 'GET'
        });
        const res = await req.json();

        if (res.message) {
            setGroups(res.data);
        };
    };

    useEffect(() => {
        if (!document.cookie.split(';').some((item) => item.trim().startsWith('loggedIn='))) {
            nav('/login')
        };

        getTodos();
        getGroups();
    }, [nav]);

    const handleFilterData = (todos: Todo[], filters: Filter) => {
        setTodos(todos);

        let temp_state: string = '';

        switch (filters.state) {
            case '0':
                temp_state = 'Not Completed'
                break;
            case '1':
                temp_state = 'In Progress'
                break;
            case '2':
                temp_state = 'Completed'
                break;
        };

        if (filters.groups) {
            if (filters.groups[0] === '*') {
                setFilters({
                    state: temp_state,
                    groups: ['All']
                });
            } else if (filters.groups[0] === '!') {
                setFilters({
                    state: temp_state,
                    groups: ['Ungrouped']
                });
            } else {
                const temp_groups: string[] = [];
                for (const g of filters.groups) {
                    const x = groups.find((group) => group.id === Number(g));

                    if (x) {
                        temp_groups.push(x.name);
                    };
                };

                setFilters({
                    state: temp_state!,
                    groups: temp_groups
                });
            };
        } else {
            setFilters({
                state: temp_state,
                groups: filters.groups
            });
        };
    };


    const handleCreateTodo = () => {
        if (createTodoRef.current) {
            createTodoRef.current.style.display = 'flex';
        };
    };

    const handleStateChange = (id: number, state: number) => {
        setTodos(todos.map((todo) => 
        todo.id === id ? {...todo, state} : todo)); // redeclare todos, if id matches => update state for that obj
    };

    const handleEditTodo = (id: number) => {
        setTodoId(id);

        if (editTodoRef.current) {
            editTodoRef.current.style.display = 'flex';
        };
    };

    const handleDeleteTodo = (id: number) => {
        setTodoId(id);

        if (deleteTodoref.current) {
            deleteTodoref.current.style.display = 'flex';
        };
    };

    const handleCreateGroup = () => {
        if (createGroupRef.current) {
            createGroupRef.current.style.display = 'flex';
        };
    };

    const handleEditGroup = (id: number) => {
        setGroupId(id);

        if (editGroupRef.current) {
            editGroupRef.current.style.display = 'flex';
        };
    };

    const handleDeleteGroup = (id: number) => {
        setGroupId(id);

        if (deleteGroupRef.current) {
            deleteGroupRef.current.style.display = 'flex';
        };
    };

    return (
        <div className="max-h-screen flex flex-row flex-wrap overflow-hidden">
            <title>Momentum | My ToDos</title>

            <Header />

            <Sidebar groups={groups!} onFilter={handleFilterData} onCreateTodo={handleCreateTodo} onCreateGroup={handleCreateGroup} onEditGroup={handleEditGroup} onDeleteGroup={handleDeleteGroup} />

            <div className="max-h-[calc(100vh-5rem)] w-fit flex flex-col gap-4 p-12 overflow-x-hidden overflow-y-scroll">
                <div className="flex flex-row gap-2">
                    {filters.state && (
                        <div className="mr-2">
                            <Filter name={filters.state} />
                        </div>
                    )}

                    {filters.groups && (
                        filters.groups.map((filter, i) => (
                            <Filter key={i} name={filter as string} />
                        ))
                    )}
                </div>

                { todos && (
                    todos.map((todo: Todo, i: number) => (
                        <Todo
                            key={i}
                            id={todo.id}
                            group={todo.group}
                            title={todo.title}
                            description={todo.description}
                            state={todo.state}
                            onStateChange={handleStateChange}
                            created={todo.created}
                            onEditTodo={handleEditTodo}
                            onDeleteTodo={handleDeleteTodo}
                            isOpen={openMenu === todo.id}
                            setOpenMenu={setOpenMenu}
                        />
                    ))
                )}
            </div>

            <CreateTodo createTodoRef={createTodoRef} groups={groups!} onCreate={() => getTodos()} />
            <EditTodo editTodoRef={editTodoRef} id={todoId!} groups={groups!} onEdit={getTodos} />
            <DeleteTodo deleteTodoRef={deleteTodoref} id={todoId!} onDelete={getTodos} />

            <CreateGroup createGroupRef={createGroupRef} onCreate={getGroups} />
            <EditGroup editGroupRef={editGroupRef} id={groupId!} onEdit={getGroups} />
            <DeleteGroup deleteGroupRef={deleteGroupRef} id={groupId!} onDelete={getGroups} />
        </div>
    );
};