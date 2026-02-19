import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className="bg-linear-to-r from-olive-700 via-emerald-700 to-teal-700 text-white">
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:pb-14 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* TEXT CONTENT */}
                    <div className="text-center md:text-left">
                        <h1 className="font-bold leading-tight
                         text-xl sm:text-2xl md:text-5xl lg:text-6xl
                         mb-2 sm:mb-3">
                            Latest Electronics at Best Prices
                        </h1>

                        <p className="text-xs sm:text-sm md:text-lg
                        text-white/90
                        mb-4 sm:mb-6
                        max-w-md mx-auto md:mx-0">
                            Discover cutting-edge technology with unbeatable deals on smartphones,
                            laptops and more.
                        </p>

                        <div className="flex justify-center md:justify-start">
                            <Button
                                onClick={() => navigate("/products")}
                                className="bg-white text-emerald-700 hover:bg-gray-100
                         px-5 py-2 text-xs sm:text-sm md:text-base
                         rounded-md w-fit"
                            >
                                Shop Now
                            </Button>
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5">
                            <img
                                src="/hero1.png"
                                alt="Featured product"
                                className="w-48 sm:w-56 md:w-105 lg:w-125
                         rounded-xl shadow-xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );


}

export default Hero