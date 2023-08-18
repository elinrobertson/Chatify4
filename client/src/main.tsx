import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SocketProvider from './SocketContext.tsx'
import "./main.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
  <SocketProvider>
    <App />
  </SocketProvider>
  //</React.StrictMode>,
)
