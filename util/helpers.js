const exphbs = require('express-handlebars');
const handlebars = exphbs.create({
    // Specify your custom helpers if needed
    extname: '.hbs',
    helpers: {
      eq: (a, b) => a===b,
      // Add other helpers if needed
    }
  });

module.exports = handlebars;