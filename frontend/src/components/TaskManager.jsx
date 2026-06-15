import React, { useEffect, useState } from 'react';
import './TaskManager.css';
import { apibaseurl, callApi } from '../lib';

const TaskManager = ({ logout }) => {

    const [taskname, setTaskname] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [status, setStatus] = useState("0");

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [token, setToken] = useState("");
    const [roleId, setRoleId] = useState(0);

    const [showEdit, setShowEdit] = useState(false);
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        const storedtoken = localStorage.getItem("token");
        if (storedtoken === "" || storedtoken == null) return logout();
        setToken(storedtoken);
    }, []);

    useEffect(() => {
        if (token !== "") {
            loadUsers(token);
            loadTasks(token);
            loadProfile(token);
        }
    }, [token]);

    function loadProfile(tk) {
        callApi(
            "GET",
            apibaseurl + "/authservice/profile",
            null,
            null,
            profileResponse,
            tk
        );
    }

    function profileResponse(res) {
        try {
            const rid = res.user?.[0]?.role ?? res.user?.[0]?.roleId ?? 0;
            setRoleId(Number(rid || 0));
        }
        catch (e) {
            setRoleId(0);
        }
    }

    function loadUsers(tk) {
        callApi(
            "GET",
            apibaseurl + "/taskservice/getusers",
            null,
            null,
            usersResponse,
            tk
        );
    }

    function usersResponse(res) {
        if (res.code === 200) setUsers(res.users);
        else alert(res.message);
    }

    function loadTasks(tk) {
        callApi(
            "GET",
            apibaseurl + "/taskservice/getalltasks",
            null,
            null,
            tasksResponse,
            tk
        );
    }

    function tasksResponse(res) {
        console.log("tasksResponse", res);
        if (res.code === 200) setTasks(res.tasks);
        else alert(res.message);
    }

    function getTaskTitle(task) {
        return (
            task?.taskname ??
            task?.title ??
            task?.name ??
            task?.taskName ??
            task?.task_name ??
            task?.titleName ??
            task?.description ??
            "Untitled"
        );
    }

    function addTask() {
        if (!taskname || !description || !date || (!userEmail && !userId)) {
            alert("All fields required");
            return;
        }

        const data = {
            taskname,
            description,
            date,
            email: userEmail,
            userid: userId,
            status: Number(status)
        };

        callApi(
            "POST",
            apibaseurl + "/taskservice/addtask",
            data,
            null,
            addTaskResponse,
            token
        );
    }

    function addTaskResponse(res) {
        alert(res.message);
        if (res.code !== 200) return;
        setTaskname("");
        setDescription("");
        setDate("");
        setUserEmail("");
        setUserId("");
        setStatus("0");
        loadTasks(token);
    }

    function deleteTask(id) {
        const resp = confirm("Delete task ?");
        if (!resp) return;
        callApi(
            "DELETE",
            apibaseurl + "/taskservice/deletetask/" + id,
            null,
            null,
            deleteResponse,
            token
        );
    }

    function deleteResponse(res) {
        alert(res.message);
        loadTasks(token);
    }

    function openEdit(t) {
        const id = t.id ?? t.taskId;
        setEditTask({
            id,
            taskname: t.taskname ?? t.title ?? "",
            description: t.description ?? "",
            date: t.date ?? t.deadline ?? "",
            userId: t.user?.id ?? t.user?.userId ?? "",
            userEmail: t.user?.email ?? "",
            status: String(t.status ?? 0)
        });
        setShowEdit(true);
    }

    function handleEditChange(e) {
        const { name, value } = e.target;
        setEditTask({ ...editTask, [name]: value });
    }

    function saveEdit() {
        if (!editTask || !editTask.taskname || !editTask.description || !editTask.date)
            return alert("All fields required");

        const data = {
            taskname: editTask.taskname,
            description: editTask.description,
            date: editTask.date,
            email: editTask.userEmail,
            userid: editTask.userId,
            status: Number(editTask.status)
        };

        callApi(
            "PUT",
            apibaseurl + "/taskservice/updatetask/" + editTask.id,
            data,
            null,
            updateTaskResponse,
            token
        );
    }

    function updateTaskResponse(res) {
        alert(res.message);
        setShowEdit(false);
        setEditTask(null);
        loadTasks(token);
    }

    return (
        <div className='taskmanager page-enter'>
            <div className="stats-grid">

                <div className="stat-card">
                    <h3>{tasks.length}</h3>
                    <p>Total Tasks</p>
                </div>

                <div className="stat-card">
                    <h3>{users.length}</h3>
                    <p>Total Users</p>
                </div>

                <div className="stat-card">
                    <h3>{tasks.filter(t => t.status === 2).length}</h3>
                    <p>Completed</p>
                </div>

            </div>

            <div className='top-box'>
                <h2>Add Task</h2>

                <div className='form-row'>
                    <input type='text' placeholder='Task name' value={taskname} onChange={(e) => setTaskname(e.target.value)} />
                    <input type='text' placeholder='Task description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type='date' value={date} onChange={(e) => setDate(e.target.value)} />

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value='0'>To Do</option>
                        <option value='1'>In Progress</option>
                        <option value='2'>Done</option>
                    </select>
                </div>

                <div className='form-row'>
                    <select value={userId} onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedUser = users.find(u => String(u.id) === selectedId);
                        setUserId(selectedId);
                        setUserEmail(selectedUser?.email ?? "");
                    }}>
                        <option value=''>Map to user</option>
                        {users.map((u) => (
                            <option key={u.id} value={String(u.id)}>{u.fullname} ({u.email})</option>
                        ))}
                    </select>
                </div>

                <div className="submit-row">
                    <button className="add-task-btn" onClick={() => addTask()}>Add Task</button>
                </div>

            </div>


            {showEdit && editTask && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h3>Edit Task</h3>

                        <div className='form-row'>
                            <input type='text' name='taskname' placeholder='Task name' value={editTask.taskname} onChange={handleEditChange} />
                            <input type='text' name='description' placeholder='Task description' value={editTask.description} onChange={handleEditChange} />
                            <input type='date' name='date' value={editTask.date} onChange={handleEditChange} />
                            <select name='status' value={editTask.status} onChange={handleEditChange}>
                                <option value='0'>To Do</option>
                                <option value='1'>In Progress</option>
                                <option value='2'>Done</option>
                            </select>
                        </div>

                        <div className='form-row'>
                            <select name='userId' value={String(editTask.userId ?? "")} onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedUser = users.find(u => String(u.id) === selectedId);
                                setEditTask({ ...editTask, userId: selectedId, userEmail: selectedUser?.email ?? "" });
                            }}>
                                <option value=''>Map to user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={String(u.id)}>{u.fullname} ({u.email})</option>
                                ))}
                            </select>
                        </div>

                        <div className='submit-row' style={{ marginTop: 10 }}>
                            <button className='add-task-btn' onClick={saveEdit}>Save</button>
                            <button className='delete-btn' style={{ marginLeft: 8 }} onClick={() => { setShowEdit(false); setEditTask(null); }}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}

            <div className='bottom-box'>
                <div className='header'>
                    <h2>All Tasks</h2>
                    <span>{tasks.length} tasks</span>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Mapped User</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((t) => (
                            <tr key={t.id ?? t.taskId}>
                                <td>{getTaskTitle(t)}</td>
                                <td>{t.description}</td>
                                <td>{t.date ?? t.deadline}</td>
                                <td>{t.user?.fullname} ({t.user?.email})</td>
                                <td>
                                    {(roleId === 2 || roleId === 3) && (
                                        <button className='delete-btn' onClick={() => openEdit(t)} style={{ marginRight: 8 }}>Update</button>
                                    )}

                                    <button className='delete-btn' onClick={() => deleteTask(t.id ?? t.taskId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default TaskManager;
