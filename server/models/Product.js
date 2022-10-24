const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name must be provided'],
      maxLength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price must be provided'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Description must be provided'],
      maxLength: [1000, 'Description can not be more than 1000 characters'],
      default: '',
    },
    image: {
      type: String,
      default: '/uploads/defaultIMG.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Category must be provided'],
      enum: {
        values: ['Laptop', 'PC', 'Mobile Phone', 'Accessories'],
        messages: '{VALUE} is not supported',
      },
    },
    brand: {
      type: String,
      required: [true, 'Brand must be provided'],
      enum: {
        values: ['Asus', 'Acer', 'HP', 'Samsung', 'Apple', 'Xiaomi'],
        messages: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})

ProductSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', ProductSchema)
