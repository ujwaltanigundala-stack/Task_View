import React, { useEffect, useMemo, useState } from 'react';
import './TaskManager.css';
import { apibaseurl, callApi } from '../lib';

const statusLabels = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done"
};

const TeamView = ({ logout }) => {

    const [token, setToken] = useState("");
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
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
            loadTeamView(token);
        }
    }, [token]);

    const taskCount = useMemo(
        () => teams.reduce((total, item) => total + (item.tasks?.length ?? 0), 0),
        [teams]
    );

    function loadTeamView(tk) {

        callApi(
            "GET",
            apibaseurl + "/teamservice/view",
            null,
            null,
            teamViewResponse,
            tk
        );
    }

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
        console.log("profileResponse", res);
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

    function assignUserToTeam() {
        if (!selectedTeamId) {
            alert("Select a team first.");
            return;
        }
        if (!selectedUserId) {
            alert("Select a user email to assign.");
            return;
        }

        callApi(
            "GET",
            apibaseurl + "/authservice/getuser/" + selectedUserId,
            null,
            null,
            (res) => {
                if (res.code !== 200) {
                    alert(res.message);
                    return;
                }

                const user = res.user;
                const updatedUser = {
                    id: user.id,
                    fullname: user.fullname,
                    phone: user.phone,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    status: user.status,
                    teamId: Number(selectedTeamId)
                };

                callApi(
                    "PUT",
                    apibaseurl + "/authservice/updateuser/" + selectedUserId,
                    updatedUser,
                    null,
                    (updateRes) => {
                        alert(updateRes.message);
                        if (updateRes.code === 200) {
                            setSelectedTeamId("");
                            setSelectedUserId("");
                            loadTeamView(token);
                            loadUsers(token);
                        }
                    },
                    token
                );
            },
            token
        );
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
        if (res.code === 200) setTasks(res.tasks);
        else alert(res.message);
    }

    function teamViewResponse(res) {

        if (res.code === 200)
            setTeams(res.teams);

        else
            alert(res.message);
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


    function saveTeam() {

        if (!teamName) {
            alert("Team name required");
            return;
        }

        callApi(
            "POST",
            apibaseurl + "/teamservice/save",
            {
                teamName,
                description,
                status: 1
            },
            null,
            saveTeamResponse,
            token
        );
    }

    function saveTeamResponse(res) {

        alert(res.message);

        if (res.code !== 200)
            return;

        setTeamName("");
        setDescription("");
        loadTeamView(token);
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
        loadTeamView(token);
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
        loadTeamView(token);
    }

    return (

    <div className='taskmanager page-enter'>

        <div className='stats-grid'>

            <div className='stat-card'>
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
            </div>


            <div className='stat-card'>
                <h3>{users.length}</h3>
                <p>Total Users</p>
            </div>

            <div className='stat-card'>
                <h3>
                    {tasks.filter((t) => Number(t.status) === 2).length}
                </h3>
                <p>Completed Tasks</p>
            </div>

        </div>

        <div className='top-box'>

                <h2>Team View</h2>

                <div className='form-row'>

                    <input
                        type='text'
                        placeholder='Team name'
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />

                    <input
                        type='text'
                        placeholder='Team description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button onClick={() => saveTeam()}>
                        Add Team
                    </button>

                </div>

            </div>

            <div className='top-box'>
                <h2>Assign User to Team</h2>

                <div className='form-row'>
                    <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
                        <option value=''>Select team</option>
                        {teams.map((item) => (
                            <option key={item.team.teamId} value={item.team.teamId}>
                                {item.team.teamName}
                            </option>
                        ))}
                    </select>

                    <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                        <option value=''>Select user email</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.email}
                            </option>
                        ))}
                    </select>

                    <button onClick={() => assignUserToTeam()}>
                        Add User
                    </button>
                </div>
            </div>


            <div className='bottom-box'>

                <div className='header'>
                    <h2>Teams</h2>
                    <span>{taskCount} tasks</span>
                </div>

                {teams.map((item) => (

                    <div className='team-block' key={item.team.teamId}>

                        <div className='team-title'>
                            <strong>{item.team.teamName}</strong>
                            <span>{item.members.length} members</span>
                        </div>

                        <div className='team-members'>
                            <div className='team-members-label'>Team members</div>
                            {item.members.length > 0 ? (
                                item.members.map((member) => (
                                    <div key={member.id || member.userId} className='member-chip'>
                                        {member.fullname ?? member.email}
                                        {member.email ? ` (${member.email})` : ''}
                                    </div>
                                ))
                            ) : (
                                <div className='member-chip empty'>No members assigned yet</div>
                            )}
                        </div>

                        <div className='status-grid'>

                            {Object.entries(statusLabels).map(([key, label]) => (

                                <div className='status-column' key={key}>

                                    <h3>{label}</h3>

                                    {(item.statusGroups[key] ?? []).map((task) => (

                                                <div className='task-chip' key={task.taskId ?? task.id}>
                                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                        <b>{getTaskTitle(task)}</b>
                                                        <div>
                                                            {(roleId === 2 || roleId === 3) && (
                                                                <button className='delete-btn' onClick={() => openEdit(task)} style={{marginRight:8}}>Update</button>
                                                            )}
                                                            <button className='delete-btn' onClick={() => deleteTask(task.taskId ?? task.id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                    <span>{task.user?.fullname ?? "Unassigned"}</span>
                                                </div>

                                    ))}

                                </div>

                            ))}

                        </div>

                    </div>

                ))}

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

        </div>
    );
};

export default TeamView;
