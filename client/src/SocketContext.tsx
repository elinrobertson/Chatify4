/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client";

interface IMessage {
    id: number
    room: string
    author: string
    message: string
    time: string
}

//ny kommentar

interface ISocketContext {
    isLoggedIn: boolean
    username: string
    room: string
    roomList: string[]
    userList: string
    setRoom: React.Dispatch<React.SetStateAction<string>>
    setUsername: React.Dispatch<React.SetStateAction<string>>
    login: () => void   
    setRoomList: React.Dispatch<React.SetStateAction<string[]>>
    setUserList: React.Dispatch<React.SetStateAction<string>>
    joinRoom: () => void
    handleRoomChange: (newRoom: string) => void
    setMessageList: React.Dispatch<React.SetStateAction<IMessage[]>>
    messageList: IMessage[]
    currentMessage: string
    setCurrentMessage: React.Dispatch<React.SetStateAction<string>>
    sendMessage: () => void
    isTyping: boolean
    userWhoIsTyping: string

}



const defaultValues = {
    isLoggedIn: false,
    username: "",
    room: "",
    roomList: [],
    userList: "",
    setRoom: () => { },
    setUsername: () => { },
    login: () => { },
    setRoomList: () => { },
    setUserList: () => { },
    joinRoom: () => { },
    handleRoomChange: () => { },
    setMessageList: () => { },
    messageList: [],
    currentMessage: "",
    setCurrentMessage: () => { },
    sendMessage: () => { },
    isTyping: true,
    userWhoIsTyping:"",
    
}


const SocketContext = createContext<ISocketContext>(defaultValues)
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext)
const socket = io("http://localhost:3001", { autoConnect: false} )


const SocketProvider = ({ children }: PropsWithChildren) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [roomList, setRoomList] = useState<string[]>([]);
    const [userList, setUserList] = useState("");
    const [previousRoom, setPreviousRoom] = useState("");
    const [messageList, setMessageList] = useState<IMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userWhoIsTyping, setUserWhoIsTyping] = useState("");



    useEffect (() => {
        if (room) {
            socket.emit("join_room", {previousRoom, room, username,}) 
        }
    },[room, username])

    useEffect(() => {
        socket.on("new_user_joined_chat", (username, room) => {
            console.log(username, room);
        });

        socket.on("list_of_rooms", (roomList) => {
            console.log(roomList); 
            setRoomList(roomList)
        });

        socket.on("user_disconnected", () => {
            console.log("user disconnected")
        });
    },[socket])
    

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    },[socket]);


    useEffect(() => {
      socket.emit("is_typing", { room, username, isTyping: !!currentMessage })
    },[currentMessage]);


    const login = () => {
        socket.connect()
        socket.emit("init_chat")  
        setIsLoggedIn(true)
        setRoom("Lobby")
        //setUserList för VG
    }


    const joinRoom = () => {
        if (room) {
            console.log(`Joined room: ${room}`);
            socket.emit("join_room", { room, username });
            
        }
    }
    

    const handleRoomChange = (newRoom: string) => {
        setMessageList([]);
        // Save the previous room value before updating the state
        setPreviousRoom(room);
        // Update the state with the new room value
        setRoom(newRoom);
        console.log("Previous room " + previousRoom)
        socket.emit("join_room", { previousRoom, room, username });
    };

    

    //  const handleTyping = (username, isTyping) => {
    //     socket.emit("user_is_typing")
    //  }  
    
    // Lyssna på "is_typing"-eventet från servern
    socket.on("user_is_typing", ({ username, isTyping }) => {
        setIsTyping(isTyping);
        setUserWhoIsTyping(username);
    });
    
    // useEffect(() => {
    //     // Lyssna på "user_is_typing"-eventet från servern
    //     socket.on("user_is_typing", ({ username, isTyping }) => {
    //       console.log(`Användare ${username} är skriverstatus: ${isTyping}`);
          
    //       // Uppdatera staten för isTyping och userWhoIsTyping
    //       setIsTyping(isTyping);
    //       setUserWhoIsTyping(username);
    //     });
      
    //     // Återställ isTyping och userWhoIsTyping när komponenten unmounts eller när du inte längre lyssnar
    //     return () => {
    //       setIsTyping(false);
    //       setUserWhoIsTyping("");
    //     };
    //   }, []); // Använd en tom beroendelista för att effekten ska köras en gång
      
    //   // ...
      
    //   // I din return-funktion
    //   {userWhoIsTyping && isTyping && (
    //     <p>{userWhoIsTyping} skriver...</p>
    // )}
      

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
    
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedTime = `${formattedHours}:${formattedMinutes}`;
    
            const messageData = {
                id: new Date().getTime(),
                room: room,
                author: username,
                message: currentMessage,
                time: formattedTime
            };
    
            await socket.emit("send_message", messageData);
            setMessageList([...messageList, messageData]);
            setCurrentMessage("");
        }
    };
    
    // const sendMessage = async () => {
    //     if (currentMessage !== "") {
    //       const now = new Date();
    //       const hours = now.getHours();
    //       const minutes = now.getMinutes();
      
    //       const formattedHours = hours.toString().padStart(2, '0');
    //       const formattedMinutes = minutes.toString().padStart(2, '0');
    //       const formattedTime = `${formattedHours}:${formattedMinutes}`;
      
    //       const messageData = {
    //         id: new Date().getTime(), // Unikt id genererat från tidsstämpel
    //         room: room,
    //         author: username,
    //         message: currentMessage,
    //         time: formattedTime
    //       };
      
    //       await socket.emit("send_message", messageData);
    //       setMessageList([...messageList, messageData]);
    //       console.log(messageData);
    //       setCurrentMessage("");
    //     }
    //   };
    

    return(
        <SocketContext.Provider value= {{ isLoggedIn, login, joinRoom, handleRoomChange,sendMessage, 
            username, setUsername, room, setRoom, roomList, setRoomList, userList, setUserList,  
            messageList, setMessageList, currentMessage, setCurrentMessage, isTyping, userWhoIsTyping }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
