// const CustomError = require('../errors/customError')
const errorHandlerMiddleware = async (err, req, res, next) => {
  console.log(err)

  let customError = {
    // set default
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong, please try again later',
  }

  // if (err instanceof CustomError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // Duplicate error
  if (err.code && err.code === 11000) {
    customError.msg = `Your ${Object.keys(
      err.keyValue
    )} is duplicated, please choose another one`

    customError.statusCode = 400
  }

  // Validation error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')

    customError.statusCode = 400
  }

  // Cast Error
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(500).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
