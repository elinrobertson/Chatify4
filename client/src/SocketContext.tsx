import { PropsWithChildren, createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client";

interface ISocketContext {
    isLoggedIn: boolean
    username: string
    room: string
    roomList: string
    userList: string
    setRoom: React.Dispatch<React.SetStateAction<string>>
    setUsername: React.Dispatch<React.SetStateAction<string>>
    login: () => void   
    setRoomList: React.Dispatch<React.SetStateAction<string>>
    setUserList: React.Dispatch<React.SetStateAction<string>>
}

const defaultValues = {
    isLoggedIn: false,
    username: "",
    room: "",
    roomList: "",
    userList: "",
    setRoom: () => { },
    setUsername: () => { },
    login: () => { },
    setRoomList: () => { },
    setUserList: () => { },
}

const SocketContext = createContext<ISocketContext>(defaultValues)
export const useSocket = () => useContext(SocketContext)
const socket = io("http://localhost:3001", { autoConnect: false} )


const SocketProvider = ({ children }: PropsWithChildren) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [roomList, setRoomList] = useState("");
    const [userList, setUserList] = useState("");

    useEffect (() => {
        if (room) {
            socket.emit("join_room", {room, username,})
            
        }
    }, [room, username])

    useEffect(() => {
        socket.on("new_user_joined_chat", (username, room) => {
            console.log(username, room);
            
        })
    },[socket])

    const login = () => {
        socket.connect()
        setIsLoggedIn(true)
        setRoom("lobby")
    }


    return(
        <SocketContext.Provider value= {{ username, isLoggedIn, login, setUsername, 
        room, setRoom, roomList, setRoomList, userList, setUserList }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
