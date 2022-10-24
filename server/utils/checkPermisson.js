const customError = require('../errors/customError')

const checkPermission = (requestUser, resourceUserId) => {
  // console.log(requestUser)
  // console.log(resourceUserId)
  // console.log(typeof resourceUserId)
  if (requestUser.role === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new customError('Not authorized to access this route', 403)
}

module.exports = checkPermission
