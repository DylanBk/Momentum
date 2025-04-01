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

export default function ToDo() {
    const nav = useNavigate();

    const [todos, setTodos] = useState<Todo[]>();
    const [groups, setGroups] = useState<Group[]>();

    const [todoId, setTodoId] = useState<(number | null)>(null);
    const [groupId, setGroupId] = useState<(number | null)>(null);

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

        console.log('ToDos', res)

        if (res.message) {
            setTodos(res.data);
        };
    };

    const getGroups = async () => {
        const req = await fetch('/api/groups/get', {
            method: 'GET'
        });
        const res = await req.json();

        console.log('Groups', res)

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

    const handleFilterData = (todos: Todo[]) => {
        setTodos(todos);
    };

    const handleCreateTodo = () => {
        if (createTodoRef.current) {
            createTodoRef.current.style.display = 'flex';
        };
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

            { todos && (
                <div className="max-h-[calc(100vh-5rem)] w-fit flex flex-col gap-4 p-12 overflow-x-hidden overflow-y-scroll">
                    <h2 className="mb-4 text-3xl text-primaryText">All</h2>
                    { todos.map((todo: Todo, i: number) => (
                        <Todo key={i} id={todo.id} group={todo.group} title={todo.title} description={todo.description} state={todo.state} created={todo.created} onEditTodo={handleEditTodo} onDeleteTodo={handleDeleteTodo} />
                    ))}
                </div>
            )}

            <CreateTodo createTodoRef={createTodoRef} groups={groups!} onCreateTodo={getTodos} />
            <EditTodo editTodoRef={editTodoRef} todoId={todoId!} groups={groups!} />
            <DeleteTodo deleteTodoRef={deleteTodoref} todoId={todoId!} />

            <CreateGroup createGroupRef={createGroupRef} onCreateGroup={getGroups} />
            <EditGroup editGroupRef={editGroupRef} groupId={groupId!} />
            <DeleteGroup deleteGroupRef={deleteGroupRef} groupId={groupId!} />
            

        </div>
    );
};