require("dotenv").config();
const Course = require("../models/Course.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
//const uploadToCloudinary = require("../config/cloudinary.js");


const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);


const mongoose = require("mongoose");


const cropImage = async function (fileName) {
    try {
        const filePath = path.join('public/images/', fileName);
        const outputFilePath = path.join('public/images/', 'output-' + fileName);
        console.log(filePath);
    
        // Wrap sharp in a Promise
        await new Promise((resolve, reject) => {
          sharp(filePath)
            .resize(500, 500)
            .toFile(outputFilePath, (err, info) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                console.log(info);
                resolve();
              }
            });
        });
    
        // Rename the output file to the original file
        await rename(outputFilePath, filePath);
    } catch (error) {
        throw error;
    }
}




module.exports = {
    cropImage,


}