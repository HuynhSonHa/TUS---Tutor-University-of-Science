
// [GET] /news
const index = (req, res) => {
    res.render('news');
}
// [GET] /news/:slug
//slug là 1 biến động nhận nhiều giá trị
const show = (req, res) => {
    res.send('NEWS DETAIL!!!');
}

module.exports = {
    index,
    show,
};
