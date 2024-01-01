let menu = document.querySelector('#menu-btn');
let navbarLinks = document.querySelector('.header .navbar .links');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbarLinks.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbarLinks.classList.remove('active');

    if (window.scrollY > 60) {
        document.querySelector('.header .navbar').classList.add('active');
    } else {
        document.querySelector('.header .navbar').classList.remove('active');
    }
}


const triggerOpen = document.querySelectorAll('[trigger-button]');
const triggerClose = document.querySelectorAll('[close-button]');
const overlay = document.querySelectorAll('[data-overlay]');
let targetEl;

const openData = function () {
    if (targetEl) {
        targetEl.classList.remove('active');
        overlay.forEach(item => item.classList.remove('active'));
    }
};


for (let i = 0; i < triggerOpen.length; i++) {
    let currentId = triggerOpen[i].dataset.target,
        targetEl = document.querySelector(`#${currentId}`)

    const openData = function () {
        targetEl.classList.remove('active');
        overlay.classList.remove('active');
    }


    triggerOpen[i].addEventListener('click', function () {
        if (targetEl) {
            targetEl.classList.add('active');
            overlay.forEach(item => item.classList.add('active'));
        }

        // targetEl.classList.add('active');
        // overlay.classList.add('active');
    });

    targetEl.querySelector('[close-button]').addEventListener('click', openData);
    overlay.forEach(function (overlayItem) {
        overlayItem.addEventListener('click', openData);
    });
    // overlay.addEventListener('click', openData)
}





//Mobile interface
const submenu = document.querySelectorAll('.child-trigger');
submenu.forEach((menu) => menu.addEventListener('click', function (e) {
    e.preventDefault();

    // Find the closest parent with the class 'has-child'
    const closestHasChild = this.closest('.has-child');

    // Toggle the 'active' class on the closest parent with the class 'has-child'
    if (closestHasChild) {
        closestHasChild.classList.toggle('active');
    }

    // Remove 'active' class from other '.has-child' elements
    document.querySelectorAll('.has-child').forEach((item) => {
        if (item !== closestHasChild && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
}));
//Slider

const swiper = new Swiper('.sliderbox', {
    loop: true,
    effect: 'fade',
    autoHeight: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});


//Carousel

const carousel = new Swiper('.carouselbox', {
    spaceBetween: 30,
    slidesPerView: 'auto',
    centerdSlides: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        481: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            centerdSlides: false,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            centerdSlides: false,
        },
        992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            centerdSlides: false,
        }
    }
});


//page-single

const thumbImage = new Swiper('.thumbnail-image', {
    //loop: true,
    direction: 'vertical',
    spaceBetween: 15,
    slidesPerView: 1,
    freeMode: true,
    watchSlidesProgress: true,
});
const mainImage = new Swiper('.main-image', {
    loop: true,
    autoHeight: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    thumbs: {
        swiper: thumbImage,
    },
});

//tabbed 
const trigger = document.querySelectorAll('.tabbed-trigger');
const content = document.querySelectorAll('.tabbed > div');

trigger.forEach((btn) => {
    btn.addEventListener('click', function () {
        let dataTarget = this.dataset.id,
            body = document.querySelector(`#${dataTarget}`);
        trigger.forEach((b) => b.parentNode.classList.remove('active'));
        content.forEach((s) => s.classList.remove('active'));
        this.parentNode.classList.add('active');
        body.classList.add('active');
    });
});

//sorter
const sorter = document.querySelector('.sort-list');

if (sorter) {
    const sortLi = sorter.querySelectorAll('li');
    sorter.querySelector('.opt-trigger').addEventListener('click', function () {
        sorter.querySelector('ul').classList.toggle('show');
    });

    sortLi.forEach(item => item.addEventListener('click', function () {
        sortLi.forEach(li => {
            if (li !== this) {
                li.classList.remove('active');
            }
        });
        this.classList.add('active');
        sorter.querySelector('.opt-trigger span.value').textContent = this.textContent;
        sorter.querySelector('ul').classList.toggle('show');
    }));
}


document.addEventListener('DOMContentLoaded', function () {
    var clearButtons = document.querySelectorAll('.clear-button');

    clearButtons.forEach(function (clearButton) {
        clearButton.addEventListener('click', function () {
            var checkboxes = clearButton.closest('.widget').querySelectorAll('.accord.product-size input[type="checkbox"]');
            checkboxes.forEach(function (checkbox) {
                checkbox.checked = false;
            });
        });
    });
});

// var page = 1;
// const curUrl = new URL(window.location.href);
// curUrl.pathname = '/products/paging';

// const prevPage = document.getElementById("prev_page");
// const nextPage = document.getElementById("next_page");

// prevPage.addEventListener("click", async function () {
//     try {
//         if (curUrl.searchParams.has('page')) {
//             if (curUrl.searchParams.get('page') > 1) curUrl.searchParams.set('page', page - 1);
//         } else {
//             curUrl.searchParams.append('page', page);
//         }
//         console.log(curUrl.toString());
//     } catch (error) {
//         console.log(error);

//     }

//     try {
//         const response = await fetch(curUrl.toString());

//         const htmlContent = await response.text();

//         console.log(htmlContent);

//         if (!response.ok) {
//             throw new Error(`Network response was not ok: ${response.status}`);
//         }

//     } catch (error) {
//         // Handle errors during the fetch
//         console.error('Fetch error:', error.message);
//         debugger;
//     }
// });


function clearForm() {
    var form = document.getElementById("filter_form");
    form.reset();
}