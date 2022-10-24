const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  // This link was already set up on the front end
  const verifyEmailURL = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

  const msg = `<p>Please confirm your account by clicking the following link: <a href="${verifyEmailURL}">Verify Account</a> </p>`

  return sendEmail({
    to: email,
    subject: 'Verify Account',
    html: `<h3>Hello ${name}</h3>
    ${msg}
    `,
  })
}

module.exports = sendVerificationEmail
