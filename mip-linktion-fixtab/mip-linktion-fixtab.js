/**
 * @file mip-linktion-fixtab 组件
 * @author
 */

define(function (require) {
    'use strict';
    // var $ = require('jquery');

    var customElement = require('customElement').create();

    /**
     * 第一次进入可视区回调，只会执行一次
     */
    customElement.prototype.firstInviewCallback = function () {
        var $el = $(this.element);
        var tabTop = $el.find('mip-vd-tabs').offset().top;
        var tabWidth = $el.find('.tab-content').width();
        window.onscroll = function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > tabTop) {
                if ($(window).width() < 769) {
                    $el.find('.mip-vd-tabs-nav').css({'position': 'fixed', 'top': '0', 'width':
                        + tabWidth, 'z-index': '1', 'left': '0'});
                } else {
                    $el.find('.mip-vd-tabs-nav').css({'position': 'fixed', 'top': '96px', 'width':
                        + tabWidth, 'z-index': '1'});
                }
            } else if (scrollTop < tabTop) {
                $el.find('.mip-vd-tabs-nav').css({'position': 'relative', 'top': 'auto', 'width':
                    + tabWidth, 'z-index': '1'});
            }
        };
    };

    return customElement;
});
