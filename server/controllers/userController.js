const User = require('../models/User')
const customError = require('../errors/customError')
const createTokenUser = require('../utils/createTokenUser')
const { sendCookies } = require('../utils/jwt')
const checkPermission = require('../utils/checkPermisson')

// GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')

  res.status(200).json({ users })
}

// GET SINGLE USER
const getSingleUser = async (req, res) => {
  // console.log(req.user)
  const user = await User.findOne({ _id: req.params.id }).select('-password')

  if (!user) {
    throw new customError(`No user with the id: ${req.params.id}`, 404)
  }

  checkPermission(req.user, user._id)

  res.status(200).json({ user })
}

// SHOW CURRENT USER
const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user })
}

// UPDATE USER
const updateUser = async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    throw new customError('Please provide name and email', 400)
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email, role: req.user.role },
    { new: true, runValidators: true }
  )

  const tokenUser = createTokenUser(user)
  sendCookies({ res, user: tokenUser })

  res.status(200).json({ user: tokenUser })
}

// UPDATE USER PASSWORD
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new customError('Please provide old and new password', 400)
  }

  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.checkPassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new customError('Wrong Password, Please try again', 401)
  }

  user.password = newPassword
  await user.save()

  res.status(200).json({ msg: 'Password Changed' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
