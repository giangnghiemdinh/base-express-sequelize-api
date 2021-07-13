const nodemailer = require('nodemailer');
const config = require('../configs/config');
const logger = require('../configs/logger');
const path = require('path');
const Email = require('email-templates');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const email = new Email({
  views: { root: path.resolve(__dirname, '../templates') },
  message: {
    from: 'support@your-app.com',
  },
  send: true,
  preview: false,
  transport: transport,
});

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  email
    .send({
      template: 'layout',
      message: {
        to: to,
      },
      locals: {
        productName: 'Test App',
        emailType: 'Reset password',
        url: `http://link-to-app/reset-password?token=${token}`,
      },
    })
    .catch(() => console.log('Error sending email'));
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  email
    .send({
      template: 'layout',
      message: {
        to: to,
      },
      locals: {
        productName: 'Test App',
        emailType: 'Verification Email',
        url: `http://link-to-app/verify-email?token=${token}`,
      },
    })
    .catch(() => console.log('Error sending email'));
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail,
};
