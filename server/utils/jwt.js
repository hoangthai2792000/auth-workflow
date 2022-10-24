const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)

  return token
}

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET)

const sendCookies = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: user })
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day
  })

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // one month
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

// const sendSingleCookie = ({ res, user }) => {
//   const token = createJWT({ payload: user })

//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // one day
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   })
// }

module.exports = { createJWT, verifyJWT, sendCookies }
