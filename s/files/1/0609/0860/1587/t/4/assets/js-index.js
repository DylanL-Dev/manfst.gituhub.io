// pieces and components

// HELPER METHODS:

const slideUpChildren = (children, sec) => {
	for (let i = 0; i < children.length; i++) {
		children[i].classList.add('slide-up');
		children[i].style['animation-delay'] = `${i * 0.035 + sec}s`;
	}
};

// end of HELPER METHODS

// global elements and pages

const initPageTransition = () => {
	document.querySelectorAll('a[href]').forEach(item => {
		// if href points to anchor, or points to anchor that exists on page
		if (
			item.href.startsWith('#') ||
			(item.href.split('#')[1] &&
				item.href.split('#')[0] == window.location.href.split('#')[0])
		) {
			item.setAttribute('data-page-transition', 'scroll');
		} else if (
			(item.href.includes(siteUrl) || item.href.startsWith('/')) &&
			item.target != '_blank' &&
			!item.href.includes('mailto:')
		) {
			item.setAttribute('data-page-transition', 'internal');
		} else {
			item.rel = 'noopener';
			item.target = item.target || '_blank';
		}
	});

	document.querySelectorAll('[data-page-transition]').forEach(item => {
		item.addEventListener('click', e => {
			let target = e.target.hasAttribute('data-page-transition')
				? e.target
				: e.target.closest('[data-page-transition]');

			target.blur();

			if (
				target.dataset.pageTransition == 'internal' &&
				!root.classList.contains('key-is-down')
			) {
				e.preventDefault();
				root.classList.remove(
					'header-is-sticky',
					'menu-is-active',
					'mobile-menu-is-active',
					'minicart-is-active',
					'email-popup-enabled'
				);
				root.classList.add('is_leaving');

				setTimeout(() => {
					location.href = target.href;
				}, 400);
			} else if (target.dataset.pageTransition == 'scroll') {
				e.preventDefault();
				seamless.elementScrollIntoView(
					document.querySelector(`#${target.href.split('#')[1]}`),
					{
						behavior: 'smooth',
					}
				);
			}
		});
	});

	window.addEventListener('keydown', () => {
		root.classList.add('key-is-down');
	});

	window.addEventListener('keyup', () => {
		root.classList.remove('key-is-down');
	});
};

const initPageAnimation = () => {
	document.querySelectorAll('[data-animate]').forEach(item => {
		let observer = new IntersectionObserver(
			el => {
				if (
					el[0].isIntersecting === true &&
					!el[0].target.classList.contains('is-animated')
				) {
					el[0].target.classList.add('is-animated');
				}
			},
			{
				root: null,
				threshold: [0.4], // 0 = page start; 1 = page bottom, items only revealed when in full view
			}
		);

		observer.observe(item);
	});
};

const initContentLayout = () => {
	// iframe fit vids
	reframe(
		'.content-layout iframe[src*="vimeo.com"], .content-layout iframe[src*="youtube.com"]',
		'video-reframe'
	);

	// unwrap image from paragraph tag
	let contentLayout = document.querySelector('.content-layout');
	if (contentLayout) {
		[].forEach.call(contentLayout.getElementsByTagName('img'), function(img) {
			let p = img.closest('p');

			if (p && p.parentElement) {
				p.parentElement.insertBefore(img, p);
				p.parentElement.removeChild(p);
			}
		});
	}
};

const initBlogIndex = () => {
	if (document.querySelector('blog-pagination-next')) {
		let infiniteScroll = new InfiniteScroll('.blog-load-more', {
			path: '.blog-pagination-next',
			append: '.blog-post',
			button: '.blog-load-more-trigger',
			scrollThreshold: false,
			history: false,
		});

		infiniteScroll.on('last', (body, path) => {
			let loadMoreTrigger = document.querySelector('.blog-load-more-trigger');

			loadMoreTrigger.style.display = 'block';
			loadMoreTrigger.disabled = true;
			loadMoreTrigger.innerHTML = 'You’ve reached the end';
		});
	}

	const currentUrl = window.location.pathname;
	const tagWrapper = document.querySelector('.filter-wrapper.flex-h');
	tagWrapper
		.querySelectorAll('.t-body')
		.forEach(tag => tag.classList.remove('active'));
	tagWrapper
		.querySelector(`.t-body[href*="${currentUrl}"]`)
		.classList.add('active');

	const rows = document.querySelectorAll('tr');
	const image = document.querySelector(
		'.project-index .parallax-image .object-fit'
	);

	rows.forEach((row, idx) => {
		if (idx === 0) {
			return;
		}

		row.addEventListener('mouseover', function(e) {
			const nextImg = projectIndex[idx - 1].img.substring(1).slice(0, -1);
			if (
				!nextImg.includes('no-image-') &&
				image.innerHTML.replace(/\s/g, '') !== nextImg.replace(/\s/g, '')
			) {
				const currentImg = image.querySelector('img');
				image.insertAdjacentHTML('afterbegin', nextImg);
				currentImg.classList.add('fade-out');

				setTimeout(function() {
					currentImg.remove();
				}, 1200);
			}
		});
	});

	sortProjects(projectIndex)
};

const initAccount = () => {
	// account gate
	const gateWrapper = document.querySelector('.account-gate-wrapper');
	const gateContent = document.querySelector('.account-gate');
	const resetPasswordTrigger = document.querySelector(
		'.reset-password-trigger'
	);
	const resetPasswordCancel = document.querySelector('.reset-password-cancel');

	if (gateWrapper) {
		resetPasswordTrigger.addEventListener('click', event => {
			event.preventDefault();

			// update URL with hash
			history.pushState(null, null, '#recover');

			// assign active state
			root.classList.add('reset-password-active');

			// update wrapper height to fit account reset form
			gateWrapper.style.height = document.querySelector(
				'.account-reset'
			).offsetHeight;

			// focus on email field
			document.querySelector('#account-recover-email').focus();
		});

		if (resetPasswordCancel) {
			resetPasswordCancel.addEventListener('click', event => {
				event.preventDefault();

				// remove has from URL
				history.pushState(null, null, ' ');

				// remove active state from root
				root.classList.remove('reset-password-active');

				// update wrapper height to fit account reset form
				gateWrapper.style.height = gateContent.offsetHeight;
			});
		}

		// trigger password recovery form if url contains the hash
		if (location.hash == '#recover') {
			resetPasswordTrigger.click();
		}

		// set initial height
		gateWrapper.style.height = gateContent.offsetHeight;
	}
};

const initHeadingSlideUp = () => {
	let headings;

	window.addEventListener('DOMContentLoaded', event => {
		headings = document.querySelectorAll('.slide-up-collection-wrapper');
		heroHeading = document.querySelector(
			".hero-section .slide-up-collection-wrapper .slide-up-collection[data-order='1']"
		);

		if (heroHeading && heroHeading.style.opacity != 1) {
			heroHeading.style.opacity = 1;
			slideUpChildren(heroHeading.children, 0);

			setTimeout(e => {
				const collection = document.querySelector(
					".hero-section .slide-up-collection-wrapper .slide-up-collection[data-order='2']"
				);
				slideUpChildren(collection.children, 0.5);
				collection.style.opacity = 1;
			}, 500);
		}
	});

	window.addEventListener('wheel', function(e) {
		headings.forEach(heading => {
			const headingSection = heading.closest('section');

			if (!headingSection.classList.contains('hero-section')) {
				let scrollX = main.scrollLeft;
				let firstChild = heading.querySelector("[data-order='1']");
				let firstCheck = scrollX > heading.offsetLeft - this.window.innerWidth;
				if (firstCheck && firstChild.style.opacity != 1) {
					firstChild.style.opacity = 1;
					slideUpChildren(firstChild.children, 0);

					let secondChild = heading.querySelector("[data-order='2']");
					if (secondChild) {
						this.setTimeout(e => {
							secondChild.style.opacity = 1;
							slideUpChildren(secondChild.children, 0.5);
						}, 500);
					}
					let thirdChild = heading.querySelector("[data-order='3']");
					if (thirdChild) {
						this.setTimeout(e => {
							thirdChild.style.opacity = 1;
							slideUpChildren(thirdChild.children, 1);
						}, 1000);
					}
				}
			}
		});
	});
};

const initParallaxImg = () => {
	let fullBleedImgs, partialImgs;

	window.addEventListener('DOMContentLoaded', event => {
		fullBleedImgs = document.querySelectorAll('.img-parallax.full-bleed');
		partialImgs = document.querySelectorAll('.object-fit .img-parallax');
	});

	window.addEventListener('wheel', function(e) {
		let scrollX = main.scrollLeft;
		let winW = window.innerWidth;

		if (window.innerWidth > window.innerHeight) {
			if (fullBleedImgs) {
				fullBleedImgs.forEach(img => {
					const imgParent = img.parentElement;
					let imgX = imgParent.offsetLeft;
					let parentW = imgParent.offsetWidth;

					// If block is shown on screen
					if (scrollX + winW > imgX && scrollX < imgX + parentW) {
						img.style.transform = `translateX(${parseInt(scrollX * 0.2)}px)`;
					}
				});
			}

			if (partialImgs) {
				partialImgs.forEach(img => {
					// on project page, when img change based on the project hovered, the img object will be lost
					if (img.parentElement) {
						// get the parent of .object-fit
						const imgParent = img.parentElement.parentElement;
						let imgX = imgParent.offsetLeft;
						let parentW = imgParent.offsetWidth;

						if (scrollX + winW > imgX && scrollX < imgX + parentW) {
							if (
								!imgParent.classList.contains('article-parallax-image') &&
								!imgParent.classList.contains('split-right')
							) {
								img.style.left = `${(scrollX + winW - imgX) * 0.1 + 200}px`;
							} else {
								img.style.left = `${parentW * 0.5 - scrollX * 0.1}px`;
							}
						}
					}
				});
			}
		}
	});
};

const initParallaxGraph = () => {
	const graphs = document.querySelectorAll('.hero-graphic');
	const initialX = graphs.map(graph => graph.offsetLeft);

	if (window.innerWidth > window.innerHeight && graphs) {
		window.addEventListener('wheel', function(e) {
			let scrollX = main.scrollLeft;
			let winW = window.innerWidth;

			graphs.forEach((graph, idx) => {
				let graphX = initialX[idx];

				// If block is shown on screen
				if (scrollX < winW) {
					graph.style.left = `${graphX - scrollX * 0.2}px`;
				}
			});
		});
	}
};

const initFrontpageProject = () => {
	const rows = document.querySelectorAll('tr');
	const image = document.querySelector(
		'.frontpage-project .parallax-image .object-fit'
	);

	const reinitializeParallaxImg = () => {
		const partialImgs = document.querySelectorAll('.object-fit .img-parallax');
		let winW = window.innerWidth;
		window.addEventListener('wheel', e => {
			if (partialImgs) {
				partialImgs.forEach(img => {
					// on project page, when img change based on the project hovered, the img object will be lost
					if (img.parentElement) {
						// get the parent of .object-fit
						const imgParent = img.parentElement.parentElement;
						let imgX = imgParent.offsetLeft;
						let parentW = imgParent.offsetWidth;
						let scrollX = main.scrollLeft;
						if (scrollX + winW > imgX && scrollX < imgX + parentW) {
							img.style.left = `${(scrollX + winW - imgX) * 0.1 + 200}px`;
						}
					}
				});
			}
		});
	};

	rows.forEach((row, idx) => {
		row.addEventListener('mouseover', function(e) {
			if (idx === 0) {
				rows.forEach(
					tr => tr.querySelectorAll("td").forEach(
						td => td.style.opacity = 1
					)
				)
				return
			}
			const nextImg = frontpageProjects[idx - 1].img.substring(1).slice(0, -1);

			if (image.innerHTML.replace(/\s/g, '') !== nextImg.replace(/\s/g, '')) {
				const currentImg = image.querySelector('img');
				image.insertAdjacentHTML('afterbegin', nextImg);
				currentImg.classList.add('fade-out');

				setTimeout(function() {
					currentImg.remove();
				}, 1200);
			}
		});
	});

	rows[0].addEventListener("mouseout", function(e) {
		rows.forEach(
			tr => tr.querySelectorAll("td").forEach(
				td => td.style.opacity = ""
			)
		)
	})

	sortProjects(frontpageProjects)
};

const sortProjects = (projects) => {
	const yearTab = document.querySelector('th[data-content="project-year"]') 
	const projectTab = document.querySelector('th[data-content="project-project"]') 
	const typeTab = document.querySelector('th[data-content="project-type"]') 

	const attachSort = (tab) => {
		const tabName = tab["dataset"]["content"].replace("project-", "")
		tab.addEventListener("click", () => {
			const tabArrow = tab.querySelector("span")
			if (tabArrow.className.includes("up")) {
				tabArrow.classList.remove("up")
				tabArrow.classList.add("down")
				// desceding
				if (tabName == "year") {
					projects.sort((a, b) => parseInt(b[tabName]) - parseInt(a[tabName]))
				} else {
					projects.sort((a, b) => {
						const nameA = a[tabName].toUpperCase(); // ignore upper and lowercase
						const nameB = b[tabName].toUpperCase(); // ignore upper and lowercase
						if (nameA > nameB) {
							return -1;
						}
						if (nameA < nameB) {
							return 1;
						}

						// names must be equal
						return 0;
					})
				}
			} else {
				if (tabArrow.className.includes("down")) {
					tabArrow.classList.remove("down")
					tabArrow.classList.add("up")
				} else {
					tabArrow.classList.add("up")
				}
				// asceding
				if (tabName == "year") {
					projects.sort((a, b) => parseInt(a[tabName]) - parseInt(b[tabName]))
				} else {
					projects.sort((a, b) => {
						const nameA = a[tabName].toUpperCase(); // ignore upper and lowercase
						const nameB = b[tabName].toUpperCase(); // ignore upper and lowercase
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}

						// names must be equal
						return 0;
					})
				}
			}

			// repopulate the table
			createProjectTable(projects)
		})
	}


	yearTab ? attachSort(yearTab) : null
	projectTab ? attachSort(projectTab): null
	typeTab ? attachSort(typeTab) : null
}

const createProjectTable = (projects) => {
	const projectRows = document.querySelectorAll(".project-table-wrapper tr")
	const titleArray = []
	projectRows[0].querySelectorAll("th").forEach(cell => titleArray.push(cell.textContent.toLowerCase()))
	for (let row = 1; row< projectRows.length; row++) {
		const cols = projectRows[row].querySelectorAll("td")
		for (let column = 0; column < cols.length; column++) {
			cols[column].innerText = projects[row - 1][titleArray[column]]
		}
	}
}

const initPressSection = () => {
	const logos = document.querySelectorAll('.press-logo');
	const textField = document.querySelector('.press-quotes');
	if (textField) {
		textField.innerText = frontpagePress[0].quote;
	}
	if (logos[0]) {
		logos[0].style.opacity = 1;
		logos.forEach(logo => {
			logo.addEventListener('mouseover', function(e) {
				logoIndex = parseInt(logo.getAttribute('data-index'));
				logos.forEach(e => (e.style.opacity = 0.2));
				logo.style.opacity = 1;
				textField.innerText =
					frontpagePress[parseInt(logo.getAttribute('data-index')) - 1].quote;
			});
		});
	}
};

const initMissionSection = () => {
	const title = document.querySelector('.frontpage-mission-title');

	window.addEventListener('wheel', e => {
		if (main.scrollLeft > title.parentElement.offsetLeft - window.innerWidth) {
			title.classList.add('fade-in');
		}
	});

	// iframe fit vids
	reframe(
		'iframe[src*="vimeo.com"], iframe[src*="youtube.com"]',
		'video-reframe'
	);

	let frontpageMission = document.querySelector('.frontpage-mission');
	frontpageMission
		.querySelector('.js-media-play')
		.addEventListener('click', () => {
			frontpageMission
				.querySelector('.media-embed')
				.classList.add('is-playing');

			let iframe = frontpageMission.querySelector('iframe');
			let player = new Vimeo.Player(iframe);

			player.play();
		});
};

const initFrontpage = () => {
	initHeadingSlideUp();
	initFrontpageProject();
	initPressSection();
	initMissionSection();
};

const initArticle = () => {
	const content = document.querySelector('.article-content');

	// unwrap images
	content.querySelectorAll('img').forEach(img => {
		// remove paragraph tag
		let pTag = img.closest('p');
		if (pTag && img.parentElement) {
			pTag.parentNode.insertBefore(img, pTag);
			pTag.parentElement.removeChild(pTag);
		}
	});

	// unwrap divs (can easily mess up the layout)
	let wrapperNode = content.querySelector('[style="text-align: center;"]');
	if (wrapperNode) {
		wrapperNode.replaceWith(...wrapperNode.childNodes);
	}

	// setup parallax images
	const parallaxImgSelectors = [
		'img:not([style])',
		'img[style*="float: start;"]',
		"img[style*='float: none;']",
	];
	const parallaxImgs = content.querySelectorAll(
		parallaxImgSelectors.join(', ')
	);
	parallaxImgs.forEach(img => {
		const div = document.createElement('div');
		img.classList.add('img-parallax');
		img.parentNode.insertBefore(div, img);
		div.appendChild(img);
		div.classList.add('object-fit');

		const div2 = document.createElement('div');
		div.parentNode.insertBefore(div2, div);
		div2.appendChild(div);
		div2.classList.add('article-parallax-image');
	});

	// setup contained images
	const containedImgSelectors = [
		"img[style*='float: right;']",
		"img[style*='float: left;']",
	];
	const sImgs = content.querySelectorAll(containedImgSelectors.join(', '));
	sImgs.forEach(img => {
		const div = document.createElement('div');
		img.parentNode.insertBefore(div, img);
		div.appendChild(img);
		div.classList.add('object-fit');

		const div2 = document.createElement('div');
		div.parentNode.insertBefore(div2, div);
		div2.appendChild(div);
		div2.classList.add('article-fit-image');

		const div3 = document.createElement('div');
		div2.parentNode.insertBefore(div3, div2);
		div3.appendChild(div2);
		div3.classList.add('article-img-section', 'f-v', 'f-j-c');

		if (img.alt) {
			const caption = document.createElement('div');
			caption.innerText = img.alt;
			caption.classList.add('caption');
			div3.appendChild(caption);
		}
	});

	// setup text tags
	const textTag = [
		'p',
		'ul',
		'ol',
		'blockquote',
		'code',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'span'
	];

	let allText = [...content.querySelectorAll(textTag.join(', '))].filter(
		t => t.innerText
	);
	allText.map(t => {
		if (t.innerText.trim().length == 0) {
			t.innerText = '';
		}
		return t;
	});
	allText = allText.filter(t => t.innerText);
	let i = 0;
	while (i < allText.length) {
		let text = allText[i];
		let prev = text.previousElementSibling;
		if (
			prev &&
			prev.className &&
			prev.className.includes('article-text-section')
		) {
			prev.appendChild(text);
		} else {
			let div = document.createElement('div');
			text.parentNode.insertBefore(div, text);
			div.appendChild(text);
			div.classList.add('article-text-section', 'f-v', 'f-j-e');
		}
		i++;
	}

	// readejust the img position after all the components are rendered in place
	if (window.innerWidth > window.innerHeight) {
		parallaxImgs.forEach(img => {
			let translateX =
				(img.parentElement.parentElement.offsetLeft - content.offsetLeft) /
					114 -
				24;
			img.style.transform = `translate(${translateX}%, -50%)`;
		});
	} else {
		parallaxImgs.forEach(
			img => (img.style.transform = 'translate(-50%, -50%)')
		);
	}

	const nextSection = document.querySelector('.article-next .flex-v');
	const nextImg = document.querySelector('.article-next-image');
	if (window.innerWidth > window.innerHeight) {
		const nextBtnFill = nextSection.querySelector('.btn-fill');
		nextSection.addEventListener('mouseenter', function(e) {
			window.addEventListener('mousemove', function(e) {
				const nextParentLeft =
					nextSection.parentElement.offsetLeft - main.scrollLeft;

				if (nextImg) {
					nextImg.style.left = `${e.pageX - nextParentLeft}px`;
					nextImg.style.top = `${e.pageY}px`;
				}

				if (
					e.clientX > nextParentLeft &&
					e.clientX < nextParentLeft + nextSection.offsetWidth
				) {
					nextImg?.classList.add('active');
					nextSection.parentElement.style.backgroundColor = '#5E5CA8';
					if (nextBtnFill) {
						nextBtnFill.classList.remove('cr-bronze');
						nextBtnFill.classList.add('cr-royal');
					}
				} else {
					nextImg?.classList.remove('active');
					nextSection.parentElement.style.backgroundColor = '#D2AC79';
					if (nextBtnFill) {
						nextBtnFill.classList.add('cr-bronze');
						nextBtnFill.classList.remove('cr-royal');
					}
				}
			});
		});
	}
};

const initPressPage = () => {
	initHeadingSlideUp();
	initPressSection();

	const sections = document.querySelectorAll('main .shopify-section');
	if (window.innerWidth > window.innerHeight) {
		sections.forEach(section => (section.style.marginRight = '-4px'));
	}

	const teamCards = document.querySelectorAll('.team-section .press-card');
	teamCards.forEach(card => {
		card.addEventListener('click', () => {
			if (card.classList.contains('active')) {
				card.classList.remove('active');
			} else {
				card.classList.add('active');
			}
		});
		card.addEventListener('touched', () => {
			if (card.classList.contains('active')) {
				card.classList.remove('active');
			} else {
				card.classList.add('active');
			}
		});
	});
};

const initNav = () => {
	const html = document.querySelector('html');
	const main = document.querySelector('main');
	// slide in menu
	const navBtn = document.querySelector('#nav-trigger');
	const menu = document.querySelector('#global-menu');

	const noscroll = e => e.preventDefault();
	const noscrollArgs = {
		passive: false,
	};

	navBtn.addEventListener('click', function(e) {
		if (html.classList.contains('menu-is-active')) {
			html.classList.remove('menu-is-active');
			// main.removeEventListener('touchmove', noscroll, noscrollArgs); // mobile
		} else {
			html.classList.add('menu-is-active');

			// // no scroll
			// main.addEventListener('touchmove', noscroll, noscrollArgs); // mobile

			// handle anchor click on the same page
			menu.querySelectorAll('a').forEach(a => {
				if (a.getAttribute('href').includes('#')) {
					a.addEventListener('click', e => {
						navBtn.classList.remove('active');
						html.classList.remove('menu-is-active');
					});
				}
			});
		}
	});

	// mobile announcement bar
	if (
		window.innerWidth < window.innerHeight &&
		globalAnnouncement &&
		window.location.pathname === '/'
	) {
		const mobileAnnouncementBar = document.querySelector(
			'.mobile-announcement'
		);
		let marqueeText = globalAnnouncement + ' ';
		for (const x of Array(2).keys()) {
			marqueeText += marqueeText;
		}
		mobileAnnouncementBar.querySelector(
			'.announcement-text'
		).innerText = marqueeText;
		mobileAnnouncementBar.style.opacity = 1;
	}

	// convert vertical scroll to horizontal
	if (root.classList.contains('is-horizontal-scroll')) {
		window.addEventListener('wheel', e => {
			const wrapper = e.target.closest('.project-table-wrapper');
			if (
				(!e.deltaY && window.innerWidth > window.innerHeight) ||
				(wrapper && wrapper.scrollHeight > wrapper.clientHeight)
			) {
				return;
			}
			document.querySelector('#main').scrollLeft += e.deltaY + e.deltaX;
		});
	}

	// popup contact form
	const contactBtn = document.querySelector(
		'.btn-fill.rotate-vertical.desktop-only'
	);
	const emailOverlay = document.querySelector('.email-popup-overlay');
	const emailPopup = document.querySelector(
		'.email-popup-overlay .email-popup'
	);
	contactBtn.addEventListener('click', e => {
		if (html.classList.contains('email-popup-enabled')) {
			html.classList.remove('email-popup-enabled');
		} else {
			html.classList.add('email-popup-enabled');
		}

		const closeBtn = document.querySelector('.js-email-popup-close');
		closeBtn.addEventListener('click', e => {
			html.classList.remove('email-popup-enabled');
		});
	});

	// create cursor
	const cursor = document.querySelector('.cursor');
	const actionableCursorTags = ['a', 'button', 'input', 'td', 'textarea', 'th'];
	const actionableCursorClasses = ['btn', 'btn-fill'];

	function hasActionableCursorClass(a1, a2) {
		return a1.filter(function(n) {
			return a2.indexOf(n) !== -1;
		}).length;
	}

	window.addEventListener('mousemove', e => {
		cursor.style.top = `${e.pageY}px`;
		cursor.style.left = `${e.pageX}px`;

		if (window.innerWidth < window.innerHeight) {
			cursor.style.top = `calc(${e.pageY}px - var(--s-sidebar))`;
			window.addEventListener('wheel', e => {
				cursor.style.top = `${e.pageY}px`;
			});
		}

		const targetClasses = e.target.className.split(' ');
		const targetParentClasses = e.target.parentElement.className.split(' ');

		if (
			actionableCursorTags.includes(e.target.tagName.toLowerCase()) ||
			hasActionableCursorClass(targetClasses, actionableCursorClasses) ||
			hasActionableCursorClass(targetParentClasses, actionableCursorClasses)
		) {
			if (window.location.pathname.includes("contact")) {
				cursor.style.backgroundColor = 'var(--cr-white)';
			} else {
				cursor.style.backgroundColor = 'var(--cr-cardinal)';
			}
			cursor.style.width = '14px';
			cursor.style.height = '14px';
		} else {
			cursor.style.width = '22px';
			cursor.style.height = '22px';
			cursor.style.backgroundColor = 'var(--cr-black)';
		}

		if (
			e.clientX > window.innerWidth ||
			e.clientX < 0 ||
			e.clientY > window.innerHeight ||
			e.clientY < 0
		) {
			cursor.style.opacity = 0;
		}
	});

	html.addEventListener('mouseout', e => (cursor.style.opacity = 0));
	html.addEventListener('mouseover', e => (cursor.style.opacity = 1));
};

const initFlickitySlider = () => {
	let flickitySlider = document.querySelectorAll('[data-flickity-slider]');

	const flickitySliderTrigger = () => {
		flickitySlider.forEach(el => {
			let flickity = new Flickity(
				el,
				JSON.parse(el.dataset.flickitySlider.replace(/'/g, '"').trim())
			);

			let childrenWidth = Object.values(
				el.querySelector('.flickity-slider').childNodes
			).reduce((total, i) => {
				i.offsetWidth ? total + i.offsetWidth : total, 0;
			});

			if (
				// if total children width is lesser than slider width
				el.getBoundingClientRect().width >= childrenWidth ||
				// if flickity slider has breakpoint set, and window is greater than breakpoint
				(el.dataset.flickityBreakpoint &&
					window.innerWidth > parseInt(el.dataset.flickityBreakpoint))
			) {
				// destroy flickity
				flickity.destroy();

				setTimeout(() => {
					el.querySelectorAll('[style*="left:"]').forEach(item => {
						item.style.setProperty('left', 'unset');
					});
				}, 100);
			} else {
				// avoid click on drag: https://github.com/metafizzy/flickity/issues/838
				flickity.on('dragStart', () =>
					flickity.slider.childNodes.forEach(
						slide => (slide.style.pointerEvents = 'none')
					)
				);

				flickity.on('dragEnd', () =>
					flickity.slider.childNodes.forEach(
						slide => (slide.style.pointerEvents = 'all')
					)
				);
			}
		});

		const previousButton = document.querySelector(
			'.testimonial-slider .flickity-button.previous'
		);
		if (previousButton) {
			previousButton.addEventListener('click', function(e) {
				const parent = e.target.closest('.comp-testimonial');
				parent
					.querySelector('.testimonial-image-slider .flickity-button.previous')
					.click();
			});
		}

		const nextButton = document.querySelector(
			'.testimonial-slider .flickity-button.next'
		);
		if (nextButton) {
			nextButton.addEventListener('click', function(e) {
				const parent = e.target.closest('.comp-testimonial');
				parent
					.querySelector('.testimonial-image-slider .flickity-button.next')
					.click();
			});
		}
	};

	flickitySliderTrigger();
	window.addEventListener('resize', flickitySliderTrigger);

	// swipe fix for IOS
	var touchingCarousel = false;
	var touchStartCoords;

	document.body.addEventListener('touchstart', function(e) {
		if (e.target.closest('.flickity-slider')) {
			touchingCarousel = true;
		} else {
			touchingCarousel = false;
			return;
		}

		touchStartCoords = {
			x: e.touches[0].pageX,
			y: e.touches[0].pageY,
		};
	});

	document.body.addEventListener(
		'touchmove',
		function(e) {
			if (!(touchingCarousel && e.cancelable)) {
				return;
			}

			var moveVector = {
				x: e.touches[0].pageX - touchStartCoords.x,
				y: e.touches[0].pageY - touchStartCoords.y,
			};

			if (Math.abs(moveVector.x) > 7) {
				e.preventDefault();
			}
		},
		{
			passive: false,
		}
	);
};

// execute pieces and components functions
// initItemQuantity();

initParallaxImg();
// initParallaxGraph();
initNav();
initFlickitySlider();

// execute global and component functions
initPageTransition();
initPageAnimation();
initContentLayout();

// execute page specific functions
switch (root.id) {
	case 'template-frontpage':
		initFrontpage();
		break;

	case 'template-blog-index':
		initBlogIndex();
		break;

	case 'template-blog-single':
		initArticle();
		break;

	case 'template-page-press':
	case 'template-page-about':
		initPressPage();
		break;

	case 'template-account':
		initAccount();
		break;
}

// make visible .avoid-style-flash elements
setTimeout(() => {
	document.querySelectorAll('.avoid-style-flash').forEach(el => {
		el.style.visibility = 'visible';
	});
}, 400);
