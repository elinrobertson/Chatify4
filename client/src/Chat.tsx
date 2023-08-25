import { useSocket } from './SocketContext';
import { useState } from 'react';
import "./Chat.css"

function Chat() {

  const { room, handleRoomChange } = useSocket(); // roomList

  // Håll ett separat tillstånd för input-värdet
  const [inputRoom, setInputRoom] = useState('Lobby');

  // const handleJoinRoom = () => {
  //   if (inputRoom) {
  //     setRoom(inputRoom); // Uppdatera rummet med input-värdet
  //     joinRoom(); // Anropa joinRoom
  //   }
  // };

  return (
    <div className="main">
      <div className="chat-container">
        <div className="room-div">
          <p>Rum:
            {/* <p onClick="handleRoomChange("Lobby")>Lobby</p>
            {roomList.map( (room) => {
              handleRoomChange(room)
            })} */}
            {room}
          </p>
          <input value={ inputRoom } onChange={(e) => setInputRoom(e.target.value)} type="text" placeholder="Rum"/>
          <button onClick={() => handleRoomChange(inputRoom)}className="create-room">Skapa rum</button>
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