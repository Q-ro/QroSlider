//
//  JS script for the Presentation slide.
//  Created by : Andres Mrad (Q-ro).
//  Based off and article by Patrick Kunka at : http://www.barrelny.com/
//  Creation date: July 2 2013.
//

(function ($) {
    function prefix(el) {
        var prefixes = ["Webkit", "Moz", "O", "ms"];
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] + "Transition" in el.style) {
                return '-' + prefixes[i].toLowerCase() + '-';
            };
        };
        return "transition" in el.style ? "" : false;
    };
    var methods = {
        init: function (settings) {
            return this.each(function () {
                var config = {
                    slide_Duration: 7000,
                    fade_Duration: 800,
                    thumbnails: false
                };
                if (settings) {
                    $.extend(config, settings);
                };
                this.config = config;
                var $container = $(this),
                    slideSelector = '.slide',
                    fading = false,
                    slideTimer,
                    activeSlide,
                    newSlide,
                    $slides = $container.find(slideSelector),
                    totalSlides = $slides.length,
                    $pagerList = $container.find('.pager_list');
                prefix = prefix($container[0]);

                function animateSlides(active_Index, new_Index) {
                    function cleanUp() {
                        $slides.eq(active_Index).removeAttr('style');
                        activeSlide = new_Index;
                        fading = false;
                        waitForNext();
                    };
                    if (fading || active_Index == new_Index) {
                        return false;
                    };
                    fading = true;
                    $pagers.removeClass('active').eq(newSlide).addClass('active');
                    $slides.eq(active_Index).css('z-index', 3);
                    $slides.eq(new_Index).css({
                        'z-index': 2,
                        'opacity': 1
                    });
                    if (!prefix) {
                        $slides.eq(active_Index).animate({
                            'opacity': 0
                        }, config.fade_Duration, function () {
                            cleanUp();
                        });
                    } else {
                        var styles = {};
                        styles[prefix + 'transition'] = 'opacity ' + config.fade_Duration + 'ms';
                        styles['opacity'] = 0;
                        $slides.eq(active_Index).css(styles);
                        var fadeTimer = setTimeout(function () {
                            cleanUp();
                        }, config.fade_Duration);
                    };
                };

                function changeSlides(target) {

                    switch (target) {
                    case 'next':
                        newSlide = activeSlide + 1;
                        if (newSlide > totalSlides - 1) {
                            newSlide = 0;
                        }
                        break;
                    case 'prev':
                        newSlide = activeSlide - 1;
                        if (newSlide < 0) {
                            newSlide = totalSlides - 1;
                        };
                        break;
                    default:
                        newSlide = target;
                    }
                    animateSlides(activeSlide, newSlide);
                };

                function waitForNext() {
                    slideTimer = setTimeout(function () {
                        changeSlides('next');
                    }, config.slide_Duration);
                };
                for (var i = 0; i < totalSlides; i++) {
                    if (config.thumbnails === true)
                    {
                        generateThumbnails();
                    }
                    else
                    {
                        $pagerList.append('<li class="page" data-target="' + i + '"></li>');
                    }
                    
                };
                $container.find('.page').bind('click', function () {
                    var target = $(this).attr('data-target');
                    clearTimeout(slideTimer);
                    changeSlides(target);
                });
                var $pagers = $pagerList.find('.page');
                $slides.eq(0).css('opacity', 1);
                $pagers.eq(0).addClass('active');
                activeSlide = 0;
                waitForNext();
            });

            function generateThumbnails() {
                /*Create thumbnails for the images on the slider*/
            };
        }
    };
    $.fn.QroSlider = function (settings) {
        return methods.init.apply(this, arguments);
    };
})(jQuery);

$(function () {
    $('#QroSlider').QroSlider({
        slide_Duration: 4000,
        fade_Duration: 800,
        thumbnails: false
    });
});