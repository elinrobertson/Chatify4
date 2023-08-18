import { useSocket } from "./SocketContext";
import Chat from "./Chat";
import Login from "./Login";



function App() {

  const { isLoggedIn } = useSocket()
  
  return (
    <div> 
      {isLoggedIn ? <Chat /> : <Login />}
      </div>
  )
}

export default App;