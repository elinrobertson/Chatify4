import { useSocket } from './SocketContext';
import "./Login.css";

function Login() {

  const {login, username, setUsername} = useSocket()

  return (
    <div className="login-container">
      <h1>Chatify</h1>
      <div className="form-container">
        <div className="text-field">
            <input value={ username } onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn"/>
        </div>
        <button onClick={login}>Börja chatta</button>
      </div>
    </div>
  )
}

export default Login