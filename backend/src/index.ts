import app from './app';

export default app;

// Vercel serverless function compatibility wrappers
module.exports = app;
module.exports.default = app;
