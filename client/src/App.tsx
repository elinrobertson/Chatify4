import { useEffect } from "react";
import { io } from "socket.io-client";
import "./Main.css"


function App() {
  const socket = io("http://localhost:3000/", { autoConnect: false} )

  const initChat = () => {
    socket.connect();
    
  }
  
 useEffect( () => {
    socket.on("test", (data) =>{
      console.log(data);
    })
 },[])
  
  return (
    <>
   
      <div className="login-container">
      <h1>Chatify</h1>
        <input type="text" placeholder="Skriv ditt namn här..."/>
        <button onClick={initChat}>Börja chatta</button>
      </div>
    
    </>
  )
}

export default App