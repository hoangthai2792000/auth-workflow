const Review = require('../models/Review')
const Product = require('../models/Product')

const customError = require('../errors/customError')
const checkPermission = require('../utils/checkPermisson')

// Create Review
const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new customError(`No product with id: ${productId}`, 404)
  }

  const isReviewExisted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })

  if (isReviewExisted) {
    throw new customError(
      'You have already submitted a review for this product',
      400
    )
  }

  req.body.user = req.user.userId
  const review = await Review.create(req.body)

  res.status(201).json({ review })
}

// Get All Reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name brand price',
    })
    .populate({
      path: 'user',
      select: 'name',
    })
  res.status(200).json({ totalReviews: reviews.length, reviews })
}

// Get Single Review
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
    .populate({
      path: 'product',
      select: 'name brand price',
    })
    .populate({
      path: 'user',
      select: 'name',
    })

  if (!review) {
    throw new customError(
      `Can not find any reviews with the id: ${req.params.id}`,
      400
    )
  }

  res.status(200).json({ review })
}

// Update Review
const updateReview = async (req, res) => {
  const reviewId = req.params.id
  const { rating, comment } = req.body

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new customError(`No review with the id: ${reviewId}`, 404)
  }

  checkPermission(req.user, review.user)

  review.rating = rating
  review.comment = comment

  await review.save()

  res.status(200).json({ review })
}

// Delete Review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id

  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new customError(`No review with the id: ${reviewId}`, 404)
  }

  checkPermission(req.user, review.user)

  await review.remove()

  res.status(200).json({ msg: 'Review deleted' })
}

const getSingleProductReviews = async (req, res) => {
  const productId = req.params.id
  const reviews = await Review.find({ product: productId })
  res.status(200).json({ totalReviews: reviews.length, reviews })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
