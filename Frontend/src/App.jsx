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
    </Routes>

    {/* tomorrow: make the profile page of restaurant owner + home page (cart/orders)  */}
    
      <ToastContainer position='bottom-right'/>
    </>
  )
}

export default App
