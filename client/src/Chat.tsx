import { useSocket } from './SocketContext';
import { useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css"


function Chat() {

  const { room, username, handleRoomChange, roomList, currentMessage, setCurrentMessage, sendMessage, messageList } = useSocket(); 

  // Håll ett separat tillstånd för input-värdet
  const [inputRoom, setInputRoom] = useState('');

  const roomNames = Object.keys(roomList); //Då det är ett objekt vi tar emot från servern gör vi om det till Object.keys

const handleRoomChangeWrapper = (room: string) => {  //Då det bara är här i chat komponenten vi behöver denna funktion så behöver vi inte lägga in detta i contexten detta är inget vi behöver skicka till servern
    handleRoomChange(room)
    setInputRoom("");
}

const [isTyping, setIsTyping] = useState(false);

const handleTyping = (isTyping: boolean) => {
  setIsTyping(isTyping);
};


  return (
    <div className="main">
      <div className="wrapper">
        <div id="chat-container">
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
            <p>Du är i {room}</p>
            <ScrollToBottom className="message-div">
              {messageList.map((messageContent) => {
                return(
                  <div key={messageContent.id}>
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
                      <p>Skriver...</p>
                    ) : null}
                  </div>
                );
              })}
            </ScrollToBottom>
            <div className="send-div">
              <input className="input-div"
                type="text" 
                value={currentMessage} 
                placeholder="Skriv ditt meddelande..." 
                onChange={(e) => {
                  // setCurrentMessage(e.target.value)
                  setCurrentMessage(e.target.value);
                  handleTyping(e.target.value.length > 0); 
                }}/>
              <button onClick={sendMessage} className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat