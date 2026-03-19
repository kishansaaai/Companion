import './App.css'
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./temp.jsx";
import { MyProvider } from './MyContext.jsx';

function App() {
  return (
    <div className='main'>
    <MyProvider>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>
    </MyProvider>
    </div>
  )
}

export default App
