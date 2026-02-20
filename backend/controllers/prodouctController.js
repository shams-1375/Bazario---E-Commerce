import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

//add product 
export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body
        const userId = req.id
        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //handle multiple image uploads
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "bazario_products"
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        //create a product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg, //array of objects
        })
        return res.status(200).json({
            success: true,
            message: "Product Added Successfully",
            product: newProduct
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No product available",
                products: []
            })
        }
        return res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        //delete images from cloudinar
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id)
            }
        }

        await Product.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body

        const product = await Product.findById(id)
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Product Not found"
            })
        }

        let updatedImages = []
        //keep selected images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages)
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            )

            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            )

            for (let image of removedImages) {
                await cloudinary.uploader.destroy(image.public_id)
            }
        } else {
            updatedImages = product.productImg //keep all if nothing sent
        }

        //upload new images
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "bazario_products"
                })
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }

        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        // Ensure updatedImages is always an array
        product.productImg = updatedImages || [];
        await product.save();

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}