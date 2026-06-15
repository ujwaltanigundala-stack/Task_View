import { useEffect, useRef, useState } from 'react';
import { imgurl, callApi, apibaseurl } from './lib';
import './App.css';
import LandingPage from './components/LandingPage';
import ProgressBar from './components/ProgressBar.jsx';


const App = () => {

    const [isSignin, setIsSignIn] = useState(true);
    const finput = useRef();
    const [isProgress, setIsProgress] = useState(false);
    const [errorData, setErrorData] = useState({});
    const [page,setPage] = useState("landing");
    const [signupData, setSignupData] = useState({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        retypepassword: ""
    });

    const [signinData, setSigninData] = useState({
        email: "",
        password: ""
    });

useEffect(() => {

    if(page === "login"){
        setIsSignIn(true);
    }

    if(page === "signup"){
        setIsSignIn(false);
    }

}, [page]);

useEffect(() => {

    setTimeout(() => {
        finput.current?.focus();
    }, 0);

}, [isSignin]);

    function switchWindow() {

        setIsSignIn(prev => !prev);

        setErrorData({});

        setSigninData({
            email: "",
            password: ""
        });

        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: ""
        });
    }

    function handleSigninInput(e) {

        const { name, value } = e.target;

        setSigninData({
            ...signinData,
            [name]: value
        });
    }

    function handleSignupInput(e) {

        const { name, value } = e.target;

        setSignupData({
            ...signupData,
            [name]: value
        });
    }

    function validateSignup() {

        let errors = {};

        if (signupData.fullname === "")
            errors.fullname = true;

        if (signupData.phone === "")
            errors.phone = true;

        if (signupData.email === "")
            errors.email = true;

        if (signupData.password === "")
            errors.password = true;

        if (
            signupData.retypepassword === "" ||
            signupData.password !== signupData.retypepassword
        )
            errors.retypepassword = true;

        setErrorData(errors);

        return Object.keys(errors).length > 0;
    }

    function validateSignin() {

        let errors = {};

        if (signinData.email === "")
            errors.email = true;

        if (signinData.password === "")
            errors.password = true;

        setErrorData(errors);

        return Object.keys(errors).length > 0;
    }

   function signin() {

    if (validateSignin())
        return;

    const data = {
        email: signinData.email,
        password: signinData.password
    };

    console.log("Sending:", data);

    callApi(
        "POST",
        apibaseurl + "/authservice/signin",
        data,
        null,
        signinResponseHandler
    );
}

    function signup() {

        if (validateSignup())
            return;

        setIsProgress(true);

        const data = {
            fullname: signupData.fullname,
            name: signupData.fullname,
            phone: signupData.phone,
            email: signupData.email,
            password: signupData.password,
            role: 1,
            status: 1
        };

        callApi(
            "POST",
            apibaseurl + "/authservice/signup",
            data,
            null,
            signupResponseHandler
        );
    }

    function signinResponseHandler(res) {

        if (res.code !== 200)
            alert(res.message);

        else {

            localStorage.setItem("token", res.jwt);

            localStorage.setItem("email", res.email);

            window.location.replace("/home");
        }

        setIsProgress(false);
    }

    function signupResponseHandler(res) {

        alert(res.message);

        setIsProgress(false);

        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: ""
        });

        switchWindow();
    }
 if(page === "landing"){

    return (
        <LandingPage
            setPage={setPage}
        />
    );

}

    return (

        <div className='app'>

           <div
    className='container'
    key={isSignin ? "signin" : "signup"}
>

                <div className='container-header'>

                    <label>
                        {isSignin ? "Task Management System" : "Create Account"}
                    </label>

                </div>

                <div className='container-content'>

                    {isSignin ?

                        <>

                            <label>Email*</label>

                            <div className='input-group'>

                                <img src={imgurl + "email.png"} alt='' />

                                <input
                                    type='email'
                                    ref={finput}
                                    className={errorData.email ? 'error' : ''}
                                    placeholder='Enter Email'
                                    autoComplete='off'
                                    name="email"
                                    value={signinData.email}
                                    onChange={(e) => handleSigninInput(e)}
                                />

                            </div>

                            <label>Password*</label>

                            <div className='input-group'>

                                <img src={imgurl + "padlock.png"} alt='' />

                                <input
                                    type='password'
                                    className={errorData.password ? 'error' : ''}
                                    placeholder='Enter Password'
                                    name='password'
                                    value={signinData.password}
                                    onChange={(e) => handleSigninInput(e)}
                                />

                            </div>

                            <button onClick={() => signin()}>
                                Login
                            </button>

                           <label onClick={() => setPage("signup")}>
    Don't have an account? <span>Sign up</span>
</label>
                        </>

                        :

                        <>

                            <label>Full Name*</label>

                            <div className='input-group'>

                                <img src={imgurl + "user.png"} alt='' />

                                <input
                                    type='text'
                                    ref={finput}
                                    className={errorData.fullname ? 'error' : ''}
                                    placeholder='Enter Full Name'
                                    autoComplete='off'
                                    name='fullname'
                                    value={signupData.fullname}
                                    onChange={(e) => handleSignupInput(e)}
                                />

                            </div>

                        <label>Phone Number*</label>

                        <div className='input-group'>

                            <img src={imgurl + "phone.png"} alt='' />

                            <input
                                type='text'
                                className={errorData.phone ? 'error' : ''}
                                placeholder='Enter Phone Number'
                                autoComplete='off'
                                name='phone'
                                value={signupData.phone}
                                onChange={(e) => handleSignupInput(e)}
                            />

                        </div>

                        <label>Email Address*</label>

                        <div className='input-group'>

                            <img src={imgurl + "email.png"} alt='' />

                            <input
                                type='text'
                                className={errorData.email ? 'error' : ''}
                                placeholder='Enter Email'
                                autoComplete='off'
                                name='email'
                                value={signupData.email}
                                onChange={(e) => handleSignupInput(e)}
                            />

                        </div>

                        <label>Password*</label>

                        <div className='input-group'>

                            <img src={imgurl + "padlock.png"} alt='' />

                            <input
                                type='password'
                                className={errorData.password ? 'error' : ''}
                                placeholder='Enter Password'
                                autoComplete='off'
                                name='password'
                                value={signupData.password}
                                onChange={(e) => handleSignupInput(e)}
                            />

                        </div>

                        <label>Re-type Password*</label>

                            <div className='input-group'>

                                <img src={imgurl + "padlock.png"} alt='' />

                                <input
                                    type='password'
                                    className={errorData.retypepassword ? 'error' : ''}
                                    placeholder='Re-type Password'
                                    autoComplete='off'
                                    name='retypepassword'
                                    value={signupData.retypepassword}
                                    onChange={(e) => handleSignupInput(e)}
                                />

                            </div>

                            <button onClick={() => signup()}>
                                Register
                            </button>

                            <label onClick={() => setPage("login")}>
                                Already have an account? <span>Sign in</span>
                            </label>

                        </>

                    }

                </div>

                <div className='container-footer'>

                    © 2026 Task Management System

                </div>

            </div>

            <ProgressBar isProgress={isProgress} />

        </div>
    );
}

export default App;
