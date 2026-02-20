import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import api from "../api/axios";
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { ChevronRight, X } from "lucide-react";
import { Input } from '@/components/ui/input'



const Products = () => {
    const { products } = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [sortOrder, setSortOrder] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const [priceRange, setPriceRange] = useState([0, 999999])
    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/product/getallproducts`)
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts]

        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))
    }, [search, category, allProducts, brand, sortOrder, priceRange, dispatch])

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <div className="pt-20 pb-10 relative">
            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6">

                {isFilterOpen && (
                    <div
                        onClick={() => setIsFilterOpen(false)}
                        className="fixed inset-0 bg-black/40 z-30"
                    />
                )}

                {/* FILTER SIDEBAR */}
                <div
                    className={` fixed pl-2 pr-2 top-0 left-0 z-40 bg-white w-72 h-full transform transition-transform duration-300 ${isFilterOpen ? " translate-x-0" : " mt-4 -translate-x-full"} lg:static lg:h-auto lg:transform-none lg:translate-x-0 `} >

                    {/* Close button (mobile only) */}
                    <div className="lg:hidden flex justify-end p-3">
                        <button onClick={() => setIsFilterOpen(false)}>
                            <X />
                        </button>
                    </div>

                    <FilterSidebar
                        allProducts={allProducts}
                        priceRange={priceRange}
                        search={search}
                        setSearch={setSearch}
                        brand={brand}
                        setBrand={setBrand}
                        category={category}
                        setCategory={setCategory}
                        setPriceRange={setPriceRange}
                    />
                </div>

                {/* MAIN CONTENT */}
                <div
                    className={`flex flex-col flex-1 transition-opacity ${isFilterOpen ? "opacity-50 pointer-events-none" : "opacity-100"
                        }`}
                >

                    {/* TOP BAR */}
                    <div className="flex justify-between items-center mt-3 mb-4">
                        <div className="flex items-center gap-3">
                            {/* FILTER BUTTON (mobile / tablet only) */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 border border-teal-600 text-teal-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-teal-50 transition" >
                                Filter
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-gray-50 border w-full rounded-lg"
                            />
                        </div>

                        {/* SORT */}
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-40 sm:w-52">
                                <SelectValue placeholder="Sort by Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowToHigh">
                                        Price: Low → High
                                    </SelectItem>
                                    <SelectItem value="highToLow">
                                        Price: High → Low
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                loading={loading}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )



}

export default Products