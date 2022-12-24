let wrapper = document.querySelector('.wrapper');

let pageSlider = new Swiper('.page', {
	wrapperClass: "page__wrapper",
	slideClass: "page__screen",

	direction: 'vertical',
	slidesPerView: 'auto',

	keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},

	mousewheel: {
		sensitivity: 1,
	},

	watchOverflow: true,
	speed: 800,
	observer: true,
	observeParents: true,
	observeSlideChildren: true,

	pagination: {
		el: '.page__pagination',
		type: 'bullets',
		clickable: true,
		bulletClass: 'page__bullet',
		bulletActiveClass: 'page__bullet_active',

	},
	navigation: {
		nextEl: ".page__scroll",
	},
	init: false,
	on: {
		init: function () {
			setScrollType();
			wrapper.classList.add('_loaded');
		},
		resize: function () {
			setScrollType();
		}
	},
});




function setScrollType() {
	if (wrapper.classList.contains('_free')) {
		wrapper.classList.remove('_free');
		pageSlider.params.freeMode = false;
	}
	for (let index = 0; index < pageSlider.slides.length; index++) {
		const pageSlide = pageSlider.slides[index];
		const pageSlideContent = pageSlide.querySelector('.screen__content');
		if (pageSlideContent) {
			const pageSlideContentHeight = pageSlideContent.offsetHeight;
			if (pageSlideContentHeight > window.innerHeight) {
				wrapper.classList.add('_free');
				pageSlider.params.freeMode = true;
				break;
			}
		}
	}
}

pageSlider.init();


$(document).ready(function () {
	$('.screen-sixth__title').click(function (event) {
		if ($('.screen-sixth__column').hasClass('one')) {
			$('.screen-sixth__title').not($(this)).removeClass('active');
			$('.screen-sixth__text').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$(".header__link-ingridients").click(function () {
		setTimeout(function () {
			pageSlider.slideTo(6, 1000);
		}, 175);
	});

	$(".header__link-method").click(function () {
		setTimeout(function () {
			pageSlider.slideTo(4, 1000);
		}, 175);
	});
});