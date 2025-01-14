import React, { useState, useEffect } from 'react';
import MasterContainer from './features/MasterContainer/MasterContainer';
import LoginPage from './features/LoginPage/LoginPage';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('user_id');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <div className="app-container">
            {isLoggedIn && (
                <div className="logout-button">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
            <div className="content-container">
                {isLoggedIn ? (
                    <MasterContainer userId={userId} />
                ) : (
                    <LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
                )}
            </div>
        </div>
    );
}

export default App;
