/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, createContext, useContext, useState, useEffect, useRef } from "react"
import { io } from "socket.io-client";

interface IMessage {
    id: number
    room: string
    author: string
    message: string
    time: string
}

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
    scroll: React.RefObject<HTMLDivElement> | null;
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
    scroll: null,
    isTyping: true,
    userWhoIsTyping: "", 
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
    const scroll = useRef<HTMLDivElement | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [userWhoIsTyping, setUserWhoIsTyping] = useState("");
    
    
    useEffect (() => {
        if (room) {
            socket.emit("join_room", {previousRoom, room, username,}) 
        }
    },[room, username])

    useEffect(() => {
        socket.on("new_user_joined_chat", (username, room) => {
            //console.log(username, room);
        });

        socket.on("list_of_rooms", (roomList) => {
            setRoomList(roomList)
        });

        socket.on("user_disconnected", () => {
            //console.log("user disconnected")
        });

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        socket.on("user_is_typing", ({ username, isTyping }) => {
            setIsTyping(isTyping);
            setUserWhoIsTyping(username);
        });
    },[socket])
    

    useEffect(() => {
        scroll.current?.scrollIntoView(false)
    }, [messageList])

    useEffect(() => {
        socket.emit("is_typing", { room, username, isTyping: !!currentMessage })
      },[currentMessage]);


    const login = () => {
        socket.connect()
        socket.emit("init_chat")  
        setIsLoggedIn(true)
        setRoom("Lobby")
    }

    const joinRoom = () => {
        if (room) {
            //console.log(`Joined room: ${room}`);
            socket.emit("join_room", { room, username });
        }
    };
    
    const handleRoomChange = (newRoom: string) => {
        setMessageList([]);
        setPreviousRoom(room);
        setRoom(newRoom);
        console.log("Previous room " + previousRoom)
        socket.emit("join_room", { previousRoom, room, username });
    };

    const sendMessage = async () => {
        if (currentMessage !== "") {
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
            console.log(messageData);
            setCurrentMessage("");
        }
    };
    

    return(
        <SocketContext.Provider value= {{ isLoggedIn, login, joinRoom, handleRoomChange,sendMessage, 
            username, setUsername, room, setRoom, roomList, setRoomList, userList, setUserList,  
            messageList, setMessageList, currentMessage, setCurrentMessage, scroll, isTyping, userWhoIsTyping }}>
            {children}
        </SocketContext.Provider>
    )
};

export default SocketProvider
