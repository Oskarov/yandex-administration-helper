const path = require('path');

module.exports = {
  mode: 'production',

  output: {
    environment: {
      arrowFunction: false,
    },

    path: path.resolve(__dirname, 'scripts/custom_game'),
  },
};
