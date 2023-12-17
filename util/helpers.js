const exphbs = require('express-handlebars');
const handlebars = exphbs.create({
    // Specify your custom helpers if needed
    extname: '.hbs',
    helpers: {
      eq: (a, b) => a===b,
      percent: (a, b) => (100-a*100/b).toFixed(0),
      // Add other helpers if needed
    }
  });

module.exports = handlebars;