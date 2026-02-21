import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import Logo from '../assets/Logo.png'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
        const navigate = useNavigate()

    return (
        <footer className='bg-gray-900 text-gray-200 py-12'>
            <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>

                {/* info */}
                <div className='mb-6 md:mb-0'>
                    <Link to='/'>
                        <img src='/Ekart.png' alt="" className='w-32' />
                    </Link>
                    <p className='mt-2 text-sm'>Powering Your World with the Best in Electronics.</p>
                    <p className='mt-2 text-sm'>123 Tech park, HiTech City, Hyderabad, India</p>
                    <p className='text-sm'>Email: bazarioelectronics@gmail.com</p>
                    <p className='text-sm'>Phone: +91 98xxx 4xx10</p>
                </div>

                {/* customer service link */}
                <div className='mb-6 md:mb-0'>
                    <h3 className='text-xl font-semibold'>Customer Service</h3>
                    <ul className='mt-2 text-sm space-y-2'>
                        <li className=' cursor-pointer ' onClick={() => navigate('/contact')} >Contact Us</li>
                        <li className=' cursor-pointer ' onClick={() => navigate('/shipping-returns')}>Shipping & Returns</li>
                        <li className=' cursor-pointer ' onClick={() => navigate('/faqs')}>FAQs</li>
                        <li className=' cursor-pointer ' onClick={() => navigate('/order-tracking')}>Order Tracking</li>
                    </ul>
                </div>

                {/* social media links */}
                <div className='mb-6 md:mb-0'>
                    <h3 className='text-xl font-semibold'>Follow Us</h3>
                    <div className='flex space-x-4 mt-2'>
                        <FaFacebook />
                        <FaInstagram />
                        <FaTwitterSquare />
                        <FaPinterest />
                    </div>
                </div>

                {/* newsletter subscription */}
                <div>
                    <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
                    <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
                    <form action="" className='mt-4 flex'>
                        <input
                            type="email"
                            placeholder='Your email address'
                            className='w-full p-2 rounded-l-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500'
                        />
                        <button type='submit' className='bg-teal-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
                    </form>
                </div>
            </div>

            {/* bottom section */}
            <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
                <p>&copy; {new Date().getFullYear()} <span className='text-teal-600'>bazario</span>. All rights reserved</p>
            </div>
        </footer >
    )
}

export default Footer
