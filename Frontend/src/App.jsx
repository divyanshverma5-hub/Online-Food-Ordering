import { useState } from 'react'
import './App.css'
import Registeration from './components/Registeration'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'

function App() {

  return (
    <>
    {/* <h1>Home Page</h1> */}
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/registeration' element={<Registeration/>}/>
    </Routes>
    
    </>
  )
}

export default App
