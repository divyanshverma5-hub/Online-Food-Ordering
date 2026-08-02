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
import Home_to_restaurant_page from './components/Home_to_restaurant_page'
import RestaurantLogin from './components/RestaurantLogin'
import Cart from './components/Cart'
import Confirmation from './components/Confirmation'
import Orders from './components/Orders'
import RestaurantOrders from './components/RestaurantOrders'
import ViewItems from './components/ViewItems'
import CustomerNavbar from './components/CustomerNavbar'
import RestaurantNavbar from './components/RestaurantNavbar'
import ProfileCustomer from './components/ProfileCustomer'
import ProfileRestaurant from './components/ProfileRestaurant'



function App() {
  return (
    <>
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/registeration' element={<Registeration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/footer' element={<Footer/>}/>
      <Route path='/restaurantRegister' element={<RestaurantRegister/>}/>
      <Route path='/homeRestaurant' element={<HomeRestaurant/>}/>
      <Route path='/addFood' element={<AddFood/>}/>
      <Route path='/editFood' element={<EditFood/>}/>
      <Route path='/home_to_restaurant_page/:id' element={<Home_to_restaurant_page/>}/>
      <Route path='/restaurantLogin' element={<RestaurantLogin/>}/>
      <Route path='/cart' element={<Cart/>} />
      <Route path='/cart/confirmation' element={<Confirmation/>} />
      <Route path='/orders' element={<Orders/>} />
      <Route path='/restaurantOrders' element={<RestaurantOrders/>}/>
      <Route path='/viewItems' element={<ViewItems/>}/>
      <Route path='/customerNavbar' element={<CustomerNavbar/>}/>
      <Route path='/restaurantNavbar' element={<RestaurantNavbar/>}/>
      <Route path='/profileCustomer' element={<ProfileCustomer/>}/>
      <Route path='/profileRestaurant' element={<ProfileRestaurant/>}/>
    </Routes>

    {/* (If anybody reading, ignore it, its for me)
        // Make unavailable instead of delete!
        //if order rejected then 
    */}
    
      <ToastContainer position='bottom-right'/>
    </>
  )
}

export default App
