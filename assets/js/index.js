/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";


    $(document).ready(function(){

        let updateDate = function() {

        	moment.locale(localStorage.getItem('language') == 'french' ? 'fr' : 'en');
			$('.post-date').each(function(i, date) {
				var $date = $(date);
				$date.html(
					moment($date.attr('datetime'))
						.format('dddd, MMMM DD, YYYY')
				);
			});
        }
        updateDate();

    	$(".nav-english").find("a")[0].href = "";
  //   	$(document).on('click','.nav-english a', function(e) {
  //   		parent = $(e.target).parent()
			
		// 	let lang = "en";
  //   		if(parent.hasClass("nav-english")) {
  //   			lang = "en";
		// 		parent.removeClass("nav-english").addClass("nav-francais").find("a").text("Français");
  //   		} else if(parent.hasClass("nav-francais")) {
  //   			lang = "fr";
  //   			parent.removeClass("nav-francais").addClass("nav-english").find("a").text("English");
  //   		}

  //   		window.location.search = "lang=" + lang;
  //       	document.documentElement.className = "lang-" + lang + " js";
        	

		// 	e.preventDefault();

		// 	if(e.isDefaultPrevented()){
		// 	    // default event is prevented
		// 	}else{
		// 	    e.returnValue = false;
		// 	}
		// 	return false;
		// });

		let translate = function(to) {
			
			let from = to == 'english' ? 'french' : 'english';

			localStorage.setItem('language', to);
        	updateDate();

			$("["+from+"]").each(function() {
				$(this).html($(this).html().replace($(this).attr(from), $(this).attr(to)))
			})


			let translateTitle = function() {
				$(this).css({color: '#151515'})
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
		}
		
		let language = localStorage.getItem('language')
		translate(localStorage.getItem('language'))

    	$(".nav-english").find("a").click(function(event){

    		parent = $(event.target).parent();
			
			let lang = "en";
    		if(parent.hasClass("nav-english")) {
    			lang = "en";
				parent.removeClass("nav-english").addClass("nav-francais").find("a").text("Français");
				translate('english');
    		} else if(parent.hasClass("nav-francais")) {
    			lang = "fr";
    			parent.removeClass("nav-francais").addClass("nav-english").find("a").text("English");
    			translate('french');
    		}

     		window.location.hash = "lang=" + lang;
        	document.documentElement.className = "lang-" + lang + " js";
        	
    		event.preventDefault();
    		event.stopImmediatePropagation();
    		event.stopPropagation();
    		return true;
    	})

    	// Hide other language:
    	// let language = QueryString.lang;
    	
    	// let otherLang = lang == "fr" ? "en" : "fr";


        // On the home page, move the blog icon inside the header 
        // for better relative/absolute positioning.

        //$("#blog-logo").prependTo("#site-head-content");

       
    });

}(jQuery));