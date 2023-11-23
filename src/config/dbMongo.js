const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb+srv://thduy161103:A6DWueoYXaz2NLtO@cluster0.7dzahsd.mongodb.net/TUS?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
    });
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log("Connect failure!!!");
  }
}
module.exports = {connect};