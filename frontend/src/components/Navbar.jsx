import { Menu, ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import api from '../api/axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/userSlice'
import { setAddresses } from '@/redux/productSlice';

const Navbar = () => {

  const { user } = useSelector(store => store.user)
  const { cart } = useSelector(store => store.product)
  const accessToken = localStorage.getItem('accessToken')
  const admin = user?.role === "admin" ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await api.post(
        `/user/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        dispatch(setAddresses([]));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
      console.log(error);
    }
  };


  return (
    <header className='bg-teal-50 fixed w-full z-20 border-b border-teal-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-1 px-4'>

        {/* Left Section: Menu + Logo */}
        <div className='flex items-center gap-2'>
          {/* Menu Icon: Visible on mobile/medium, hidden on desktop (large) */}
          <div className='lg:hidden cursor-pointer' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className='text-teal-800' />
          </div>

          <img src="/Logo.png" alt="" className='w-20 md:w-25' />
        </div>

        {/* Nav Section */}
        <nav className='flex gap-4 md:gap-10 justify-between items-center'>
          {/* Desktop Menu: Hidden on small/medium, flex on large */}
          <ul className='hidden lg:flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>}
            {admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>}
          </ul>

          <div className='flex items-center gap-4 md:gap-8'>
            <Link to={'/cart'} className='relative'>
              <ShoppingCart />
              <span className='bg-teal-500 rounded-full absolute text-white -top-3 -right-3 md:-right-5 px-2 text-xs md:text-base'>
                {cart?.items?.length || 0}
              </span>
            </Link>

            {user ?
              <Button onClick={logoutHandler} className='bg-teal-600 text-white cursor-pointer hover:bg-teal-800 text-sm md:text-base'>Logout</Button> :
              <Button onClick={() => navigate('/login')} className='bg-teal-600 text-white cursor-pointer hover:bg-teal-800 text-sm md:text-base' >Login</Button>
            }
          </div>
        </nav>
      </div>

      {/* Mobile/Medium Dropdown Menu */}
      {isMenuOpen && (
        <div className='lg:hidden bg-teal-50 border-b border-teal-200 absolute w-full left-0 p-4 shadow-lg'>
          <ul className='flex flex-col gap-4 text-lg font-semibold text-teal-900'>
            <Link to={'/'} onClick={() => setIsMenuOpen(false)}><li>Home</li></Link>
            <Link to={'/products'} onClick={() => setIsMenuOpen(false)}><li>Products</li></Link>
            {user && (
              <Link to={`/profile/${user._id}`} onClick={() => setIsMenuOpen(false)}>
                <li>Hello, {user.firstName}</li>
              </Link>
            )}
            {admin && (
              <Link to={`/dashboard/sales`} onClick={() => setIsMenuOpen(false)}>
                <li>Dashboard</li>
              </Link>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar
