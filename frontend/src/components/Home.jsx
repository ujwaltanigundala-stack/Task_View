import React, { useEffect, useState } from 'react';
import './Home.css';
import { apibaseurl, callApi, imgurl } from '../lib';

import ProgressBar from './ProgressBar';
import Profile from './Profile';
import UserManager from './UserManager';
import TaskManager from './TaskManager';
import MyTask from './MyTask';
import TeamView from './TeamView';

const Home = () => {

    const [fullname, setFullname] = useState("");
    const [isProgress, setIsProgress] = useState("false");
    const [token, setToken] = useState("");
    const [menuList, setMenuList] = useState([]);
    const [activeComponent, setActiveComponent] = useState(null);
    const [activeMenu, setActiveMenu] = useState(0);

    useEffect(() => {

        const storedtoken = localStorage.getItem("token");

        if (!storedtoken)
            logout();

        else {

            setToken(storedtoken);

            setIsProgress(true);

            callApi(
                "GET",
                apibaseurl + "/authservice/uinfo",
                null,
                null,
                loadUinfo,
                storedtoken
            );
        }

    }, []);

    function loadUinfo(res) {

    setIsProgress(false);

    if (res.code !== 200)
        return;

    setFullname(res.fullname);

    setMenuList(res.menulist);

    if (res.menulist && res.menulist.length > 0) {
        loadModule(res.menulist[0].mid);
    }
}

    function logout() {

        localStorage.clear();

        window.location.replace("/");
    }

    function loadModule(mid){

        setIsProgress(true);

        setActiveMenu(mid);

        const component = {

            2: <MyTask logout={logout} />,

            3: <TaskManager logout={logout} />,

            4: <UserManager logout={logout} />,

            5: <Profile logout={logout} />,

            6: <TeamView logout={logout} />

        };

        setActiveComponent(component[mid]);

        setIsProgress(false);
    }

    return (

        <div className='home'>

            <div className='home-header'>

                <label className='brand-title'>
    🚀 Task Management System
</label>

                <div className='info'>

                    {fullname}

                    <img
                        src="/shutdown.png"
                        alt=''
                        onClick={() => logout()}
                    />

                </div>

            </div>

            <div className='home-workspace'>

                <div className='home-menus'>

                    <ul>

                        {[...menuList, { mid: 6, menu: "Team View", icon: "taskmanager.png" }]
                            .filter((m, index, menus) => menus.findIndex((item) => item.mid === m.mid) === index)
                            .map((m) => (

                            <li
                                key={m.mid}
                                className={activeMenu === m.mid ? 'active' : ''}
                                onClick={() => loadModule(m.mid)}
                            >

                                <img
                                    src={imgurl + m.icon}
                                    alt=''
                                />

                                {m.menu}

                            </li>

                        ))}

                    </ul>

                </div>

                <div className='home-content'>
                <div className="welcome-card">
    <h2>Welcome, {fullname}</h2>
    <p>Manage tasks, users and teams efficiently.</p>
</div>
                    {activeComponent}

                </div>

            </div>

            <div className='home-footer'>

                © 2026 Task Management System

            </div>

            <ProgressBar isProgress={isProgress} />

        </div>
    );
}

export default Home;
