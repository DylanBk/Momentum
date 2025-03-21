import { useEffect, useRef, useState } from "react";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";

import Sidebar from "../layout/Sidebar";
import Todo from "../layout/ToDo";
import CreateTodo from "../layout/CreateTodo";
import CreateGroup from "../layout/CreateGroup";

type Todo = {
    id: number,
    group: number,
    title: string,
    description: string,
    state: number,
    created: string
};

type Group = {
    name: string
};

export default function ToDo() {
    const nav = useNavigate();

    const [todos, setTodos] = useState<Todo[]>();
    const [groups, setGroups] = useState<Group[]>();

    const createTodoRef = useRef<HTMLDivElement>(null);
    const createGroupRef = useRef<HTMLDivElement>(null);

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
            nav('/signup')
        };

        getTodos();
        getGroups();
    }, [nav]);

    const handleCreateTodo = () => {
        if (createTodoRef.current) {
            createTodoRef.current.style.display = 'flex';
        };
    };

    const handleCreateGroup = () => {
        if (createGroupRef.current) {
            createGroupRef.current.style.display = 'flex';
        };
    };

    return (
        <div className="max-h-screen flex flex-row flex-wrap overflow-hidden">
            <title>Momentum | My ToDos</title>

            <Header />

            <Sidebar groups={groups!} onCreateTodo={handleCreateTodo} onCreateGroup={handleCreateGroup} />

            { todos && (
                <div className="max-h-[calc(100vh-5rem)] w-fit flex flex-col gap-4 p-12 overflow-x-hidden overflow-y-scroll">
                    <h2 className="mb-4 text-3xl text-primaryText">All</h2>
                    { todos.map((todo: Todo, i: number) => (
                        <Todo key={i} id={todo.id} group={todo.group} title={todo.title} description={todo.description} state={todo.state} created={todo.created} />
                    ))}
                </div>
            )}

            <CreateTodo createTodoRef={createTodoRef} groups={groups!} />
            <CreateGroup createGroupRef={createGroupRef} />
        </div>
    );
};