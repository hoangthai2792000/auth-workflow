const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    comment: {
      type: String,
      minLength: 5,
      required: [true, 'Please provide your comment'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

// One user One review
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.averageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 },
      },
    },
  ])
  // console.log(result)
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numberOfReviews: result[0]?.numberOfReviews || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

ReviewSchema.post('save', async function () {
  await this.constructor.averageRating(this.product)
})

ReviewSchema.post('remove', async function () {
  await this.constructor.averageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
