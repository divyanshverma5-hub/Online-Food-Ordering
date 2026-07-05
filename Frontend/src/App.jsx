import { useState } from 'react'
import './App.css'
import Registeration from './components/Registeration'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Home from './components/Home'
import Login from './components/Login'
import Footer from './components/footer'
import RestaurantRegister from './components/RestaurantRegister'
import HomeRestaurant from './components/HomeRestaurant'
import AddFood from './components/AddFood'
import EditFood from './components/EditFood'

function App() {
  return (
    <>
    {/* <h1>Home Page</h1> */}
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/registeration' element={<Registeration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/footer' element={<Footer/>}/>
      <Route path='/restaurantRegister' element={<RestaurantRegister/>}/>
      <Route path='/homeRestaurant' element={<HomeRestaurant/>}/>
      <Route path='/addFood' element={<AddFood/>}/>
      <Route path='/editFood' element={<EditFood/>}/>
      
    </Routes>

    {/* make the HOME PAGE OF CUSTOMER (add locationwise R. + map)  */}
    
      <ToastContainer position='bottom-right'/>
    </>
  )
}

export default App
