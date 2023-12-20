//const { json } = require("body-parser");
//const connection = require("../config/database.js");
const mongoose = require("mongoose");

// Model
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const Course = require("../models/Course.js");
const BeTutor = require("../models/BeTutor.js");


//Service
const ProductService = require("../services/product.js")
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");

//const { use } = require("passport");
//const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailAPI.js");



require('dotenv').config();

const getHomePage = async (req, res, next) => {
    try {
        const productName = req.query.productName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;

        const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (productList) {
            res.render("HomePage_1.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}


const getDashBoard = (req, res, next) => {
    try {
        const user = req.user;
        res.render("DashBoardAdmin.ejs");
    }
    catch {
        next(error);
    }
}

const getProductDetail = async (req, res, next) => {
    try {

        const productId = req.params.productId;

        const { productInfo, relatedProducts, productReviews } = await ProductService.getAnProductDetail(productId);


        if (productInfo) {

            // Render file in here! Pleases!!!!!!!!!

            res.status(200).json({ productInfo, relatedProducts, productReviews });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getFormCreateNewProduct = (req, res, next) => {
    try {

        res.render("CreateNewProduct.ejs");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



const postANewProduct = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const product = {};
        const { thumbnail, gallery } = await ProductService.saveFileAndGetUrlFromThumbnailAndGallery(req.files);

        product.thumbnail = thumbnail;
        product.gallery = gallery;
        product.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.discount = req.body.discount;
        product.status = req.body.status;
        product.manufacturer = req.body.manufacturer;

        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json({ message: "Create product successfully", newProduct });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getProductList = async (req, res, next) => {
    try {
        const productName = req.query.productName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;

        const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (productList) {
            res.render("AdminProducts.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}
//[GET] /admin/waitingTutor?page=*
const getWaitingListTutor = async (req, res, next) => {
    const pageSize = 12;
    const tutorListFull = await BeTutor.find({status: "waiting"}).populate('tutorId');
    const totalTutor = tutorListFull.length;
    const totalPages = Math.ceil(totalTutor / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    const tutorList = await BeTutor.find({status: "waiting"}).populate('tutorId').skip(skipAmount).limit(pageSize);
    res.render('admin/waitingTutor', {
        tutorList: mutipleMongooseToObject(tutorList),
        amountTutor: tutorList.length,
        pages: pages,
        prevPage: prevPage,
        currentPage: currentPage,
        nextPage: nextPage,
    })
}
//[GET] /admin/waitingTutor/BeTutor._Id
const getDetailTutor = async (req, res, next) => {
    const tutor = await BeTutor.find({_id: req.params.id}).populate('tutorId');
    
    console.log(tutor)
    res.render('admin/detailTutor', {
        tutor: tutor,
    })
}
//[GET] /admin/accepted/BeTutor._id
const acceptTutor = async(req, res, next) => {
    try {
        const beTutor = await BeTutor.findById(req.params.id).populate('tutorId');
        if(!beTutor) {
            return res.status(404).json({error: 'Không tìm thấy thông tin'});
        }
        if(beTutor.price == 199000) {
            let formData = {
                amountCourseUpload: 5,
                amountDayUpload: 30,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            User.updateOne({_id: beTutor.tutorId}, formData);
            return res.status(200).json({ msg: 'Accepted thành công!' });
        } else if(beTutor.price == 1999000) {
            let formData = {
                amountCourseUpload: 10,
                amountDayUpload: 365,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            User.updateOne({_id: beTutor.tutorId}, formData);
            return res.status(200).json({ msg: 'Accepted thành công!' });
        } else if(beTutor.price == 3999000) {
            let formData = {
                amountCourseUpload: 999999,
                amountDayUpload: 999999,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            User.updateOne({_id: beTutor.tutorId}, formData);
            return res.status(200).json({ msg: 'Accepted thành công!' });
        }
    } catch {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }   
}
//[GET] /admin/denied/BeTutor._id
const denyTutor = async(req, res, next) => {
    try {
        const beTutor = await BeTutor.findById(req.params.id).populate('tutorId');
        if(!beTutor) {
            return res.status(404).json({error: 'Không tìm thấy thông tin'});
        }
        beTutor.status = "denied";
        await beTutor.save();
        return res.status(200).json({ msg: 'Denied thành công!' });
    } catch {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }   
}
module.exports = {
    getHomePage,
    getDashBoard,
    getProductDetail,
    getFormCreateNewProduct,
    postANewProduct,
    getProductList,
    getWaitingListTutor,
    getDetailTutor,
    acceptTutor,
    denyTutor,
}