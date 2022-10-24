const { verifyJWT } = require('../utils/jwt')
const customError = require('../errors/customError')
const Token = require('../models/Token')
const { sendCookies } = require('../utils/jwt')

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken)
      req.user = {
        userId: payload.userId,
        name: payload.name,
        role: payload.role,
      }
      // console.log(payload)
      return next()
    }

    const payload = verifyJWT(refreshToken)
    // console.log(payload)
    const existingRefreshToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existingRefreshToken || !existingRefreshToken?.isValid) {
      throw new customError('Authenticated Error', 401)
    }

    sendCookies({
      res,
      user: payload.user,
      refreshToken: existingRefreshToken.refreshToken,
    })

    req.user = payload.user
    next()
  } catch (error) {
    throw new customError('Authenticated Error', 401)
  }
}

const authorizePermissions = (...roles) => {
  // console.log(role)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError('Unauthorized to access this route', 403)
    }
    next()
  }
}

module.exports = { authenticateUser, authorizePermissions }
