// Remove Hash from URL
function removeHash () { 
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

// Store element & class vars
var
  $body = $('body'),
  $pageContent = $('#page-content'),
  $portfolio = $('#portfolio'),
  $blockGrid = $body.find('.js-block-grid'),
  $blockGridInner = $body.find('.js-block-grid-inner'),
  gridView = 'grid-view',
  fullView = 'full-view',
  $header = $('.header-main'),
  $fullViewWrapper = $body.find('#portfolio > .wrapper');

// Store Isotope & Flexslider Options
var isoOptions = {
    itemSelector: '.js-grid-item',
      transformsEnabled: true,
      transitionDuration: 0,
      masonry: {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer'
      }
  };

$('.slide-direction-nav a').click(function(e) {
  e.preventDefault();
});

var flexOptions = {
  selector: ".js-block-grid-inner > .js-slide-item",
  animation: "fade",
  easing: "swing",
  useCSS: true,
  slideshow: false,
  namespace: "slide-",
  smoothHeight: false,
  animationSpeed: 600,
  controlNav: false,
  directionNav: false,
  start: function(slider) {
    $('.slide-direction-nav a').click(function(e) {
      e.preventDefault();
      if ($(this).hasClass('slide-next')) {
        slider.flexAnimate(slider.getTarget("next"));
      }
      else if ($(this).hasClass('slide-prev')) {
        slider.flexAnimate(slider.getTarget("prev"));
      }
    });
  },
  before: function(slider) {
    $captionMaster.addClass('loading');
  },
  after: function(slider) {
    var
      History = window.History,
      originalUrl = window.location.href.split("#",1),
      newSlide = (parseInt(slider.currentSlide) || 1) +1,
      imageNum = $('.slide-active-slide').attr('data-img-num'),
      imageCaption = $('.slide-active-slide').attr('data-img-caption'),
      $captionMaster = $body.find('.portfolio-caption'),
      $numContain = $body.find('.portfolio-caption .img-counter span.current-img'),
      $captionContain = $body.find('.portfolio-caption .img-caption');
    History.pushState('', '', originalUrl + '#' + newSlide);
    $numContain.text(imageNum);
    $captionContain.text(imageCaption);
    $captionMaster.removeClass('loading');
  },
};

function fitFrontPage () {
  if ($body.hasClass('home')) {
    var windowHeight = $(window).outerHeight();
    var footerHeight = $('.js-footer').outerHeight();
    var computedHeight = windowHeight - footerHeight;
    $(document).find('#page-content').css('height', computedHeight);
  }
}

// Fit Full View
function fitFullView () {
  var windowHeight = $(window).outerHeight();
  var headerHeight = $('.header-main').outerHeight();
  var portfolioHeaderHeight = $body.find('#portfolio .js-portfolio-header').outerHeight();
  var computedHeight = windowHeight - (headerHeight + portfolioHeaderHeight);
  $fullViewWrapper.css('height', computedHeight);
}

function removeFullView () {
  $fullViewWrapper.removeAttr('style');
}

function allHovers () {

  $('.portfolio-card').each(function() {
    var portfolioID = $(this).attr('data-portfolio');
    var $matchingLink = $(document).find(".portfolio-links a[data-portfolio='"+portfolioID+"']");
    var hoveredClass = 'hovered';
    $(this).mouseenter(function() {
      $matchingLink.addClass(hoveredClass);
    });
    $(this).mouseleave(function() {
      $matchingLink.removeClass(hoveredClass);
    });
  });

  $('.portfolio-links a').each(function() {
    var portfolioID = $(this).attr('data-portfolio');
    var $matchingLink = $(document).find("a.portfolio-card[data-portfolio='"+portfolioID+"']");
    var hoveredClass = 'hovered';
    $(this).mouseenter(function() {
      $matchingLink.addClass(hoveredClass);
    });
    $(this).mouseleave(function() {
      $matchingLink.removeClass(hoveredClass);
    });
  });

  // Discipline Hover
  $('.discipline-link').each(function() {
    var bodyClass = 'discipline-hovered';
    var previewParent = '.preview-' + $(this).attr('data-name');
    var preview = '.discipline-preview';
    var $preview = $body.find(previewParent).children('.discipline-preview')
    var activeClass = 'preview-active';
    var currentClass = 'preview-next';
    $(this).mouseenter(function() {
      var $currentPreview = $body.find(previewParent).children('.discipline-preview.preview-next');
      $body.addClass(bodyClass);
      if ($currentPreview.is(':last-child')) {
        $currentPreview.addClass(activeClass).removeClass(currentClass);
        $preview.first().addClass(currentClass);
      }
      else {
        $currentPreview.addClass(activeClass).removeClass(currentClass).next(preview).addClass(currentClass);
      }
    });

    $(this).mouseleave(function() {
      $body.removeClass(bodyClass);
      var $activePreview = $body.find(previewParent).children('.discipline-preview.preview-active');
      $activePreview.removeClass(activeClass);
    });
  });

  // Aritst Card Hover
  $('.artist-card.more-thumbs').mouseenter(function() {
    var thumb = '.image-thumb';
    var $thumb = $('.image-thumb');
    var activeClass = 'thumb-active';
    var $activeThumb = $(this).find('.image-thumb.thumb-active');
    if ($activeThumb.is(':last-child')) {
      $activeThumb.removeClass(activeClass);
      $(this).find(thumb).first().addClass(activeClass);
    }
    else {
      $activeThumb.removeClass(activeClass).next(thumb).addClass(activeClass);
    }
  });
}

function bioOpener () {
  var $artist = $('#artist');
  var $bioMore = $artist.find('.bio-more');
  
  $('.js-read-more').click(function(e) {
    e.preventDefault();
    var $bio = $(this).parent(); 
    var $bioMore = $bio.find('.bio-more');
    var bioHeight = $bio.find('.bio-more-inner').outerHeight();
    
    if ($artist.hasClass('bio-opened')) {
      $artist.removeClass('bio-opened');
      $bioMore.removeAttr('style');
      $(this).text('Full Bio').removeAttr('style');
    }
    else {
      $bioMore.css('height',bioHeight);
      $artist.addClass('bio-opened');
      $(this).text('Close Bio').css('bottom', 0 - bioHeight);
    }
  });
}

function portfolioActions () {
  // Store element & class vars
  var $body = $('body');
  if ($('#page-content #portfolio').length) {
    var
      $portfolio = $body.find('#portfolio');
      $blockGrid = $body.find('.js-block-grid');
      $blockGridInner = $body.find('.js-block-grid-inner');
      gridView = 'grid-view';
      fullView = 'full-view';
      $captionMaster = $body.find('.portfolio-caption'),
      $numContain = $body.find('.portfolio-caption .img-counter span.current-img'),
      $captionContain = $body.find('.portfolio-caption .img-caption');
    // Portfolio Image Click
    $('.thumb-trigger').each(function() {
      $(this).click(function(event) {
        event.preventDefault();
        var
          view = $body.attr('data-view'),
          imageNum = $(this).parent('.img-wrap').attr('data-img-num'),
          imageCaption = $(this).parent('.img-wrap').attr('data-img-caption'),
          index = (parseInt(imageNum) || 1) -1,
          startHash = {
            startAt: index,
          };
        var flexOptionsHash = $.extend(flexOptions, startHash); 
        if (view === gridView) {
          var $container = $blockGridInner.isotope( isoOptions );
          $container.isotope('destroy');
          $body.removeAttr('data-view').attr('data-view', fullView);
          $body.addClass(fullView);
          var windowHeight = $(window).outerHeight();
          var headerHeight = $('.header-main').outerHeight();
          var portfolioHeaderHeight = $body.find('#portfolio .js-portfolio-header').outerHeight();
          var computedHeight = windowHeight - (headerHeight + portfolioHeaderHeight);
          $fullViewWrapper = $body.find('#portfolio > .wrapper');
          $fullViewWrapper.css('height', computedHeight);
          window.location.hash = $(this).parent('.img-wrap').attr('data-img-num');
          $portfolio.removeClass(gridView).addClass(fullView);
          $blockGrid.flexslider(flexOptions, flexOptionsHash);
          $numContain.text(imageNum);
          $captionContain.text(imageCaption);
        } 
        else if (view === fullView) {
          // Do Stuff 
        }
      });
    });

    // View Switcher Click
    $('.js-view-switch a').each(function(){
      $(this).click(function(e) {
        e.preventDefault();
        var targetView = $(this).attr('data-target-view');
        var currentView = $body.attr('data-view');
        if (targetView === currentView) {
          // do nothing
        }
        else {
          if (targetView === gridView) {
            $blockGrid.flexslider('destroy');
            $blockGrid.removeAttr('style');
            removeHash();
            $body.removeAttr('data-view').attr('data-view', targetView);
            $portfolio.removeClass(currentView).addClass(targetView);
            removeFullView();
            var $container = $blockGridInner.isotope( isoOptions );
            $body.removeClass(fullView);
          }
          else if (targetView === fullView) {
            var $container = $blockGridInner.isotope( isoOptions );
            $container.isotope('destroy');
            $body.removeAttr('data-view').attr('data-view', fullView);
            $body.addClass(fullView);
            fitFullView();
            var indexHash = $blockGridInner.children('.img-wrap').first().attr('data-img-num');
            var startAtIndexHash = {
              startAt: indexHash - 1,
            };
            var flexOptionsIndexHash = $.extend(flexOptions, startAtIndexHash); 
            var History = window.History;
            History.pushState('', '', window.location.href + '#' + indexHash);
            $portfolio.removeClass(gridView).addClass(fullView);
            $blockGrid.flexslider(flexOptionsIndexHash);
          }
        }
      });
    });

    // Esc Key
    $(document).keydown(function(e) {
      var currentView = $body.attr('data-view');
      var key = e.which;
      if (key === 27) {
        if (currentView === fullView)
        $('.view-icon-grid').trigger("click");
      }
    });

  }
}



$(document).ready(function() {

  // Bio Opener
  $('.js-info-toggle').click(function(event){
    event.preventDefault();

    // var origText = 'Full Bio & PDFs';
    // var newText = 'Close Bio & PDFs';
    var $info = $(document).find('.artist-info');
    var $body = $('body');
    var openedClass = 'info-opened';
    var infoHeight = $info.children('.artist-info-inner').outerHeight();

    if ($body.hasClass(openedClass)) {
      $info.removeAttr('style');
      $body.removeClass(openedClass);
      // $this.children('span').text(origText);
    }
    else {
      $body.addClass(openedClass);
      $info.css('height', infoHeight);
      // $this.children('span').text(newText);
    }

  });

  // Hovers
  allHovers();

  bioOpener();


  // Portfolio Actions
  portfolioActions();



});

$(window).load(function() {

  if (window.location.hash != '') {
    startAtSlideIndex = window.location.hash.substr(1)-1;
    var startLoad = {
      startAt: startAtSlideIndex,
    };
    var flexOptionsHashLoad = $.extend(flexOptions, startLoad);
    var
      $captionMaster = $body.find('.portfolio-caption'),
      $numContain = $body.find('.portfolio-caption .img-counter span.current-img'),
      $captionContain = $body.find('.portfolio-caption .img-caption');
    $body.removeAttr('data-view').attr('data-view', fullView);
    $body.addClass(fullView);
    $portfolio.removeClass(gridView).addClass(fullView);
    fitFullView();
    $blockGrid.flexslider(flexOptionsHashLoad);
    var
      imageNum = $('.slide-active-slide').attr('data-img-num'),
      imageCaption = $('.slide-active-slide').attr('data-img-caption');
    $numContain.text(imageNum);
    $captionContain.text(imageCaption);
  }
  else {
    //Grid Masonry
    var $container = $('.js-block-grid-inner').imagesLoaded( function() {
      $container.isotope({
        itemSelector: '.js-grid-item',
        transformsEnabled: true,
        transitionDuration: 0,
        masonry: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        }
      });
    });
  }

});

$(window).resize(function() {
  if ($body.hasClass('full-view')) {
    fitFullView();
  }
});

$(window).on('statechange', function() {
  $body.removeAttr('data-view').attr('data-view', gridView);
  $pageContent.removeAttr('style');
  
});

$(window).on('endstatechange', function() {

  // Grid Masonry
  if (window.location.hash != '') {
    startAtSlideIndex = window.location.hash.substr(1)-1;
    var startLoad = {
      startAt: startAtSlideIndex,
    };
    var flexOptionsHashLoad = $.extend(flexOptions, startLoad);
    $body.removeAttr('data-view').attr('data-view', fullView);
    $body.addClass(fullView);
    $portfolio.removeClass(gridView).addClass(fullView);
    fitFullView();
    $blockGrid.flexslider(flexOptionsHashLoad);
  }
  else {
    //Grid Masonry
    var $container = $('.js-block-grid-inner').imagesLoaded( function() {

      $container.isotope({
        itemSelector: '.js-grid-item',
        transformsEnabled: true,
        transitionDuration: 0,
        masonry: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        }
      });
    });
  }

  // Bio Opener
  $('.js-info-toggle').click(function(event){
    event.preventDefault();
    // var origText = 'Full Bio & PDFs';
    // var newText = 'Close Bio & PDFs';
    var $info = $(document).find('.artist-info');
    var $body = $('body');
    var openedClass = 'info-opened';
    var infoHeight = $info.children('.artist-info-inner').outerHeight();

    if ($body.hasClass(openedClass)) {
      $info.removeAttr('style');
      $body.removeClass(openedClass);
      // $this.children('span').text(origText);
    }
    else {
      $body.addClass(openedClass);
      $info.css('height', infoHeight);
      // $this.children('span').text(newText);
    }

  });

  // Hovers
  allHovers();

  bioOpener();

  // Portfolio Actions
  portfolioActions();

});

$(window).scroll(function() {

  var fixedTop = $('.js-has-fixed').offset().top;
  var scroll = $(window).scrollTop();
  if ( $body.find('.fixed-content')) {
    if (scroll >= fixedTop) {
      $('.fixed-content').addClass('fixed');
    }
    else {
      $('.fixed-content').removeClass('fixed');
    }
  }
  


});