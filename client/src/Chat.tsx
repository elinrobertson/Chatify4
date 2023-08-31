import { useSocket } from './SocketContext';
import { useState } from 'react';
import "./Chat.css"


function Chat() {
  const { userWhoIsTyping, room, username, handleRoomChange, roomList, currentMessage, 
          setCurrentMessage, sendMessage, messageList, scroll, isTyping } = useSocket(); 
  const [inputRoom, setInputRoom] = useState('');
  const roomNames = Object.keys(roomList); 

  const handleRoomChangeWrapper = (room: string) => { 
    handleRoomChange(room)
    setInputRoom("");
}

  async function sendRandomGif() {
    //const apiKey = process.env.API_NYCKEL 

    try {
      const response = await fetch("https://api.giphy.com/v1/gifs/random?api_key=imkNzNx4MsYnDzxf7KydTnS2FU5FpRUf");;
      const data = await response.json();
      console.log(data);
      
      const gifUrl = data.data.images.original.url;

      if (currentMessage.includes("/gif")) {
        // Om currentMessage innehåller /gif, byt bara ut URL:en
        const updatedMessage = currentMessage.replace(/\/gif .*$/, `/gif ${gifUrl}`);
        setCurrentMessage(updatedMessage);
      } else {
        // Annars, lägg till /gif {gifUrl} till meddelandet
        setCurrentMessage(currentMessage + ` /gif ${gifUrl}`);
      }
    } catch (error) {
      console.error("Fel vid hämtning av GIF:", error);
    }
  }

  // const handleCommand = () => {
  //   if (currentMessage.trim() === "/gif") {
  //     sendRandomGif();
  //   } else {
  //     sendMessage();
  //   }
  // };
  
  const handleCommand = () => {
    if (currentMessage.trim() === "/gif") {
      sendRandomGif();
    } else if (currentMessage.includes("/gif")) {
      // Om meddelandet innehåller "/gif", extrahera URL:en och lägg till bilden i meddelandet
      const gifUrl = currentMessage.split(" ")[1];
      const updatedMessage = (
        <div>
          <p>{username}: <img src={gifUrl} alt="GIF" /></p>
        </div>
      );
      setCurrentMessage(updatedMessage);
      sendMessage(); // Skicka meddelandet med bilden
    } else {
      sendMessage();
    }
  };
  


  return (
    <div className="main">
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
              <div className="room_input-div">
                <input 
                  value={ inputRoom } 
                  onChange={(e) => 
                  setInputRoom(e.target.value)} 
                  type="text" 
                  placeholder="Välj namn..."
                />
                <button onClick={() => handleRoomChangeWrapper(inputRoom)}className="create-room-btn">Skapa rum</button>
              </div>
          </div>  
          <div className="chatwindow-div">
            <p className='room-name'>{room}</p>
            
            <div className="message-div">
  <div ref={scroll}>
    {messageList.map((messageContent) => {
      return (
        <div key={messageContent.id} className="message" id={username === messageContent.author ? "my-messages" : "other-messages"}>
          <div className="message-content">
            {/* Om meddelandet innehåller "/gif", extrahera URL:en och rendera bilden */}
            {messageContent.message.includes("/gif") ? (
              <img src={messageContent.message.split(" ")[1]} alt="GIF" />
            ) : (
              <p>{messageContent.message}</p>
            )}
          </div>
          <div className="message-meta">
            <p id="time">{messageContent.time}</p>
            <p id="author">{messageContent.author}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>

              <div className='is-typing'>
                {isTyping && userWhoIsTyping !== username ? (<p>{userWhoIsTyping} skriver...</p>) : null}
              </div>

            <div className="send-div">
              <input className="input-div"
                type="text" 
                value={currentMessage} 
                placeholder="Skriv ditt meddelande..." 
                onChange={(e) => {setCurrentMessage(e.target.value)}}
              />
              <button onClick={ handleCommand } className="send-btn">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div> 
          </div>
        </div>
      </div>
  )
}

export default Chat

{/* <div className="message-div">
              <div ref= {scroll}>
                {messageList.map((messageContent) => {
                  
                  
                  return(
                    <div> 
                      <div className="message" id={username === messageContent.author ? "my-messages" : "other-messages"}>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>
                          <p id="author">{messageContent.author}</p>
                        </div>
                      </div>
                    </div>
                  );
               })}
              </div>
            </div> */}