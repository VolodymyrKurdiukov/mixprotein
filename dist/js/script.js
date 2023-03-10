"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	this.nodes = document.querySelectorAll("[data-da]");
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
};

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
};

DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

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
		pageSlider.params.freeMode.enabled = false;
	}
	for (let index = 0; index < pageSlider.slides.length; index++) {
		const pageSlide = pageSlider.slides[index];
		const pageSlideContent = pageSlide.querySelector('.screen__content');
		if (pageSlideContent) {
			const pageSlideContentHeight = pageSlideContent.offsetHeight;
			if (pageSlideContentHeight > window.innerHeight) {
				wrapper.classList.add('_free');
				pageSlider.params.freeMode.enabled = true;
				break;
			}
		}
	}
}

pageSlider.init();


const counters = document.querySelectorAll('.composition__number');
const speed = 200;

counters.forEach(counter => {
	const animate = () => {
		const value = +counter.getAttribute('akhi');
		const data = +counter.innerText;

		const time = value / speed;
		if (data < value) {
			counter.innerText = Math.ceil(data + time);
			setTimeout(animate, 90);
		} else {
			counter.innerText = value;
		}

	};

	animate();
});

const countersOne = document.querySelectorAll('#number');

counters.forEach(counter => {
	const animate = () => {
		const value = +counter.getAttribute('akhis');
		const data = +counter.innerText;

		const time = value / speed;
		if (data < value) {
			counter.innerText = Math.ceil(data + time);
			setTimeout(animate, 10);
		} else {
			counter.innerText = value;
		}

	};

	animate();
});



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

	$(".header__logo").click(function () {
		setTimeout(function () {
			pageSlider.slideTo(0, 1000);
		}, 175);
	});


});



