import { useState, useEffect } from 'react'
import './App.css'
import Registeration from './components/Registeration'
import { Route, Routes } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";

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
import ProtectedRoute from './components/ProtectedRoute';

import { connectSocket } from "./utils/socket";

function App() {

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {

    const socket = connectSocket();
    if (!socket) return;
    const role = localStorage.getItem("role");

    // Restaurant notifications
    if (role === "restaurant") {
      const handleNewOrder = (data) => {
        console.log("🔔 NEW ORDER RECEIVED:", data);
        toast.success("🔔 New Order Received!");
      };

      socket.on("new-order", handleNewOrder);

      return () => {
        socket.off("new-order", handleNewOrder);
      };
    }

    // Customer notifications
    if (role === "customer") {
      const handleStatusUpdate = (data) => {
        console.log("🔔 ORDER STATUS UPDATED:", data);
        toast.info(
          `Order #${data.orderId} is now ${data.status}`
        );
      };

      socket.on("order-status-updated", handleStatusUpdate);

      return () => {
        socket.off("order-status-updated", handleStatusUpdate);
      };
    }

  }, []);

  return (
    <>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/registeration' element={<Registeration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/footer' element={<Footer />} />
        <Route path='/restaurantRegister' element={<RestaurantRegister />} />
        <Route path='/restaurantLogin' element={<RestaurantLogin />} />
        <Route path='/home_to_restaurant_page/:id' element={<Home_to_restaurant_page />} />
        <Route path='/restaurantNavbar' element={<RestaurantNavbar />} />
        <Route path='/customerNavbar' element={<CustomerNavbar />} />
        <Route path='/viewItems' element={<ViewItems />} />

        {/* customer only */}
        <Route path='/cart' element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
        <Route path='/cart/confirmation' element={<ProtectedRoute role="customer"> <Confirmation /> </ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
        <Route path='/profileCustomer' element={<ProtectedRoute role="customer"><ProfileCustomer /></ProtectedRoute>} />

        {/* restaurant only */}
        <Route path='/homeRestaurant' element={<ProtectedRoute role="restaurant"><HomeRestaurant /></ProtectedRoute>} />
        <Route path='/addFood' element={<ProtectedRoute role="restaurant"><AddFood /></ProtectedRoute>} />
        <Route path='/editFood' element={<ProtectedRoute role="restaurant"><EditFood /></ProtectedRoute>} />
        <Route path='/restaurantOrders' element={<ProtectedRoute role="restaurant"><RestaurantOrders /></ProtectedRoute>} />
        <Route path='/profileRestaurant' element={<ProtectedRoute role="restaurant"><ProfileRestaurant /></ProtectedRoute>} />

      </Routes>


      <ToastContainer position='bottom-right' />
    </>
  )
}

// add phone number
// availability

export default App
