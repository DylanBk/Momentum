import { useEffect, useRef, useState } from "react";
import Header from "../layout/common/Header";
import { useNavigate } from "react-router-dom";

import Sidebar from "../layout/Sidebar";
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

export default function ToDo() {
    const nav = useNavigate();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [todoId, setTodoId] = useState<(number | null)>(null);
    const [groupId, setGroupId] = useState<(number | null)>(null);

    const [filters, setFilters] = useState<Filter>({
        state: null,
        groups: null
    });

    const createTodoRef = useRef<HTMLDivElement>(null);
    const editTodoRef = useRef<HTMLDivElement>(null);
    const deleteTodoref = useRef<HTMLDivElement>(null);

    const createGroupRef = useRef<HTMLDivElement>(null);
    const editGroupRef = useRef<HTMLDivElement>(null);
    const deleteGroupRef = useRef<HTMLDivElement>(null);

    const getTodos = async () => {
        const req = await fetch('/api/todos/get', {
            method: 'GET'
        });
        const res = await req.json();

        if (res.message) {
            setTodos(res.data);
        };
    };

    const getGroups = async () => {
        const req = await fetch('/api/groups/get', {
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

        let temp_state: string;
        const temp_groups: string[] = [];

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
            for (const i in filters.groups) {
                const ind = Number(i) - 1;
                temp_groups.push(groups[ind].name);
            };
        };

        setFilters({
            state: temp_state!,
            groups: temp_groups
        });
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

            {/*TODO add something to show applied filters
            either highlight selected FilterBtns or create a top bar for applied filters*/}

            <div className="max-h-[calc(100vh-5rem)] w-fit flex flex-col gap-4 p-12 overflow-x-hidden overflow-y-scroll">
                {!filters ? (
                    <h2 className="mb-4 text-3xl text-primaryText">All</h2>
                ) : (
                    <>
                        <h2 className="mb-4 text-3xl text-primaryText">{filters.state}</h2>
                            {filters.groups?.map((group) => {
                                <p>{group}</p>
                            })}
                    </>
                )}

                { todos && (
                    todos.map((todo: Todo, i: number) => (
                        <Todo key={i} id={todo.id} group={todo.group} title={todo.title} description={todo.description} state={todo.state} onStateChange={handleStateChange} created={todo.created} onEditTodo={handleEditTodo} onDeleteTodo={handleDeleteTodo} />
                    ))
                )}
            </div>

            <CreateTodo createTodoRef={createTodoRef} groups={groups!} onCreateTodo={getTodos} />
            <EditTodo editTodoRef={editTodoRef} todoId={todoId!} groups={groups!} onTodoEdit={getTodos} />
            <DeleteTodo deleteTodoRef={deleteTodoref} todoId={todoId!} onTodoDelete={getTodos} />

            <CreateGroup createGroupRef={createGroupRef} onCreateGroup={getGroups} />
            <EditGroup editGroupRef={editGroupRef} groupId={groupId!} onGroupEdit={getGroups} />
            <DeleteGroup deleteGroupRef={deleteGroupRef} groupId={groupId!} onGroupDelete={getGroups} />
        </div>
    );
};