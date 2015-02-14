// Ajaxify
// v1.0.1 - 30 September, 2012
// https://github.com/browserstate/ajaxify
(function(window,undefined){
  
  // Prepare our Variables
  var
    History = window.History,
    $ = window.jQuery,
    document = window.document;

  // Check to see if History.js is enabled for our Browser
  if ( !History.enabled ) {
    return false;
  }

  // Wait for Document
  $(function(){
    // Prepare Variables
    var
      /* Application Specific Variables */
      contentSelector = '#page-content',
      $content = $(contentSelector).filter(':first'),
      contentNode = $content.get(0),
      $menu = $('.nav-global').filter(':first'),
      activeClass = 'current-menu-item',
      activeSelector = '.current-menu-item',
      menuChildrenSelector = '>.menu-item, .sub-nav>.menu-item',
      completedEventName = 'endstatechange',
      $artistsLink = $('.js-artists-link'),
      $otherLinks = $('.main-nav>li').not('.js-artists-link'),
      openedClass = 'sub-nav-opened',
      /* Application Generic Variables */
      $window = $(window),
      $body = $(document.body),
      rootUrl = History.getRootUrl(),
      scrollOptions = {
        duration: 0,
        easing:'swing'
      };
    
    // Ensure Content
    if ( $content.length === 0 ) {
      $content = $body;
    }
    
    // Internal Helper
    $.expr[':'].internal = function(obj, index, meta, stack){
      // Prepare
      var
        $this = $(obj),
        url = $this.attr('href')||'',
        isInternalLink;
      
      // Check link
      isInternalLink = url.substring(0,rootUrl.length) === rootUrl || url.indexOf(':') === -1;
      
      // Ignore or Keep
      return isInternalLink;
      var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
      if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return false;
      if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return false;
      return true;
    };
    
    // HTML Helper
    var documentHtml = function(html){
      // Prepare
      var result = String(html)
        .replace(/<\!DOCTYPE[^>]*>/i, '')
        .replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
        .replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
      ;
      
      // Return
      return $.trim(result);
    };
    
    // Ajaxify Helper
    $.fn.ajaxify = function(){
      // Prepare
      var $this = $(this);
      
      // Ajaxify
      $this.on('click',"a[target!='new'][target!='_blank']:internal:not(.no-ajax)", function(event){
      // $this.find("a[target!='new'][target!='_blank']:not(.no-ajax)").click(function(event){
        // Prepare
        var
          $this = $(this),
          url = $this.attr('href'),
          title = $this.attr('title')||null;
        
        // Continue as normal for cmd clicks etc
        if ( event.which == 2 || event.metaKey ) { return true; }
        
        // Ajaxify this link
        History.pushState(null,title,url);
        event.preventDefault();
        return false;
      });
      
      // Chain
      return $this;
    };
    
    // Ajaxify our Internal Links
    $body.ajaxify();
    
    // Hook into State Changes
    $window.bind('statechange',function(){
      // Prepare Variables
      var
        State = History.getState(),
        url = State.url,
        relativeUrl = url.replace(rootUrl,'');

      // Set Loading
      $('.js-artists-nav').removeAttr('style');
      $body.removeClass('nav-opened').addClass('loading');

      // Start Fade Out
      // Animating to opacity to 0 still keeps the element's height intact
      // Which prevents that annoying pop bang issue when loading in new content
      $content.animate({opacity:0},300);
      
      // Ajax Request the Traditional Page
      $.ajax({
        url: url,
        success: function(data, textStatus, jqXHR){
          // Prepare
          var
            $data = $(documentHtml(data)),
            $dataBody = $data.find('.document-body:first'),
            bodyClasses   = $dataBody.attr('data-classes'),
            $dataContent = $dataBody.find(contentSelector).filter(':first'),
            $menuChildren, contentHtml, $scripts;
          
          //Add classes to body
          $('body').attr('class', bodyClasses);

          // Fetch the scripts
          $scripts = $dataContent.find('.document-script');
          if ( $scripts.length ) {
            $scripts.detach();
          }

          // Fetch the content
          contentHtml = $dataContent.html()||$data.html();
          if ( !contentHtml ) {
            document.location.href = url;
            return false;
          }
          
          // Update the menu
          $menuChildren = $menu.find(menuChildrenSelector);
          $menuChildren.filter(activeSelector).removeClass(activeClass);
          $menuChildren = $menuChildren.has('a[href^="'+relativeUrl+'"],a[href^="/'+relativeUrl+'"],a[href^="'+url+'"]');
          if ( $menuChildren.length > 1 ) {
            $menuChildren = $menuChildren.has('a[href="'+relativeUrl+'"],a[href="/'+relativeUrl+'"],a[href="'+url+'"]');
            if ($artistsLink.hasClass(openedClass)) {
              $artistsLink.removeClass(openedClass);
              setTimeout(function() {
                $otherLinks.fadeIn(600);
              }, 400);
            }
          }
          if ( $menuChildren.length === 1 ) {
            $menuChildren.addClass(activeClass);
            if ($artistsLink.hasClass(openedClass)) {
              $artistsLink.removeClass(openedClass);
              setTimeout(function() {
                $otherLinks.fadeIn(600);
              }, 400);
            }
          }
          if ( $body.hasClass('home') ) { $menuChildren.removeClass(activeClass); }



          // Update the content
          $content.stop(true,true);
          $content.html(contentHtml).ajaxify().css('opacity',100).show(); /* you could fade in here if you'd like */

          // Update the title
          document.title = $data.find('.document-title:first').text();
          try {
            document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
          }
          catch ( Exception ) { }
          
          // Add the scripts
          $scripts.each(function(){
            var $script = $(this), scriptText = $script.text(), scriptNode = document.createElement('script');
            if ( $script.attr('src') ) {
              if ( !$script[0].async ) { scriptNode.async = false; }
              scriptNode.src = $script.attr('src');
            }
                scriptNode.appendChild(document.createTextNode(scriptText));
            contentNode.appendChild(scriptNode);
          });

          // Complete the change
          if ( $body.ScrollTo||false ) { $body.ScrollTo(scrollOptions); } /* http://balupton.com/projects/jquery-scrollto */
          $body.removeClass('loading');
          $('.header-main').removeClass('scrolled').removeClass('solid');
          $window.trigger(completedEventName);
  
          // Inform Google Analytics of the change
          if ( typeof window._gaq !== 'undefined' ) {
            window._gaq.push(['_trackPageview', relativeUrl]);
          }

          // Inform ReInvigorate of a state change
          if ( typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined' ) {
            reinvigorate.ajax_track(url);
            // ^ we use the full url here as that is what reinvigorate supports
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
          document.location.href = url;
          return false;
        }
      }); // end ajax

    }); // end onStateChange

  }); // end onDomLoad

})(window); // end closure