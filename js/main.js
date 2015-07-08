function setIntro() {
	var windowW = $(window).width();
	var windowH = $(window).height();
  var introH = $('#intro').height();
  var introIh= $('#intro').innerHeight();
  var introP = parseInt($('#intro').css('padding-top')) * 2;

  $('#intro').css('line-height', '');

  if (windowH > introH) {
   $('#intro').css('line-height', windowH - introP + 'px');
  } else {
   $('#intro').css('line-height', '');
  }
}

function onScroll(event){
	var scrollPosition = $(document).scrollTop();
	$('.mainNav a').each(function () {
		var currentLink = $(this);
		var refElement = $(currentLink.attr("href"));
		if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
			$('.mainNav a').removeClass("active");
			currentLink.addClass("active");
		}
		else{
			currentLink.removeClass("active");
		}
	});
}

function setWork() {
	var windowW = $(window).width();
	var windowH = $(window).height();

	if (windowW < 1024 && windowW > 849) {
		$('#projectList .project:nth-child(5)').removeClass('horizontal').addClass('square');
		$('#projectList .project:first-child, #projectList .project:nth-child(4)').removeClass('horizontal').addClass('vertical');
	} else  if (windowW < 850) {
		$('#projectList .project:nth-child(5)').removeClass('horizontal').addClass('square');
		$('#projectList .project:first-child, #projectList .project:nth-child(4)').removeClass('vertical').addClass('horizontal');
	} else {
		$('#projectList .project:nth-child(5), #projectList .project:nth-child(4)').removeClass('vertical').addClass('horizontal');
		$('#projectList .project:first-child').removeClass('horizontal').addClass('vertical');
	}
}

function setWaypoints() {
	new Waypoint ({
		element: $('#skills'),
		handler: function(direction) {
			if (direction == 'down') {
	    		$('#homeNav').addClass('hide');
	    		$('#navbar').removeClass('before');
          $('#navbar').addClass('animate');
	  		} else {
	  			$('#homeNav').removeClass('hide');
	  			$('#navbar').addClass('before');
	  		}
		},
		offset: 100
	})

	new Waypoint.Inview({
		element: $('#guage'),
		enter: function() {
			$('#guage').addClass('inview');
		},
		exit: function() {
			$('#guage').removeClass('inview');
		}
	})

	new Waypoint.Inview({
		element: $('#systems'),
		enter: function() {
			$('#systems,#frameworks').removeClass('before');
		},
		exit: function() {
			$('#systems,#frameworks').addClass('before');
		}
	})
}

// prevents delay on touch
$(function() {
    FastClick.attach(document.body);
});


$(document).ready(function() {
	// keep reloads to top
  $(this).scrollTop(0);

  // init intro bg parallax
	$(window).scroll(function() {
  	var x = $(this).scrollTop();

  	$('.no-touch #intro').css({
      'background-position': 'center ' + parseInt(-x / 8) + 'px',
      'background-attachment': 'fixed'
    });
	});

  // inject svgs
  var svgImg = document.querySelectorAll('img.svg-inject');
  SVGInjector(svgImg);

  // move main page back on "back" button click
	$('.back').click(function(e) {
		e.preventDefault();
		$('#pageWrap,#navbar').animate({'margin-left': '0'}, 600, 'easeOutQuart');
		$('#projectWrap,#projectNavbar').animate({'left': '100%'}, 600, 'easeOutQuart');
		$('body').removeClass('project-open');
    $('#navbar a.work').addClass('active');

    // toggle active class for menu
    $(document).on("scroll", onScroll);
	});

	// ajax in work
	$("a.project").on("click", function(e) {
      e.preventDefault();
      t = $(this);

      $('#pageWrap,#navbar').animate({'margin-left': '-100%'}, 600, 'easeOutQuart');
      $('#projectWrap,#projectNavbar').animate({'left': '0'}, 600, 'easeOutQuart');

      $('#projectWrap').removeClass().addClass(t.attr("data-project"));


      $("#projectWrap .content").empty();
      $('body').append('<div class="loading"><div class="bullet" /><div class="bullet" /><div class="bullet" /></div>');
      $('body').addClass('project-open');
      $("#projectWrap .content").load("projects/" + t.attr("data-project") + ".html .content >", function() {
          $(this).hide();
          $(this).imagesLoaded(function() {
        		$('div.loading').fadeOut(500, function() {
          		$(this).detach();
          	});
        		$('#projectWrap .content').fadeIn(1000);
          });
      });
  });

	// fit images to cover containers
	$('.img-contain').imagefill();

	// toggle active class for menu
	$(document).on("scroll", onScroll);
 
	// smooth scroll
  $('#navbar a[href^="#"], #homeNav a[href^="#"]').on('click', function(e) {
		e.preventDefault();
		$(document).off("scroll");

		$('#navbar a, #homeNav a').each(function () {
			$(this).removeClass('active');
		});
		$(this).addClass('active');

		var target = this.hash;
		$target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top + 2
		}, 1000, 'easeOutQuart', function () {
			$(document).on("scroll", onScroll);
		});
	});

  // form effects
	$('.form-content input,.form-content textarea').blur(function()
		{
		  if( !$(this).val() ) {
		    $(this).parent().removeClass('has-content');
			} else {
				$(this).parent().addClass('has-content');
			}
	});

	$('.form-content textarea').focus(function() {
		$(this).parent().addClass('open');
	});

	$('.form-content textarea').blur(function() {
		$(this).parent().removeClass('open');
	});

  // form validation
  $('form[name=lets-connect]').submit(function(e) {
    $('form[name=lets-connect] input[name=js-submission]').val(1);
    e.preventDefault();
    var dataString = $(this).serialize();
    $('.contact-form').append('<div class="loading"><div class="bullet" /><div class="bullet" /><div class="bullet" /></div>');

    $.ajax({
      type: 'POST',
      url: 'form.php',
      dataType: 'json',
      data: dataString,
      cache: false,
      success: function(data) {
        $('form[name=lets-connect] input').parent().removeClass('error');
        $('form[name=lets-connect] textarea').parent().removeClass('error');

        $('div.loading').fadeOut(500, function() {
          $(this).detach();

          if (data.success && data.errors.length == 0) {
            $('div.form-errors').slideUp(400);
            $('div.form-content').slideUp(400, function() {
              $('div.form-confirmation').slideDown(200);
              $('html,body').animate({
                scrollTop: $('.contact-form').offset().top - 43
              }, 600, 'easeOutQuart');
            });
          } else {
            $('div.form-errors').slideDown(200);
            $('html,body').animate({
              scrollTop: $('.form-content').offset().top - 43
            }, 600, 'easeOutQuart');
            for (var i = 0; i < data.errors.length; i++) {
              $('form[name=lets-connect] input[name=' + data.errors[i] + ']').parent().addClass('error');
              $('form[name=lets-connect] textarea[name=' + data.errors[i] + ']').parent().addClass('error');
            }
          }
        });
      },
      error: function() {
        $('div.loading').fadeOut(500, function() {
          $(this).detach();
          $('div.form-errors').slideDown(200);
          $('html,body').animate({
            scrollTop: $('.form-content').offset().top - 43
          }, 600, 'easeOutQuart');
        });
      }
    });
    return false;
  });

	// init
	setIntro();
	setWaypoints();
	setWork();
});

$(window).load(function() {

	$('div.loading').detach();
  $('html').addClass('loaded');

	// intro animation
  setTimeout(function() {
		$('h1').removeClass('before');
	}, 300);
  setTimeout(function() {
    $('#homeNav').removeClass('before');
  }, 1300);

});

$(window).resize(function() {

	// reset some things
	setIntro();
	setWork();

});

$(document).ajaxComplete(function() {

	// fill project bg images
	$('.img-contain').imagefill();

	// inject svgs
  var svgImg = document.querySelectorAll('img.svg-inject');
  SVGInjector(svgImg);

	// next/prev functionality on projects
	$("a.project-link").on("click", function(e) {
      e.preventDefault();
      t = $(this);

      $('#projectWrap').removeClass().addClass(t.attr("data-project"));
      $('body').append('<div class="loading"><div class="bullet" /><div class="bullet" /><div class="bullet" /></div>');

      $('#projectWrap .content').fadeOut(500, function() {
      	$("#projectWrap .content").empty();
	      $("#projectWrap .content").load("projects/" + t.attr("data-project") + ".html .content >", function() {
	          $(this).hide();
	          $(this).imagesLoaded(function() {
          		$('div.loading').fadeOut(500, function() {
	          		$(this).detach();
	          	});
              $('#projectWrap').scrollTop(0);
          		$('#projectWrap .content').css('top', '50px').fadeIn({
                duration: 1500,
                queue: false
              }).animate({
                top:0,
              }, 1500, 'easeOutQuart');
	          });
	      });
      });
  });

  // move main page back on grid button click
  $('.grid-btn').click(function(e) {
    e.preventDefault();
    $('#pageWrap,#navbar').animate({'margin-left': '0'}, 600, 'easeOutQuart');
    $('#projectWrap,#projectNavbar').animate({'left': '100%'}, 600, 'easeOutQuart');
    $('body').removeClass('project-open');
    $('#navbar a.work').addClass('active');

    // toggle active class for menu
    $(document).on("scroll", onScroll);
  });

});
