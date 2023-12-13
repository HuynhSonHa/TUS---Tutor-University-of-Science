const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
<<<<<<< Updated upstream
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
=======
      useNewUrlParser: true,
      useUnifiedTopology: true,
>>>>>>> Stashed changes
      //useCreateIndex: true,
    });
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!!");
  }
}
module.exports = {connect};