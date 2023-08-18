import login from './SocketContext';
import React from 'react'
import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <h1>Chatify</h1>
      <div className="form-container">
        <div className="text-field">
            <input type="text" placeholder="Användarnamn"/>
        </div>
        <button onClick={login}>Börja chatta</button>
      </div>
    </div>
  )
}

export default Login