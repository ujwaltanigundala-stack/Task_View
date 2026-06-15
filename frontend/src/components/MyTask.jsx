import React, { useEffect, useState } from 'react';
import './TaskManager.css';
import { apibaseurl, callApi } from '../lib';

const MyTask = ({ logout }) => {

    const [tasks, setTasks] = useState([]);
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {

        const storedtoken = localStorage.getItem("token");
        const storedemail = localStorage.getItem("email");

        if (storedtoken == null || storedtoken === "")
            return logout();

        setToken(storedtoken);

        setEmail(storedemail);

    }, []);

    useEffect(() => {

        if (token !== "" && email !== "") {

            loadTasks();

        }

    }, [token, email]);

    function loadTasks() {

        callApi(
            "GET",
            apibaseurl + "/taskservice/getmytasks/" + email,
            null,
            null,
            tasksResponse,
            token
        );
    }

    function tasksResponse(res) {

        if (res.code === 200)
            setTasks(res.tasks);

        else
            alert(res.message);
    }

    return (

        <div className='taskmanager'>

            <div className='bottom-box'>

                <div className='header'>

                    <h2>My Tasks</h2>

                    <span>

                        {tasks.length} tasks

                    </span>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>Task Name</th>
                            <th>Description</th>
                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {tasks.map((t) => (

                            <tr key={t.id ?? t.taskId}>

                                <td>{t.taskname ?? t.title}</td>

                                <td>{t.description}</td>

                                <td>{t.date ?? t.deadline}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default MyTask;
