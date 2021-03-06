/**
 * Main JS file for Casper behaviours
 */

 /*globals jQuery, document */
 (function ($) {
	"use strict";


	$(document).ready(function(){

	let language = localStorage.getItem('language')
	if(language == null || language == 'null') {
		language = 'french'
	}

    // open subscribe link to a new tab:
    $("li.nav-adhsion a").attr('target', '_blank')

		let updateDate = function(lang) {
			
			moment.locale(lang == 'french' ? 'fr' : 'en');
			$('.post-date').each(function(i, date) {
				var $date = $(date);
				$date.html(
					moment($date.attr('datetime'))
					.format(lang == 'french' ? 'MMMM YYYY' : 'MMMM YYYY')
					);
			});
		}
		updateDate(language);

		let translate = function(to) {
			if(to == null || to == 'null') {
				to = 'french'
			}
			let from = to == 'english' ? 'french' : 'english';

			localStorage.setItem('language', to);
			updateDate(to);

			let lang = to == 'english' ? 'en' : 'fr'
      // todo: uncomment next line to put back multi-lang:
			// window.location.hash = "lang=" + lang;
			document.documentElement.className = "lang-" + lang + " js";

			// Hide other language
			if(to == 'english') {
				$("#franais").nextUntil("#english").hide()
				$("#english").nextUntil("#franais").show()
			} else if(to == 'french') {
				$("#english").nextUntil("#franais").hide()
				$("#franais").nextUntil("#english").show()
			}
			// Hide language titles
			$("#franais, #english").hide()


			$("["+from+"]").each(function() {
				$(this).html($(this).html().replace($(this).attr(from), $(this).attr(to)))
			})


			let translateTitle = function() {

				$(this).addClass('translated')
				this.addEventListener("transitionend", function(event) { $(this).addClass('noTransition') }, true);

				if($(this).attr("english-french") == null) {
					$(this).attr("english-french", $(this).text())
				}

				let languages = $(this).attr("english-french").split('|')

				if(languages.length>1) {
					$(this).text(to=="french" ? languages[0] : languages[1])
				}
			}

			$(".preview .post-title a").each(translateTitle)
			$("h1.post-title").each(translateTitle)

			// Opacity transition of entire articles to avoid blink
			$("article.post").addClass('translated')
		}

		translate(language)

		let linkJ = $('<a>').text(language == 'french' ? 'English' : 'Français').attr('href', '')
		let menuItemJ = $('<li>').addClass(language == 'french' ? 'nav-english' : 'nav-french').append(linkJ)

		linkJ.click(function(event){

			parent = $(event.target).parent();

			if(parent.hasClass("nav-english")) {
				parent.removeClass("nav-english").addClass("nav-french").find("a").text("Français");
				translate('english');
			} else if(parent.hasClass("nav-french")) {
				parent.removeClass("nav-french").addClass("nav-english").find("a").text("English");
				translate('french');
			}

			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			return true;
		})

		// Reactivate language (english / french) button: uncomment the next two lines

		// $("#site-head .nav").append(menuItemJ)
		// setTimeout(function(){ menuItemJ.addClass('translated') }, 0)

		// put content in an inner div

		console.log("header")
		let headerJ = $(".header")
		$("article.post header").before(headerJ)
		console.log(headerJ)


		let galleryJs = $(".gallery")
		// for(let gallery of galleryJs) {

    	galleryJs.each( (index, gallery)=> {

			let galleryJ = $(gallery)

			// create gallery:

			// get item classes
			let classes = galleryJ.attr('itemclasses');
			let largeImageSize = galleryJ.attr('largeimagesize');
			let largeImageSizeDefined = false;
			if(largeImageSize != null) {
				largeImageSize = largeImageSize.split('x');
				if(largeImageSize.length == 2) {
					largeImageSizeDefined = true;
				}
			}

			let smallImageSize = galleryJ.attr('smallimagesize');
			let smallImageSizeDefined = false;
			if(smallImageSize != null) {
				smallImageSize = smallImageSize.split('x');
			}

			// put all img into a linking to the large version of the image
			// add all item classes to the a item
			// let images = galleryJ.find("img").slice(0);
			let images = galleryJ.find("img");

			let containerJ = $("<div>");
			containerJ.addClass('row')
			// for(let img of images) {
			images.each( (index, img)=> {
				let imgJ = $(img);
				let aJ = $('<a>');
				aJ.append(imgJ);
				aJ.addClass(classes);
				containerJ.append(aJ);

				aJ.attr('href', img.src.replace(/.jpg$/, '_large.jpg'));

				imgJ.load( () => {
					console.log("loaded: " + img.src)
					let imgWidth = img.naturalWidth;
					let imgHeight = img.naturalHeight;
					//initializeImage(this, this.width, this.height, imgJ, aJ);
					// console.log("initializeImage: " + img.src)
					// console.log("initializeImage: " + imgWidth + ", " + imgHeight)
					imgJ.attr('imagesize', '' + (smallImageSizeDefined ? smallImageSize[0] : imgWidth) + 'x' + (smallImageSizeDefined ? smallImageSize[1] : imgHeight));
					aJ.attr('imagesize', '' + (largeImageSizeDefined ? smallImageSize[0] : 2 * imgWidth) + 'x' + (largeImageSizeDefined ? smallImageSize[1] : 2 * imgHeight));
				});
				imgJ.load();

				// if (!img.complete) {
				// 	console.log("not yet loaded: " + img.src)

				// } else {
				// 	console.log("already loaded:" + img.src)
				// 	initializeImage(img, imgJ, aJ, true);
				// }
			})
			galleryJ.append(containerJ);
		})



		// let divJ = $("<div>")
		// divJ.addClass('col-lg-4')

		// let galleryJ = $(".gallery")
		// galleryJ.addClass('col-lg-8')

		// let contentJ = galleryJ.nextAll()
		// galleryJ.after(divJ)
		// divJ.append(contentJ)

		// Hide other language:
		// let language = QueryString.lang;

		// let otherLang = lang == "fr" ? "en" : "fr";


			// On the home page, move the blog icon inside the header
			// for better relative/absolute positioning.

			//$("#blog-logo").prependTo("#site-head-content");


		// Remove pagination if there is no need to display it (if there is only one page)

		let paginationJ = $("nav.pagination.main")
		if(paginationJ.children().length <= 1) {
			paginationJ.hide()
		}

		// Change style button:

		let changeStyleBtnJ = $(".nav-changer-de-style")
		let siteURL = $("#screen-styles").attr('data-site-url')
		window.IDLVStyleIndex = 0
		let nStyles = 2
		changeStyleBtnJ.click(function(event) {
			window.IDLVStyleIndex++
			if(window.IDLVStyleIndex >= nStyles) {
				window.IDLVStyleIndex = 0
			}
			if(window.IDLVStyleIndex == 0) {
				$("#screen-styles").attr('href', siteURL + "/assets/css/screen.css")
			} else if(window.IDLVStyleIndex == 1) {
				$("#screen-styles").attr('href', siteURL + "/assets/css/screen2.css")
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			return true;
		})
	});

}(jQuery));
