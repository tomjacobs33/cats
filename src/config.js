module.exports = {
  // Server values
  port: process.env.PORT || 3000,
  host: process.env.VCAP_APP_HOST || 'localhost',

  auth: {
    jwt: {
      secret: 'cat-jwt-secret',
    },
  },
};
