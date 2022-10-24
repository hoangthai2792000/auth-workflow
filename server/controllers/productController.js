const Product = require('../models/Product')
const customError = require('../errors/customError')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate('reviews')
  res.status(200).json({ totalProducts: products.length, products })
}

// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id })

  if (!product) {
    throw new customError(
      `Can not find any products with the id: ${req.params.id}`,
      400
    )
  }

  res.status(200).json({ product })
}

// CREATE PRODUCT
const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)

  res.status(201).json({ product })
}

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  )

  if (!product) {
    throw new customError(
      `Can not find any product with the ID: ${req.prams.id}`,
      400
    )
  }

  res.status(200).json({ product })
}

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id })

  if (!product) {
    throw new customError(
      `Can not find any product with the ID: ${req.prams.id}`,
      400
    )
  }

  await product.remove()

  res.status(200).json({ msg: 'Product Deleted' })
}

// UPLOAD IMAGE
const uploadImage = async (req, res) => {
  // console.log(req.files)

  if (!req.files) {
    throw new customError('No File Uploaded', 400)
  }

  const productImg = req.files.image

  if (!productImg.mimetype.startsWith('image')) {
    throw new customError('Image Only!!!', 400)
  }

  if (productImg.size > 1024 * 1024) {
    throw new customError('Please upload image smaller than 1MB', 400)
  }

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'ecommerce-api',
    }
  )
  fs.unlinkSync(req.files.image.tempFilePath)

  return res.status(200).json({ image: { src: result.secure_url } })
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
