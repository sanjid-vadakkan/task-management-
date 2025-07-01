import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Task from './pages/taskPage.jsx';
import AddTask from './pages/AddTask.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import EditTask from './pages/EditeTask.jsx';
import ViewTask from './pages/ViewTaksk.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Task />} />
      <Route path="/add-task" element={<AddTask />} />
      <Route path="/edit-task/:id" element={<EditTask />} />
      <Route path="/view-task/:id" element={<ViewTask />} />


  
    </Routes>
     <ToastContainer />
    </>
  )
}

export default App
