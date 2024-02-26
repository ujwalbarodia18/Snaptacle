// mocha.config.js
module.exports = {
    spec: 'tests/**/*.spec.js', // Path to your test files
    require: ['@babel/register', 'tests/mocha.setup.mjs'], // Additional setup files
    recursive: true, // Include subdirectories in test search
  };
  