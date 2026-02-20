import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'


const FilterSidebar = ({ search, setSearch, brand, setBrand, category, setCategory, setPriceRange, allProducts, priceRange }) => {

    const Categories = allProducts.map(p => p.category)
    const UniqueCategory = ["All", ...new Set(Categories)]


    const Brands = allProducts.map(p => p.brand)
    const UniqueBrand = ["All", ...new Set(Brands)]

    const handleCategory = (val) => {
        setCategory(val)
    }

    const handleBrand = (e) => {
        setBrand(e.target.value)
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        setPriceRange([Math.min(value, priceRange[1] - 100), priceRange[1]])
    }


    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        setPriceRange([priceRange[0], Math.max(value, priceRange[0] + 100)])
    }


    const resetFilters = () => {
        setSearch("")
        setCategory("All")
        setBrand("All")
        setPriceRange([0, 999999])
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm h-max w-full lg:w-64 border">

            {/* Title */}
            <h1 className="text-lg font-semibold mb-4 text-gray-700">
                Filters
            </h1>

            
            {/* Category */}
            <div className="mb-5">
                <h1 className="font-semibold text-gray-700 mb-3">Category</h1>

                <div className="flex flex-col gap-2">
                    {UniqueCategory.map((item, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <input
                                type="radio"
                                checked={category === item}
                                onChange={() => handleCategory(item)}
                                className="accent-teal-600"
                            />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="mb-5 relative">
                <h1 className="font-semibold text-gray-700 mb-2">Brand</h1>

                <select
                    className="bg-gray-50 w-full p-2 border rounded-lg appearance-none"
                    value={brand}
                    onChange={handleBrand}
                >
                    {UniqueBrand.map((item, index) => (
                        <option key={index} value={item}>
                            {item.toUpperCase()}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={18}
                    className="absolute right-3 top-9 text-gray-500 pointer-events-none"
                />
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h1 className="font-semibold text-gray-700 mb-2">Price Range</h1>

                <p className="text-sm text-gray-600 mb-2">
                    ₹{priceRange[0]} – ₹{priceRange[1]}
                </p>

                <div className="flex items-center gap-2 mb-3">
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={handleMinChange}
                        className="w-20 p-1 border rounded-md text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        value={priceRange[1]}
                        onChange={handleMaxChange}
                        className="w-20 p-1 border rounded-md text-sm"
                    />
                </div>

                <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[0]}
                    onChange={handleMinChange}
                    className="w-full accent-teal-600"
                />

                <input
                    type="range"
                    min="0"
                    max="999999"
                    step="100"
                    value={priceRange[1]}
                    onChange={handleMaxChange}
                    className="w-full accent-teal-600 mt-2"
                />
            </div>

            {/* Reset */}
            <Button
                onClick={resetFilters}
                className="bg-teal-600 text-white w-full rounded-lg hover:bg-teal-700"
            >
                Reset Filters
            </Button>

        </div>
    );


}

export default FilterSidebar
