import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(username, data.userId);
                navigate('/notes');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleSignUp = async () => {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('User registered successfully');
                setIsSignUp(false);
                const data = await response.json();
                onLogin(username, data.userId);
                navigate('/notes');
            } else {
                alert('User already exists');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {isSignUp ? (
                <button onClick={handleSignUp}>Sign Up</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
            </button>
        </div>
    );
}

export default Login;
