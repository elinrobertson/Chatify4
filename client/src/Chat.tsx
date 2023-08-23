import { useSocket } from './SocketContext';
import "./Chat.css"

function Chat() {

  const {room, createRoom} = useSocket()

  return (
    <div className="main">
      <div className="chat-container">
        <div className="room-div">
          <p>Rum:
            {room}
          </p>
          <button onClick={createRoom}className="create-room">Skapa rum</button>
        </div>
        <div className="chatwindow-div">
          <div className="messages"></div>
            <div className="send-div">
              <input className="input-div "type="text" placeholder="Skriv ditt meddelande..." />
              <button className="send-btn">Skicka</button>
              </div> 
        </div>
      </div>
    </div>
  )
}

export default Chat