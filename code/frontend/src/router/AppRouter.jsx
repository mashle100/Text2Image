import React from 'react'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Detail from '../pages/Detail/Detail'
import Login from '../pages/Login/Login'
import Settings from '../pages/Settings/settings'
import Signup from '../pages/Signup/Signup'
import History from '../pages/History/history'


const AppRouter = () => {
  return (
    <div>
        <BrowserRouter>
            {/* <Navbar/> */}
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route patg = '/about' element={<About/>}/>
                <Route path = '/contact' element={<Detail/>}/>
                <Route path = '/Login' element={<Login/>}/>
                <Route path = '/detail' element={<Detail/>}/>
                <Route path = '/settings' element={<Settings/>}/>
                <Route path= '/Signup' element={<Signup/>}/>
                <Route path='/history' element={<History/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default AppRouter