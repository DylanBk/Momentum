import { useEffect, useState } from "react";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";

import Sidebar from "../layout/Sidebar";
import Todo from "../layout/ToDo";

type Todo = {
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

    return (
        <div className="flex flex-row flex-wrap">
            <title>Momentum | My ToDos</title>

            <Header />

            <Sidebar groups={groups!}/>

            { todos && (
                <div className="w-fit flex flex-col px-12 pt-12">
                    <h2 className="mb-4 text-2xl text-primaryText">All</h2>
                    { todos.map((todo: Todo, i: number) => (
                        <Todo key={i} group={todo.group} title={todo.title} description={todo.description} state={todo.state} created={todo.created} />
                    ))}
                </div>
            )}
        </div>
    );
};