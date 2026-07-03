import { useState } from 'react'
import './App.css'
import Registeration from './components/Registeration'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
function App() {

  return (
    <>
    {/* <h1>Home Page</h1> */}
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/registeration' element={<Registeration/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    
    </>
  )
}

export default App
