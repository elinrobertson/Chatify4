import { useSocket } from './SocketContext';
import { useState } from 'react';
import "./Chat.css"


function Chat() {

  

  const { room, username, handleRoomChange, roomList, currentMessage, setCurrentMessage, sendMessage, messageList, scroll, isTyping } = useSocket(); 

  // Håll ett separat tillstånd för input-värdet
  const [inputRoom, setInputRoom] = useState('');

  const roomNames = Object.keys(roomList); //Då det är ett objekt vi tar emot från servern gör vi om det till Object.keys

const handleRoomChangeWrapper = (room: string) => {  //Då det bara är här i chat komponenten vi behöver denna funktion så behöver vi inte lägga in detta i contexten detta är inget vi behöver skicka till servern
    handleRoomChange(room)
    setInputRoom("");
}




  return (
    <div className="main">
      {/* <div className="wrapper"> */}
        <div className="chat-container">
          <div className="room-div">
            <h3>Rum</h3>
              <ul>
                {roomNames.map((roomName) => (
                  <li key={roomName} onClick={() => handleRoomChangeWrapper(roomName)}>
                  {roomName}
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
            <p className='room-name'>{room}</p>

            <div className="message-div">
              <div ref= {scroll}>
              {messageList.map((messageContent) => {
                return(
                  //vet inte om raden under behövs eller inte, kanske bara ska vara en tom div
                  <div> 
                    {/* key={messageContent.id} */}
                    <div className="message" id={username === messageContent.author ? "my-messages" : "other-messages"}>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                        <p id="time">{messageContent.time}</p>
                        <p id="author">{messageContent.author}</p>
                        </div>

                        
                    </div>
                          {messageContent.author === username && isTyping ? (
                            <p>{username} skriver...</p> 
                            ) : null}
                  </div>
                );
              })}
              </div>
            </div>
            <div className="send-div">
              <input className="input-div"
                type="text" 
                value={currentMessage} 
                placeholder="Skriv ditt meddelande..." 
                onChange={(e) => {
                  setCurrentMessage(e.target.value)
                }}/>
              <button onClick={sendMessage} className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
            </div> 
          </div>
        </div>
      {/* </div> */}
    </div>
  )
}

export default Chat