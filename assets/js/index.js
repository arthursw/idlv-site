/**
 * Main JS file for Casper behaviours
 */

 /*globals jQuery, document */
 (function ($) {
	"use strict";


	$(document).ready(function(){

		let updateDate = function() {
			let lang = localStorage.getItem('language')
			moment.locale(lang == 'french' ? 'fr' : 'en');
			$('.post-date').each(function(i, date) {
				var $date = $(date);
				$date.html(
					moment($date.attr('datetime'))
					.format(lang == 'french' ? 'dddd, DD MMMM YYYY' : 'dddd, MMMM DD, YYYY')
					);
			});
		}
		updateDate();

		let translate = function(to) {
			
			let from = to == 'english' ? 'french' : 'english';

			localStorage.setItem('language', to);
			updateDate();

			let lang = to == 'english' ? 'en' : 'fr'
			window.location.hash = "lang=" + lang;
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

		let language = localStorage.getItem('language')
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

		$("#site-head .nav").append(menuItemJ)

		setTimeout(function(){ menuItemJ.addClass('translated') }, 0)
		
		// put content in an inner div

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


	});

}(jQuery));