import { useSocket } from './SocketContext';
import { useState } from 'react';
import "./Chat.css"

function Chat() {

  const { room, handleRoomChange, roomList } = useSocket(); // roomList

  // Håll ett separat tillstånd för input-värdet
  const [inputRoom, setInputRoom] = useState('');

  const roomNames = Object.keys(roomList); //Då det är ett objekt vi tar emot från servern gör vi om det till Object.keys

const handleRoomChangeWrapper = (room: string) => {  //Då det bara är här i chat komponenten vi behöver denna funktion så behöver vi inte lägga in detta i contexten detta är inget vi behöver skicka till servern
    handleRoomChange(room)
    setInputRoom("");
}

  return (
    <div className="main">
      <div className="wrapper">
        <div className="chat-container">
          <div className="room-div">
          <h3>Rum</h3>
            <p>Du är i {room}</p>
            <h3>Gå med i:</h3>
            <ul>
              {roomNames.map((roomName) => (
                <li key={roomName}>
                  <div onClick={() => handleRoomChangeWrapper(roomName)}>
                    {roomName}
                  </div>
                </li>
              ))}
            </ul>
            {/* <ul>{roomlist}</ul> */}
            <div className='room_input-div'>
              <input value={ inputRoom } onChange={(e) => setInputRoom(e.target.value)} type="text" placeholder="Rum"/>
              <button onClick={() => handleRoomChangeWrapper(inputRoom)}className="create-room-btn">Skapa rum</button>
            </div>
         </div>
        <div className="chatwindow-div">
          <div className="messages"></div>
            <div className="send-div">
              <input className="input-div "type="text" placeholder="Skriv ditt meddelande..." />
              <button className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
              </div> 
           </div>
        </div>
      </div>
    </div>
  )
}

export default Chat