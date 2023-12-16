require("dotenv").config();
const Course = require("../models/Course.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
//const uploadToCloudinary = require("../config/cloudinary.js");

const mongoose = require("mongoose");

const filteredAndSorted = async function (name, tutorName, faculty, average, minPrice, maxPrice, sortByField, sortByOrder) {
    const fliter = {};
    const sort = {};

    // Fliter
    // fliter.status = "Available";
    if (name !== `None` && name) {
        fliter.name = name;
    }
    if (tutorName !== "None" && tutorName) {
        try {
            const tutor = await User.find({username: tutorName, role: "tutor"})
            fliter.tutor = tutor._id;

        } catch (error) {
            delete fliter.tutor;
            console.log("Tutor invalid", error);
        }
    }
    if (faculty !== `None` && faculty) {
        fliter.faculty = faculty;
    }
    if(average) {
        fliter.average = average;
    }
    if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (minPrice <= maxPrice) {
            fliter.price = { $gte: minPrice, $lte: maxPrice };
        }
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
        sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }

    try {
        const result = await Course.find(fliter).sort(sort).populate('tutor');

        return result;
    } catch (error) {
        console.log("Error in PrfilteredAndSortedProducts of Product Services", error);
        throw error;
    }

}

const filteredSortedPaging = async function (name, tutorName, faculty, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize) {
    const fliter = {};
    const sort = {};

    // Fliter
    // fliter.status = "Available";
    if (name !== `None` && name) {
        fliter.name = name;
    }
    if (tutorName !== "None" && tutorName) {
        try {
            const tutor = await User.find({username: tutorName, role: "tutor"})
            fliter.tutor = tutor._id;

        } catch (error) {
            delete fliter.tutor;
            console.log("Tutor invalid", error);
        }
    }
    if (faculty !== `None` && faculty) {
        fliter.faculty = faculty;
    }
    if(average) {
        fliter.average = average;
    }
    if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (minPrice <= maxPrice) {
            fliter.price = { $gte: minPrice, $lte: maxPrice };
        }
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
        sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }

    try {
        const result = await Course.find(fliter).sort(sort).populate('tutor').skip(skipAmount).limit(pageSize);;
        return result;
    } catch (error) {
        console.log("Error in PrfilteredAndSortedProducts of Product Services", error);
        throw error;
    }

}

const getAnProductDetail = async function (productId) {
    // const id = new mongoose.Types.ObjectId
    try {
        // Get product info
        const productInfo = await Product.findById(productId);

        // console.log(productInfo)
        //// Get related product
        // 1. Catalog
        const catalogId = new mongoose.Types.ObjectId(productInfo.catalogId);
        const catalogRelatedProductList = await Product.find({ catalogId });


        // 2. Manufacturer
        const manufacturer = productInfo.manufacturer;
        const manufacturerRelatedProductList = await Product.find({ manufacturer });
        // Combine and make the list unique
        const allRelatedProducts = [...catalogRelatedProductList, ...manufacturerRelatedProductList];
        const relatedProducts = Array.from(new Set(allRelatedProducts.map(product => product._id)))
            .map(productId => allRelatedProducts.find(product => product._id === productId));


        // Get Product Reviews
        const productReviews = await Review.find({ productId });

        return { productInfo, relatedProducts, productReviews };
    } catch (error) {
        throw error;
    }

}


// Using for reference product from cart by Id
const getProductByCart = async function (cart) {
    try {
        const result = [];
        for (let i = 0; i < cart.length; i++) {
            try {
                const product = await Product.findById(cart[i][`productId`]);
                const quantity = cart[i][`quantity`];
                result.push({ product, quantity });
            } catch (error) {
                console.log("Not found product");
            }
        }
        return result;
    } catch (error) {
        throw error;
    }
}

const saveFileAndGetUrlFromThumbnailAndGallery = async function (files) {
    try {

        let thumbnail;
        let gallery = []
        if ("thumbnail" in files) {
            const thumbnailObject = await uploadToCloudinary(files[`thumbnail`][0], 280, 280);
            thumbnail = thumbnailObject.url;

            const thumbnailGallery = await uploadToCloudinary(files[`thumbnail`][0], 450, 600);
            gallery.push(thumbnailGallery.url);
        }
        if (`gallery` in files) {
            for (let i = 0; i < files[`gallery`].length; i++) {
                const image = await uploadToCloudinary(files[`gallery`][i], 450, 600);
                gallery.push(image.url);
                // console.log(image.url);
            }
        }

        return { thumbnail, gallery };
    } catch (error) {
        console.log("Error: Save file and get url");
        throw error;
    }

}


module.exports = {
    filteredAndSorted,
    filteredSortedPaging,
    getAnProductDetail,
    getProductByCart,
    saveFileAndGetUrlFromThumbnailAndGallery,

}