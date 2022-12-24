let pageSlider = new Swiper('.page', {
	wrapperClass: "page__wrapper",
	slideClass: "page__screen",

	direction: 'vertical',
	slidesPerView: 'auto',

	mousewheel: {
		sensitivity: 1,
	},

	watchOverflow: true,
	speed: 800,
	observer: true,
	observeParents: true,
	observeSlideChildren: true,

	pagination:{
		el:'.page__pagination',
		type:'bullets',
		clickable:true,
		bulletClass:'page__bullet',
		bulletActiveClass:'page__bullet_active',

	}
});

$(document).ready(function () {
	$('.screen-sixth__title').click(function (event) {
		if ($('.screen-sixth__column').hasClass('one')) {
			$('.screen-sixth__title').not($(this)).removeClass('active');
			$('.screen-sixth__text').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});
});