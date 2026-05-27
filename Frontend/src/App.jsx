import './App.css'
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./temp.jsx";
import { useMyContext } from './MyContext.jsx';

function App() {
  const { theme } = useMyContext();

  return (
    <div className={`main theme-${theme}`}>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>
    </div>
  )
}

export default App
