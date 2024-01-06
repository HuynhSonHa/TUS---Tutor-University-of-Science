//const { json } = require("body-parser");
//const connection = require("../config/database.js");
const mongoose = require("mongoose");

// Model
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const Course = require("../models/Course.js");
const BeTutor = require("../models/BeTutor.js");


//Service
const courseService = require("../services/product.js")
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");

//const { use } = require("passport");
//const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailAPI.js");



require('dotenv').config();

const getHomePage = async (req, res, next) => {
    try {
        const courseName = req.query.courseName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;

        const courseList = await courseService.PrfilteredAndSortedcourses(courseName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (courseList) {
            res.render("HomePage_1.ejs", { courseList: courseList });
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

const getcourseDetail = async (req, res, next) => {
    try {

        const courseId = req.params.courseId;

        const { courseInfo, relatedcourses, courseReviews } = await courseService.getAncourseDetail(courseId);


        if (courseInfo) {

            // Render file in here! Pleases!!!!!!!!!

            res.status(200).json({ courseInfo, relatedcourses, courseReviews });
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

const getFormCreateNewcourse = (req, res, next) => {
    try {

        res.render("CreateNewcourse.ejs");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



const postANewcourse = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const course = {};
        const { thumbnail, gallery } = await courseService.saveFileAndGetUrlFromThumbnailAndGallery(req.files);

        course.thumbnail = thumbnail;
        course.gallery = gallery;
        course.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        course.name = req.body.name;
        course.price = req.body.price;
        course.description = req.body.description;
        course.discount = req.body.discount;
        course.status = req.body.status;
        course.manufacturer = req.body.manufacturer;

        const newcourse = new course(course);
        await newcourse.save();
        res.status(201).json({ message: "Create course successfully", newcourse });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getcourseList = async (req, res, next) => {
    try {
        const courseName = req.query.courseName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;

        const courseList = await courseService.PrfilteredAndSortedcourses(courseName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (courseList) {
            res.render("Admincourses.ejs", { courseList: courseList });
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
    //tính toán phân trang
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
    console.log(tutorList);

    res.render('admin/waitingTutor', {
        tutorList: mutipleMongooseToObject(tutorList),
        amountTutor: tutorList.length,
        pages: pages,
        prevPage: prevPage,
        currentPage: currentPage,
        nextPage: nextPage,
        layout: 'admin',
    })
}
//[GET] /admin/waitingTutor/BeTutor._Id
const getDetailTutor = async (req, res, next) => {
    const tutor = await BeTutor.findById(req.params.id).populate('tutorId');
    
    console.log(tutor)
    res.render('admin/detailTutor', {
        tutor: mongooseToObject(tutor),
        layout: 'admin',
    })
}
//[GET] /admin/accepted/BeTutor._id
const acceptTutor = async(req, res, next) => {
    try {
        const beTutor = await BeTutor.findById(req.params.id).populate('tutorId');
        if(!beTutor) {
            return res.status(404).json({error: 'Không tìm thấy thông tin'});
        }
        //Xử lí khi accept user đăng ký gói rẻ nhất 
        if(beTutor.price == 199000) {
            let formData = {
                amountCourseUpload: 5,
                amountDayUpload: 30,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            await User.updateOne({_id: beTutor.tutorId}, formData);
            return res.status(200).json({ msg: 'Accepted thành công!' });
        }//Xử lí khi accept user đăng ký gói trung bình  
        else if(beTutor.price == 1999000) {
            let formData = {
                amountCourseUpload: 10,
                amountDayUpload: 365,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            await User.updateOne({_id: beTutor.tutorId}, formData);
            return res.status(200).json({ msg: 'Accepted thành công!' });
        }//Xử lí khi accept user đăng ký gói mắc nhất  
        else if(beTutor.price == 3999000) {
            let formData = {
                amountCourseUpload: 999999,
                amountDayUpload: 999999,
                role: "tutor",
            };
            beTutor.status = "accepted";
            await beTutor.save();
            await User.updateOne({_id: beTutor.tutorId}, formData);
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
        //beTutor.deleteOne({_id: req.params.id});
        beTutor.status = "denied";
        await beTutor.save();
        return res.status(200).json({ msg: 'Denied thành công!' });
    } catch {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }   
}

const getAccountPage = async (req, res, next) => {
    // 1 list user, amount of user
    const userList = await User.find();
    res.render('admin/account/admin-account', {
        userList: userList,
        amountOfUser: userList.length,
    });
}
const getEditUserPage = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.render("", {
        user: user,
    })
}
const putEditUserPage = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    User.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa khóa học thành công!"}))
    .catch(next);
}
const destroyUser = async (req, res, next) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    User.deleteOne({ _id: id })
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Xóa user thành công!"}))
    .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const getCoursePage = async(req, res, next) => {
    const courseList = await Course.find();
    res.render("", {
        courseList: courseList,
        amountOfCourse: courseList.length,
    })
}
const getEditCoursePage = async(req, res, next) => {
    //Edit sản phẩm 
    const course = await Course.findById(req.params.id)
    res.render('admin/edit/edit', {
      course: course,
    })
}
const putEditCoursePage = async(req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    Course.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa môn học thành công!"}))
    .catch(next);
}
const destroyCourse = async (req, res, next) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    await Review.deleteMany({courseId: id});
    await Order.deleteMany({courseId: id});
    Course.deleteOne({ _id: id })
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Xóa môn học thành công!"}))
    .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

module.exports = {
    getHomePage,
    getDashBoard,
    getcourseDetail,
    getFormCreateNewcourse,
    postANewcourse,
    getcourseList,
    getWaitingListTutor,
    getDetailTutor,
    acceptTutor,
    denyTutor,
    getEditUserPage,
    putEditUserPage,
    destroyUser,
    getAccountPage,
    getEditCoursePage,
    putEditCoursePage,
    destroyCourse, 
    getCoursePage,
}