import './LandingPage.css';

const LandingPage = ({ setPage }) => {

    return (

        <div className="landing">

            <div className="landing-card">

                <h1>Task Management System</h1>

                <p>
                    Organize tasks, manage teams and
                    track progress efficiently.
                </p>

                <div className="actions">

                    <button
                        onClick={() => setPage("login")}
                    >
                        Login
                    </button>

                    <button
                        className="secondary"
                        onClick={() => setPage("signup")}
                    >
                        Sign Up
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LandingPage;