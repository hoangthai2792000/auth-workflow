const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetPasswordURL = `${origin}/user/reset-password?token=${token}&email=${email}`
  const msg = `<p>Please reset your password by clicking the following link: <a href="${resetPasswordURL}">Reset Password</a></p>`
  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h3>Hello, ${name}</h3>
          ${msg}`,
  })
}

module.exports = sendResetPasswordEmail
